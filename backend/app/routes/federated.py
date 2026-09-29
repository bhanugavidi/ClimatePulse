from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import Dict, Any
from uuid import UUID
from datetime import datetime, timezone
from db.supabase_client import supabase

router = APIRouter(prefix="/api/federated", tags=["Federated"])

class FederatedPacket(BaseModel):
    source_region_id: UUID
    target_region_id: UUID
    risk_summary_json: Dict[str, Any]

@router.post("/share", status_code=status.HTTP_201_CREATED)
def share_prediction_packet(packet: FederatedPacket):
    """
    Ingests a privacy-preserving summary packet from a neighboring region/country.
    Stores the model signal without needing raw citizen telemetry.
    """
    payload = {
        "source_region_id": str(packet.source_region_id),
        "target_region_id": str(packet.target_region_id),
        "risk_summary_json": packet.risk_summary_json,
        "shared_at": datetime.now(timezone.utc).isoformat()
    }
    try:
        res = supabase.table("federated_predictions").insert(payload).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to record federated exchange")
        return {
            "status": "success",
            "message": "Prediction packet transmitted successfully",
            "packet": res.data[0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/combined")
def get_combined_regional_view(region_id: UUID = Query(...)):
    """
    Returns local risk summary + inbound shared prediction packets
    from neighboring border regions.
    """
    try:
        # 1. Fetch inbound shared packets for this region
        inbound = (
            supabase.table("federated_predictions")
            .select("*")
            .eq("target_region_id", str(region_id))
            .order("shared_at", desc=True)
            .limit(5)
            .execute()
        )

        # 2. Fetch local hotspots
        local_hotspots = (
            supabase.table("pollution_hotspots")
            .select("*")
            .eq("region_id", str(region_id))
            .execute()
        )

        return {
            "region_id": str(region_id),
            "local_hotspots_count": len(local_hotspots.data),
            "inbound_cross_border_signals": inbound.data,
            "transboundary_risk": "elevated" if len(inbound.data) > 0 else "nominal"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))