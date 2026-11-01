from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from src.schemas.investigation import RunInvestigationRequest, InvestigationResult
from src.core.agent_orchestrator import agent_orchestrator
from src.core.evidence_vault import evidence_vault

router = APIRouter(prefix="/investigations", tags=["Multi-Agent Investigations"])

@router.post("/run", response_model=InvestigationResult)
def run_investigation(req: RunInvestigationRequest):
    result = agent_orchestrator.run_investigation(
        case_id=req.case_id,
        entity_id=req.entity_id,
        dataset=req.dataset,
        priority=req.priority,
        budget=req.max_specialist_budget
    )
    return result

@router.get("/{case_id}/dossier", response_class=PlainTextResponse)
def get_case_dossier(case_id: str):
    md = evidence_vault.generate_dossier_markdown(case_id)
    return md
