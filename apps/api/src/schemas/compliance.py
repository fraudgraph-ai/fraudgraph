from pydantic import BaseModel, Field
from typing import List, Optional

class SubmitReviewRequest(BaseModel):
    case_id: str = Field(..., description="Target forensic case ID (e.g. FG-8421)")
    disposition: str = Field(..., description="Recommended institutional disposition")
    justification: str = Field(..., description="Admissibility justification and evidence basis")
    lead_analyst: str = Field("Analyst E. Kaya", description="Originating lead investigator")

class ApproveReviewRequest(BaseModel):
    compliance_officer: str = Field("MLRO S. Demir", description="Certified compliance officer granting approval")
    notes: Optional[str] = Field("Independent verification completed; dual authorization signed.", description="Compliance officer signoff notes")

class RemandReviewRequest(BaseModel):
    compliance_officer: str = Field("MLRO S. Demir", description="Certified compliance officer remanding the case")
    remand_reasons: str = Field(..., description="Deficiencies or missing evidence requiring remand")

class ComplianceReviewResponse(BaseModel):
    case_id: str
    status: str
    disposition: str
    lead_analyst: str
    compliance_officer: Optional[str] = None
    primary_signature_sha256: str
    secondary_signature_sha256: Optional[str] = None
    dual_authorized_at: Optional[str] = None
    sar_filing_unlocked: bool = False
    message: str

class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    actor: str
    action: str
    target_id: str
    details: str
    sha256_hash: str
