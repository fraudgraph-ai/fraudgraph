from pydantic import BaseModel, Field
from typing import List, Optional

class AlertItemSchema(BaseModel):
    id: str = Field(..., description="Unique alert identifier")
    title: str = Field(..., description="Alert descriptive typology title")
    description: str = Field(..., description="Detailed narrative and trigger condition")
    timestamp: str = Field(..., description="ISO or normalized time string")
    risk_level: str = Field(..., description="Critical, High, Medium, Low")
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Calibrated risk probability")
    status: str = Field(..., description="Open, Investigating, Resolved, Dismissed")
    target_account: str = Field(..., description="Entity ID subjected to alert")
    amount: str = Field(..., description="Formatted transaction or exposure volume")
    typology: str = Field(..., description="AML Typology category")
    rule_or_model: str = Field(..., description="Triggering rule or ML model identifier")

class EscalateAlertRequest(BaseModel):
    alert_id: str
    target_account: str
    analyst_notes: Optional[str] = "Escalated for immediate multi-agent critical review"
    priority: Optional[str] = "High"

class EscalateAlertResponse(BaseModel):
    alert_id: str
    case_id: str
    status: str
    lead_analyst: str
    sha256_audit_hash: str
    message: str
