import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt
from db.supabase_client import supabase

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "brics-climatepulse-super-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for hackathon

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


# --- Schemas ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "citizen"  # "citizen" or "authority"
    region_id: Optional[UUID] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: dict


# --- Helpers ---


# --- Password Helpers using native bcrypt ---
def hash_password(password: str) -> str:
    # Truncate to 72 bytes to strictly satisfy bcrypt's limit
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    try:
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to verify JWT token on protected routes"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# --- Endpoints ---

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister):
    if payload.role not in ["citizen", "authority", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    # 1. Check if user already exists
    existing = supabase.table("users").select("id").eq("email", payload.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password & insert into users table
    hashed_pwd = hash_password(payload.password)
    user_entry = {
        "name": payload.name,
        "email": payload.email,
        "role": payload.role,
        "region_id": str(payload.region_id) if payload.region_id else None,
        # Store hash in a column or pass through metadata
    }

    try:
        # Note: If your schema.sql doesn't have password_hash, add it via ALTER TABLE (see Step 3)
        user_entry["password_hash"] = hashed_pwd
        res = supabase.table("users").insert(user_entry).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        user = res.data[0]
        token = create_access_token({
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"],
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "region_id": user.get("region_id")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    # 1. Fetch user by email
    res = supabase.table("users").select("*").eq("email", payload.email).execute()
    if not res.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user = res.data[0]

    # 2. Verify password
    stored_hash = user.get("password_hash")
    if not stored_hash or not verify_password(payload.password, stored_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # 3. Create real signed JWT token
    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "region_id": user.get("region_id")
        }
    }


@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    """Returns currently authenticated user profile from token payload"""
    return user