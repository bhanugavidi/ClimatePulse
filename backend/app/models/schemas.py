from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

# --- Report Schemas ---
class ReportCreate(BaseModel):
    region_id: UUID
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)
    photo_url: Optional[str] = None
    description: Optional[str] = None
    reported_pm25: Optional[float] = None
    user_id: Optional[UUID] = None

class ReportResponse(BaseModel):
    id: UUID
    region_id: UUID
    user_id: Optional[UUID] = None
    lat: float
    lng: float
    photo_url: Optional[str] = None
    description: Optional[str] = None
    reported_pm25: Optional[float] = None
    ai_score: Optional[int] = None
    ai_category: Optional[str] = None
    severity: Optional[str] = None
    status: str
    created_at: datetime

# --- Hotspot Schemas ---
class HotspotResponse(BaseModel):
    id: UUID
    region_id: UUID
    center_lat: float
    center_lng: float
    radius_m: int
    risk_level: Optional[str] = None
    report_count: int
    last_updated: datetime