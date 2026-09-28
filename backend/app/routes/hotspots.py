from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
from db.supabase_client import supabase
from app.models.schemas import HotspotResponse

router = APIRouter(prefix="/api/hotspots", tags=["Hotspots"])

@router.get("", response_model=List[HotspotResponse])
def get_hotspots(region_id: Optional[UUID] = None, risk_level: Optional[str] = None):
    try:
        query = supabase.table("pollution_hotspots").select("*")
        if region_id:
            query = query.eq("region_id", str(region_id))
        if risk_level:
            query = query.eq("risk_level", risk_level)
            
        response = query.order("last_updated", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))