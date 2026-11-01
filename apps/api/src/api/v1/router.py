from fastapi import APIRouter
from src.api.v1.endpoints import graphs, risk, investigations, evidence, datasets

api_router = APIRouter(prefix="/v1")
api_router.include_router(graphs.router)
api_router.include_router(risk.router)
api_router.include_router(investigations.router)
api_router.include_router(evidence.router)
api_router.include_router(datasets.router)
