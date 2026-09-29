from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reports, hotspots, forecast,alerts,federated
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str
    
app = FastAPI(
    title="ClimatePulse API",
    description="Federated Air Quality Intelligence for BRICS Cities",
    version="1.0.0"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(reports.router)
app.include_router(hotspots.router)
app.include_router(forecast.router)
app.include_router(alerts.router)
app.include_router(federated.router)


@app.post("/api/auth/login", tags=["Auth"])
def login(credentials: LoginRequest):
    # Mock authentication for hackathon demo
    if "authority" in credentials.email.lower() or "admin" in credentials.email.lower():
        return {
            "token": "demo-authority-token",
            "role": "authority",
            "name": "Municipal Air Quality Officer"
        }
    return {
        "token": "demo-citizen-token",
        "role": "citizen",
        "name": "Citizen User"
    }
@app.get("/")
def root():
    return {"message": "ClimatePulse Backend is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}