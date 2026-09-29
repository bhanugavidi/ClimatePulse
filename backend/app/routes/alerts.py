from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone
from db.supabase_client import supabase

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

class AlertStatusUpdate(BaseModel):
    status: str  # 'open', 'acknowledged', 'escalated', 'resolved'

@router.get("")
def list_alerts(
    region_id: Optional[UUID] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status")
):
    try:
        # First, check if any high/severe hotspots need alerts created
        hotspot_query = supabase.table("pollution_hotspots").select("*").in_("risk_level", ["high", "severe"])
        if region_id:
            hotspot_query = hotspot_query.eq("region_id", str(region_id))
        hotspots = hotspot_query.execute().data

        for hs in hotspots:
            # Check if active alert already exists for this hotspot
            existing = (
                supabase.table("alerts")
                .select("id")
                .eq("hotspot_id", hs["id"])
                .in_("status", ["open", "acknowledged", "escalated"])
                .execute()
            )
            if not existing.data:
                alert_entry = {
                    "hotspot_id": hs["id"],
                    "region_id": hs["region_id"],
                    "message": f"Critical pollution cluster detected ({hs['report_count']} reports) with risk level: {hs['risk_level'].upper()}.",
                    "severity": hs["risk_level"],
                    "status": "open",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                supabase.table("alerts").insert(alert_entry).execute()

        # Query and return alerts
        query = supabase.table("alerts").select("*")
        if region_id:
            query = query.eq("region_id", str(region_id))
        if status_filter:
            query = query.eq("status", status_filter)

        alerts = query.order("created_at", desc=True).execute()
        return alerts.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{alert_id}")
def update_alert_status(alert_id: UUID, payload: AlertStatusUpdate):
    valid_statuses = ["open", "acknowledged", "escalated", "resolved"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )

    try:
        res = (
            supabase.table("alerts")
            .update({"status": payload.status})
            .eq("id", str(alert_id))
            .execute()
        )
        if not res.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))