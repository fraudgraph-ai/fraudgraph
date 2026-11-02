from fastapi import APIRouter
from src.api.v1.endpoints import (
    graphs,
    risk,
    investigations,
    evidence,
    datasets,
    benchmarks,
    alerts,
    transactions,
    rules,
    compliance,
    stream
)

api_router = APIRouter(prefix="/v1")
api_router.include_router(graphs.router)
api_router.include_router(risk.router)
api_router.include_router(investigations.router)
api_router.include_router(evidence.router)
api_router.include_router(datasets.router)
api_router.include_router(benchmarks.router)
api_router.include_router(alerts.router)
api_router.include_router(transactions.router)
api_router.include_router(rules.router)
api_router.include_router(compliance.router)
api_router.include_router(stream.router)

