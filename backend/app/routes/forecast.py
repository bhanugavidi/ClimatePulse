from fastapi import APIRouter, HTTPException, Query
from uuid import UUID
from db.supabase_client import supabase
from app.services.weather_client import get_or_fetch_weather
from app.services.forecasting import generate_short_term_forecast
import numpy as np
router = APIRouter(prefix="/api/forecast", tags=["Forecast"])

@router.get("")
async def get_forecast(region_id: UUID = Query(..., description="Target Region ID")):
    # 1. Fetch region coordinate bounds
    region_res = supabase.table("regions").select("*").eq("id", str(region_id)).execute()
    if not region_res.data:
        raise HTTPException(status_code=404, detail="Region not found")
    
    region = region_res.data[0]
    lat = region["center_lat"]
    lng = region["center_lng"]

    # 2. Get current weather context
    weather = await get_or_fetch_weather(str(region_id), lat, lng)

    # 3. Derive baseline AQI from recent reports or fallback to default
    reports_res = (
        supabase.table("pollution_reports")
        .select("reported_pm25")
        .eq("region_id", str(region_id))
        .not_.is_("reported_pm25", "null")
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )

    if reports_res.data:
        baseline_pm = float(np.mean([r["reported_pm25"] for r in reports_res.data]))
    else:
        baseline_pm = 110.0  # Standard fallback baseline

    # 4. Generate forecast
    predictions = generate_short_term_forecast(
        baseline_aqi=baseline_pm,
        wind_speed=float(weather.get("wind_speed", 3.0)),
        humidity=float(weather.get("humidity", 60.0)),
        hours=6
    )

    return {
        "region_id": str(region_id),
        "region_name": region["name"],
        "current_weather": weather,
        "baseline_pm25": round(baseline_pm, 1),
        "forecast": predictions
    }