from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.supabase_client import supabase
from app.routes import reports, hotspots, forecast, alerts, federated, auth

# Include auth router


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
app.include_router(auth.router)






@app.get("/api/regions", tags=["Regions"])
def get_regions():
    try:
        response = supabase.table("regions").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "ClimatePulse Backend is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}