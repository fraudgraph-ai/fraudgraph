from fastapi import APIRouter
from src.schemas.risk import RiskScoreRequest, RiskScoreResponse
from src.core.ml_engine import risk_ml_engine

router = APIRouter(prefix="/risk", tags=["Risk & Detection ML"])

@router.post("/score", response_model=RiskScoreResponse)
def compute_risk_score(req: RiskScoreRequest):
    result = risk_ml_engine.score_entity(
        entity_id=req.entity_id,
        dataset=req.dataset,
        lookback_days=req.lookback_days
    )
    return result
