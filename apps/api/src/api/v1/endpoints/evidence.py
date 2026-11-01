from typing import List, Dict, Any
from fastapi import APIRouter, Response
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

@router.get("/{case_id}/sar-xml")
def export_sar_xml(case_id: str):
    xml_content = evidence_vault.generate_sar_xml(case_id)
    return Response(content=xml_content, media_type="application/xml")

@router.post("/verify")
def verify_evidence_hash(payload: Dict[str, str]):
    sha256_hash = payload.get("sha256_hash", "")
    return evidence_vault.verify_evidence_integrity(sha256_hash)

