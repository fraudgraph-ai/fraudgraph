from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from src.schemas.compliance import (
    SubmitReviewRequest,
    ApproveReviewRequest,
    RemandReviewRequest,
    ComplianceReviewResponse,
    AuditLogSchema
)
from src.core.compliance_engine import compliance_review_engine

router = APIRouter(prefix="/compliance", tags=["Compliance & Four-Eye Review"])

@router.post("/reviews/submit", response_model=ComplianceReviewResponse)
def submit_case_review(payload: SubmitReviewRequest):
    """Submits a case for institutional Four-Eye compliance signoff."""
    return compliance_review_engine.submit_for_review(
        case_id=payload.case_id,
        disposition=payload.disposition,
        justification=payload.justification,
        lead_analyst=payload.lead_analyst
    )

@router.post("/reviews/{case_id}/approve", response_model=ComplianceReviewResponse)
def approve_case_review(case_id: str, payload: ApproveReviewRequest):
    """
    Grants secondary compliance authorization (MLRO signoff).
    Binds second cryptographic signature and unlocks regulatory SAR XML transmission.
    """
    return compliance_review_engine.approve_review(
        case_id=case_id,
        compliance_officer=payload.compliance_officer,
        notes=payload.notes or "Compliance verification approved."
    )

@router.post("/reviews/{case_id}/remand", response_model=ComplianceReviewResponse)
def remand_case_review(case_id: str, payload: RemandReviewRequest):
    """Remands case back to lead investigator due to evidentiary deficiencies."""
    return compliance_review_engine.remand_review(
        case_id=case_id,
        compliance_officer=payload.compliance_officer,
        remand_reasons=payload.remand_reasons
    )

@router.get("/reviews/{case_id}", response_model=ComplianceReviewResponse)
def get_case_review_status(case_id: str):
    """Retrieves current four-eye review and dual authorization status for a case."""
    status = compliance_review_engine.get_review_status(case_id)
    if not status:
        raise HTTPException(status_code=404, detail=f"No active review found for case {case_id}")
    return status

@router.get("/audit-logs", response_model=List[AuditLogSchema])
def get_compliance_audit_logs(
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search term for actor, action, or case ID")
):
    """Retrieves immutable append-only audit trail entries with SHA-256 verification hashes."""
    return compliance_review_engine.get_audit_logs(limit=limit, search=search)
