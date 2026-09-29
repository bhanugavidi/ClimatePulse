from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reports, hotspots, forecast,alerts,federated

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

@app.get("/")
def root():
    return {"message": "ClimatePulse Backend is running 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}