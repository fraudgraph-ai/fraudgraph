from typing import List, Dict, Any
from pydantic import BaseModel, Field

class RiskSignal(BaseModel):
    id: str
    description: str
    severity: str
    weight: float
    evidence_ref: str

class RiskScoreRequest(BaseModel):
    entity_id: str
    dataset: str = "ibm_amlsim_500k"
    lookback_days: int = Field(30, ge=1, le=365)
    include_shap: bool = True

class FeatureDriver(BaseModel):
    feature_name: str
    impact_score: float
    direction: str = "escalating"

class RiskScoreResponse(BaseModel):
    entity_id: str
    raw_model_score: float = Field(..., ge=0.0, le=1.0)
    calibrated_risk_score: float = Field(..., ge=0.0, le=1.0)
    uncertainty_brier: float = 0.042
    risk_level: str
    primary_typology: str
    feature_drivers: List[FeatureDriver]
    risk_signals: List[RiskSignal]
