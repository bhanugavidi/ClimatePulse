from fastapi import FastAPI

app = FastAPI(
    title="ClimatePulse API",
    description="Federated Air Quality Intelligence for BRICS Cities",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "ClimatePulse Backend is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }