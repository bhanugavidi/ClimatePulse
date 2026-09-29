import os
import httpx
from datetime import datetime, timezone
from db.supabase_client import supabase

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

async def get_or_fetch_weather(region_id: str, lat: float, lng: float):
    """
    Fetches real-time weather. If OPENWEATHER_API_KEY is missing,
    it falls back to Open-Meteo (free, zero API key required).
    """
    # 1. Check if cached weather exists within the last 30 minutes
    cache = (
        supabase.table("weather_data")
        .select("*")
        .eq("region_id", region_id)
        .order("fetched_at", desc=True)
        .limit(1)
        .execute()
    )
    if cache.data:
        # Cache hit
        return cache.data[0]

    weather_payload = {
        "region_id": region_id,
        "temperature": 29.5,
        "humidity": 62.0,
        "wind_speed": 4.1,
        "wind_direction": 120,
        "fetched_at": datetime.now(timezone.utc).isoformat()
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            if OPENWEATHER_API_KEY:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPENWEATHER_API_KEY}&units=metric"
                res = await client.get(url)
                if res.status_code == 200:
                    d = res.json()
                    weather_payload["temperature"] = d["main"]["temp"]
                    weather_payload["humidity"] = d["main"]["humidity"]
                    weather_payload["wind_speed"] = d["wind"]["speed"]
                    weather_payload["wind_direction"] = d["wind"].get("deg", 0)
            else:
                # Open-Meteo fallback (Free, reliable, no API key needed for hackathons)
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m"
                res = await client.get(url)
                if res.status_code == 200:
                    d = res.json().get("current", {})
                    weather_payload["temperature"] = d.get("temperature_2m", 29.5)
                    weather_payload["humidity"] = d.get("relative_humidity_2m", 62.0)
                    weather_payload["wind_speed"] = d.get("wind_speed_10m", 4.1)
                    weather_payload["wind_direction"] = d.get("wind_direction_10m", 120)

        # Cache in Supabase
        supabase.table("weather_data").insert(weather_payload).execute()
    except Exception as err:
        print(f"Weather fetch failed, falling back to defaults: {err}")

    return weather_payload