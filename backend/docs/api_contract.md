ClimatePulse API

ClimatePulse is an API for collecting citizen-reported pollution incidents, automatically analyzing reports with AI, and exposing pollution hotspots for visualization on a live map.

Base URL
http://localhost:8000


For production, replace this with the deployed API URL.

API Endpoints
1. Submit Citizen Pollution Report

Creates a new citizen pollution report. The backend triggers AI verification and scoring, then returns the persisted report with its analysis results.

Endpoint

POST /api/reports


Content-Type

application/json

Request Body
Field	Type	Required	Description
region_id	string (UUID)	Yes	Identifier of the city/region from the regions table.
lat	number	Yes	Latitude of the reported event.
lng	number	Yes	Longitude of the reported event.
photo_url	string	No	Public Supabase Storage URL for the uploaded photo.
description	string	No	Short notes describing the observed incident.
reported_pm25	number	No	Optional citizen-provided PM2.5 sensor reading.
user_id	string (UUID)	No	ID of the logged-in user. Omit for anonymous reports.
Example Request
{
  "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
  "lat": 28.6139,
  "lng": 77.2090,
  "photo_url": "https://.supabase.co/storage/v1/object/public/report-photos/smoke_sample_1.jpg",
  "description": "Dense black smoke venting near industrial complex",
  "reported_pm25": 165.5,
  "user_id": null
}

Success Response

201 Created

{
  "id": "c1f7a08b-2d39-4d8b-965a-c603fd9deec9",
  "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
  "user_id": null,
  "lat": 28.6139,
  "lng": 77.2090,
  "photo_url": "https://.supabase.co/storage/v1/object/public/report-photos/smoke_sample_1.jpg",
  "description": "Dense black smoke venting near industrial complex",
  "reported_pm25": 165.5,
  "ai_score": 82,
  "ai_category": "smoke",
  "severity": "high",
  "status": "new",
  "created_at": "2026-09-28T09:30:00Z"
}

Response Fields
Field	Description
id	Unique pollution report UUID.
region_id	Region associated with the report.
user_id	Reporting user's UUID, or null for anonymous reports.
lat	Latitude of the reported event.
lng	Longitude of the reported event.
photo_url	Uploaded photo URL, if provided.
description	Citizen's description of the incident.
reported_pm25	Citizen-provided PM2.5 value, if available.
ai_score	AI-generated verification/scoring value.
ai_category	AI-detected pollution category.
severity	Calculated severity level.
status	Current report status.
created_at	Report creation timestamp.
Errors
Status	Description
422	Validation failure, such as missing required fields or invalid types.
500	Database or internal AI scoring failure.
2. List Pollution Hotspots

Retrieves active clustered pollution hotspots for displaying markers and risk zones on a live map.

Endpoint

GET /api/hotspots

Query Parameters
Parameter	Type	Required	Default	Description
region_id	string (UUID)	No	null	Filter hotspots for a specific city/region.
risk_level	string	No	null	Filter by low, moderate, high, or severe.
Example Requests

Get all active hotspots:

GET /api/hotspots


Filter by region:

GET /api/hotspots?region_id=7b8849b2-32d8-4f24-9b22-83b544321d88


Filter by risk level:

GET /api/hotspots?risk_level=high


Combine filters:

GET /api/hotspots?region_id=7b8849b2-32d8-4f24-9b22-83b544321d88&risk_level=high

Success Response

200 OK

[
  {
    "id": "e85dc6fc-d6b3-4f93-b6d3-24e5beea8329",
    "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
    "center_lat": 28.6145,
    "center_lng": 77.2105,
    "radius_m": 650,
    "risk_level": "high",
    "report_count": 4,
    "last_updated": "2026-09-28T09:35:00Z"
  },
  {
    "id": "52ba441b-4171-4770-ae63-2287ee3b4e6d",
    "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
    "center_lat": 28.6328,
    "center_lng": 77.2197,
    "radius_m": 400,
    "risk_level": "moderate",
    "report_count": 2,
    "last_updated": "2026-09-28T09:15:00Z"
  }
]

Response Fields
Field	Description
id	Unique hotspot cluster UUID.
region_id	Region containing the hotspot.
center_lat	Latitude of the hotspot center.
center_lng	Longitude of the hotspot center.
radius_m	Hotspot radius in meters.
risk_level	Hotspot risk level.
report_count	Number of reports contributing to the cluster.
last_updated	Timestamp when the hotspot was last updated.
Risk Levels

The API supports four risk levels:

low
moderate
high
severe

Errors
Status	Description
500	Database connection failure or query error.
cURL Examples
Submit a Pollution Report
curl -X POST "http://localhost:8000/api/reports" \
  -H "Content-Type: application/json" \
  -d '{
    "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
    "lat": 28.6139,
    "lng": 77.2090,
    "photo_url": "https://.supabase.co/storage/v1/object/public/report-photos/smoke_sample_1.jpg",
    "description": "Dense black smoke venting near industrial complex",
    "reported_pm25": 165.5,
    "user_id": null
  }'

Get All Hotspots
curl "http://localhost:8000/api/hotspots"

Get High-Risk Hotspots
curl "http://localhost:8000/api/hotspots?risk_level=high"

Get Hotspots for a Region
curl "http://localhost:8000/api/hotspots?region_id=7b8849b2-32d8-4f24-9b22-83b544321d88"

API Workflow
+----------------------+
|      Citizen         |
|  Reports Pollution   |
+----------+-----------+
           |
           | POST /api/reports
           v
+----------------------+
|    ClimatePulse API  |
+----------+-----------+
           |
           | AI Verification
           | & Scoring
           v
+----------------------+
|   Pollution Report   |
|      Database        |
+----------+-----------+
           |
           | Hotspot Clustering
           v
+----------------------+
|    /api/hotspots     |
+----------+-----------+
           |
           v
+----------------------+
|    Live Map / UI     |
| Markers + Risk Zones |
+----------------------+

Technology Integration

ClimatePulse is designed to integrate with:

Supabase Storage — stores citizen-uploaded pollution photos.

AI Verification — analyzes reports and generates scores/categories.

Database — stores reports, regions, and hotspot clusters.

Map Frontend — visualizes reports, hotspot markers, and risk zones.

Data Validation

When submitting a report:

region_id must be a valid UUID.

lat and lng must be numeric coordinates.

photo_url is optional.

description is optional.

reported_pm25 is optional.

user_id is optional for anonymous reports.

Invalid or missing required fields result in 422 Unprocessable Entity.

Anonymous Reports

Citizen reports can be submitted without authentication.

Simply omit user_id or set it to null:

{
  "region_id": "7b8849b2-32d8-4f24-9b22-83b544321d88",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Visible smoke from industrial area"
}

HTTP Status Codes
Status	Meaning
200	Request completed successfully.
201	Resource successfully created.
422	Request validation failed.
500	Internal server or database error.
Development

Start the API locally:

# Example
uvicorn main:app --reload --port 8000


The API will be available at:

http://localhost:8000


If the backend uses FastAPI, interactive API documentation is typically available at:

http://localhost:8000/docs


and OpenAPI documentation at:

http://localhost:8000/redoc

Example Project Structure
climatepulse/
├── README.md
├── app/
│   ├── main.py
│   ├── routes/
│   │   ├── reports.py
│   │   └── hotspots.py
│   ├── services/
│   │   ├── ai_scoring.py
│   │   └── hotspot_clustering.py
│   └── models/
│       ├── report.py
│       └── hotspot.py
├── tests/
│   ├── test_reports.py
│   └── test_hotspots.py
└── requirements.txt

Future Enhancements

Potential future API capabilities include:

User authentication and authorization.

Report moderation and verification workflows.

Real-time hotspot updates.

Historical pollution trends.

Push notifications for severe pollution events.

Sensor/device integrations.

Advanced geospatial clustering.

Pollution analytics and dashboards.

Administrative APIs for managing regions and reports.

License

Add the project's license information here.

ClimatePulse

Citizen reports → AI verification → Pollution intelligence → Actionable map data