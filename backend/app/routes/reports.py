from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from uuid import UUID
from db.supabase_client import supabase
from app.models.schemas import ReportCreate, ReportResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])

def calculate_initial_ai_score(reported_pm25: Optional[float], has_photo: bool):
    """Temporary rule-based scoring until ai_scoring.py is fully connected"""
    score = 40
    category = "haze"
    
    if reported_pm25:
        if reported_pm25 > 150:
            score = 85
            category = "smoke"
        elif reported_pm25 > 80:
            score = 65
            category = "haze"
    elif has_photo:
        score = 60
        category = "smoke"

    if score >= 80:
        severity = "high"
    elif score >= 50:
        severity = "moderate"
    else:
        severity = "low"

    return score, category, severity

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def submit_report(payload: ReportCreate):
    score, category, severity = calculate_initial_ai_score(
        payload.reported_pm25, 
        bool(payload.photo_url)
    )

    data = {
        "region_id": str(payload.region_id),
        "user_id": str(payload.user_id) if payload.user_id else None,
        "lat": payload.lat,
        "lng": payload.lng,
        "photo_url": payload.photo_url,
        "description": payload.description,
        "reported_pm25": payload.reported_pm25,
        "ai_score": score,
        "ai_category": category,
        "severity": severity,
        "status": "new"
    }

    try:
        response = supabase.table("pollution_reports").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Database insertion failed")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ReportResponse])
def get_reports(region_id: Optional[UUID] = None, severity: Optional[str] = None):
    try:
        query = supabase.table("pollution_reports").select("*")
        if region_id:
            query = query.eq("region_id", str(region_id))
        if severity:
            query = query.eq("severity", severity)
        
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))