"""
FraudGraph AI — Enterprise Financial Crime Intelligence API
FastAPI Service for Graph ML, Temporal Ingestion, and Multi-Agent Orchestration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.router import api_router

app = FastAPI(
    title="FraudGraph AI Intelligence API",
    description="Graph-Native Multi-Agent Financial Crime Investigation Engine (PyG, NetworkX, LightGBM)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for workbench frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System Telemetry"])
def healthcheck():
    """Liveness and readiness probe for Docker / Kubernetes."""
    return {
        "status": "HEALTHY",
        "service": "fraudgraph-intelligence-api",
        "version": "1.0.0",
        "subsystems": {
            "graph_engine": "ONLINE",
            "detection_ml": "ONLINE",
            "multi_agent_supervisor": "ONLINE",
            "cryptographic_vault": "ONLINE"
        }
    }

# Mount API V1
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
