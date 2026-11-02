from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

class RuleDefinitionSchema(BaseModel):
    id: str = Field(..., description="Unique rule identifier (e.g. RUL-CIRCULAR-01)")
    name: str = Field(..., description="Rule human-readable title")
    typology: str = Field(..., description="AML Typology category (circular_layering, smurfing, velocity, device_collision)")
    description: str = Field(..., description="Rule detection logic narrative")
    severity: str = Field(..., description="Critical, High, Medium, Low")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Tunable numeric and categorical parameters")
    is_active: bool = Field(True, description="Whether rule is actively generating alerts")
    created_by: str = Field("System Rule Architect", description="Author or officer who defined the rule")
    last_tuned: str = Field(..., description="Timestamp of latest tuning")

class RuleCreateRequest(BaseModel):
    name: str
    typology: str
    description: str
    severity: str = "High"
    parameters: Dict[str, Any]
    is_active: bool = True

class RuleSimulationRequest(BaseModel):
    dataset: str = "ibm_amlsim_500k"
    sample_entities_limit: int = 100

class RuleSimulationResponse(BaseModel):
    rule_id: str
    rule_name: str
    dataset: str
    simulated_entities_count: int
    rule_hits_count: int
    hit_rate_percentage: float
    total_exposure_volume_try: float
    estimated_false_positive_rate: float
    execution_time_ms: float
    sample_flagged_entities: List[str]
