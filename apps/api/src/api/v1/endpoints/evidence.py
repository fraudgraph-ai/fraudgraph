from typing import List
from fastapi import APIRouter
from src.schemas.evidence import EvidenceDepositRequest, EvidenceDepositResponse
from src.core.evidence_vault import evidence_vault

router = APIRouter(prefix="/evidence", tags=["Evidence & Cryptographic Vault"])

@router.post("/deposit", response_model=EvidenceDepositResponse)
def deposit_evidence(req: EvidenceDepositRequest):
    record = evidence_vault.deposit_evidence(
        case_id=req.case_id,
        title=req.title,
        evidence_type=req.evidence_type,
        raw_content=req.raw_content,
        deposited_by=req.deposited_by
    )
    return record

@router.get("/{case_id}", response_model=List[EvidenceDepositResponse])
def get_evidence_list(case_id: str):
    items = evidence_vault.get_case_evidence(case_id)
    return items
