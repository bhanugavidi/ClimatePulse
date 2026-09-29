# ClimatePulse API Contract

### Base URL: `http://localhost:8000` (or your deployed backend URL)

All endpoints communicate using standard JSON payloads unless specified otherwise. Cross-Origin Resource Sharing (CORS) is enabled for all origins.
## 1. System & Regions1.1 List RegionsRetrieve available cities/regions with their respective coordinates and UUIDs to populate location selectors or maps.   
### URL: /api/regions   
### Method: GET   
### Success Response (200 OK)
```JSON[
  {
    "id": "6874ef87-4706-4b58-ad96-c479d91111c6",
    "name": "New Delhi",
    "country_code": "IN",
    "center_lat": 28.6139,
    "center_lng": 77.2090,
    "created_at": "2026-09-29T05:00:00Z"
  },
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "name": "São Paulo",
    "country_code": "BR",
    "center_lat": -23.5505,
    "center_lng": -46.6333,
    "created_at": "2026-09-29T05:00:00Z"
  }
]
```
##2. Citizen Reports2.1 Submit Citizen ReportSubmit a new citizen observation. Backend assigns initial AI scoring and triggers DBSCAN clustering automatically.   URL: /api/reports   Method: POST   Content-Type: application/jsonRequest BodyFieldTypeRequiredDescriptionregion_idUUIDYesTarget region UUID   latfloatYesLatitude (-90.0 to 90.0)   lngfloatYesLongitude (-180.0 to 180.0)   photo_urlstringNoSupabase storage URL of uploaded image   descriptionstringNoDescription of pollution incident   reported_pm25floatNoCitizen-entered PM2.5 value   user_idUUIDNoUser ID (null for anonymous)   JSON{
  "region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
  "lat": 28.6139,
  "lng": 77.2090,
  "photo_url": "[https://example.com/smoke.jpg](https://example.com/smoke.jpg)",
  "description": "Thick black smoke near industrial zone",
  "reported_pm25": 165.5,
  "user_id": null
}
Success Response (201 Created)JSON{
  "id": "c1f7a08b-2d39-4d8b-965a-c603fd9deec9",
  "region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
  "user_id": null,
  "lat": 28.6139,
  "lng": 77.2090,
  "photo_url": "[https://example.com/smoke.jpg](https://example.com/smoke.jpg)",
  "description": "Thick black smoke near industrial zone",
  "reported_pm25": 165.5,
  "ai_score": 85,
  "ai_category": "smoke",
  "severity": "high",
  "status": "new",
  "created_at": "2026-09-29T05:30:00Z"
}
2.2 List ReportsFetch past reports with optional filtering.   URL: /api/reports   Method: GET   Query Params:region_id (UUID, optional)   severity (string, optional: low, moderate, high, severe)   3. Hotspots3.1 List Active HotspotsRetrieves clustered hotspots calculated via DBSCAN for the Leaflet map.   URL: /api/hotspots   Method: GET   Query Params:region_id (UUID, optional)   risk_level (string, optional: low, moderate, high, severe)   Success Response (200 OK)JSON[
  {
    "id": "c3d673d3-ea7c-400e-b39f-d6c0b4eed386",
    "region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
    "center_lat": 28.6142,
    "center_lng": 77.20925,
    "radius_m": 1000,
    "risk_level": "severe",
    "report_count": 2,
    "last_updated": "2026-09-29T05:41:01Z"
  }
]
4. Forecasting & Weather4.1 Get Short-Term AQI ForecastProvides live weather context and statistical hourly AQI projections for dashboard charts.   URL: /api/forecast   Method: GET   Query Params:region_id (UUID, required)   Success Response (200 OK)JSON{
  "region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
  "region_name": "New Delhi",
  "current_weather": {
    "temperature": 29.5,
    "humidity": 62.0,
    "wind_speed": 4.1,
    "wind_direction": 120,
    "fetched_at": "2026-09-29T05:45:00Z"
  },
  "baseline_pm25": 162.8,
  "forecast": [
    { "hour_offset": 1, "predicted_aqi": 165.2, "confidence": 0.9 },
    { "hour_offset": 2, "predicted_aqi": 168.4, "confidence": 0.85 },
    { "hour_offset": 3, "predicted_aqi": 172.1, "confidence": 0.8 },
    { "hour_offset": 4, "predicted_aqi": 175.0, "confidence": 0.75 },
    { "hour_offset": 5, "predicted_aqi": 179.3, "confidence": 0.7 },
    { "hour_offset": 6, "predicted_aqi": 182.6, "confidence": 0.65 }
  ]
}
5. Alerts (Authority Dashboard)5.1 List AlertsLists alerts generated from high/severe hotspots.   URL: /api/alerts   Method: GET   Query Params:region_id (UUID, optional)   status (string, optional: open, acknowledged, escalated, resolved)   Success Response (200 OK)JSON[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "hotspot_id": "c3d673d3-ea7c-400e-b39f-d6c0b4eed386",
    "region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
    "message": "Critical pollution cluster detected (2 reports) with risk level: SEVERE.",
    "severity": "severe",
    "status": "open",
    "created_at": "2026-09-29T05:45:00Z"
  }
]
5.2 Update Alert StatusAuthority action to escalate or resolve an active incident.   URL: /api/alerts/{alert_id}   Method: PATCH   Content-Type: application/jsonRequest BodyJSON{
  "status": "escalated"
}
Success Response (200 OK)JSON{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "escalated",
  "severity": "severe",
  "message": "Critical pollution cluster detected (2 reports) with risk level: SEVERE."
}
6. Federated Cross-Border Intelligence6.1 Share Prediction PacketPush a lightweight, anonymized prediction packet from Country A to Country B without exposing raw citizen reports.   URL: /api/federated/share   Method: POST   Content-Type: application/jsonRequest BodyJSON{
  "source_region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
  "target_region_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "risk_summary_json": {
    "zone": "North Corridor Border",
    "plume_vector_degrees": 120,
    "projected_drift_km": 42.5,
    "severity_index": 85,
    "confidence": 0.91
  }
}
Success Response (201 Created)JSON{
  "status": "success",
  "message": "Prediction packet transmitted successfully",
  "packet": {
    "id": "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    "source_region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
    "target_region_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "risk_summary_json": {
      "zone": "North Corridor Border",
      "plume_vector_degrees": 120,
      "projected_drift_km": 42.5,
      "severity_index": 85,
      "confidence": 0.91
    },
    "shared_at": "2026-09-29T05:50:00Z"
  }
}
6.2 Get Combined Regional Risk ViewView combined risk status merging local hotspots and incoming cross-border prediction packets.   URL: /api/federated/combined   Method: GET[cite: 1]Query Params:region_id (UUID, required)[cite: 1]Success Response (200 OK)JSON{
  "region_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "local_hotspots_count": 0,
  "inbound_cross_border_signals": [
    {
      "id": "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
      "source_region_id": "6874ef87-4706-4b58-ad96-c479d91111c6",
      "risk_summary_json": {
        "zone": "North Corridor Border",
        "plume_vector_degrees": 120,
        "severity_index": 85
      },
      "shared_at": "2026-09-29T05:50:00Z"
    }
  ],
  "transboundary_risk": "elevated"
}