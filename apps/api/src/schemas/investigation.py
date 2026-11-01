from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class AgentExecutionStep(BaseModel):
    step_id: str
    agent_role_id: str
    agent_name: str
    agent_group: str
    status: str = "completed"
    finding_summary: str
    citations: List[str]
    latency_ms: int
    timestamp: str

class RunInvestigationRequest(BaseModel):
    case_id: str
    entity_id: str
    dataset: str = "ibm_amlsim_500k"
    priority: str = "High"
    max_specialist_budget: int = Field(12, ge=4, le=36)

class InvestigationResult(BaseModel):
    case_id: str
    entity_id: str
    status: str
    lead_analyst: str
    risk_score: float
    assigned_agents_count: int
    execution_steps: List[AgentExecutionStep]
    forensic_synthesis: str
    recommended_action: str
    total_latency_seconds: float
