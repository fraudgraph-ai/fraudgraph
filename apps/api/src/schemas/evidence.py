import hashlib
from typing import Optional
from pydantic import BaseModel, Field

class EvidenceDepositRequest(BaseModel):
    case_id: str
    title: str
    evidence_type: str = Field(..., description="bank_statement, graph_snapshot, ip_geolocation, identity_doc")
    description: Optional[str] = ""
    raw_content: str
    deposited_by: str = "Analyst E. Kaya"

class EvidenceDepositResponse(BaseModel):
    evidence_id: str
    case_id: str
    title: str
    evidence_type: str
    sha256_hash: str
    timestamp: str
    status: str = "Verified & Merkle-Anchored"
    deposited_by: str
