from fastapi import APIRouter
from fastapi.responses import PlainTextResponse, StreamingResponse
import json
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

@router.get("/stream/{case_id}")
def stream_investigation_trace(case_id: str, entity_id: str = "ACC-849201", dataset: str = "ibm_amlsim_500k"):
    """
    Streams live investigation agent events via Server-Sent Events (SSE).
    Event types: AGENT_STARTED, TOOL_CALL, EVIDENCE_FOUND, CRITIC_CHALLENGE, SCORE_UPDATED, AGENT_COMPLETED.
    """
    def event_generator():
        for event in agent_orchestrator.stream_investigation_events(case_id=case_id, entity_id=entity_id, dataset=dataset):
            event_name = event.get("event", "message")
            yield f"event: {event_name}\ndata: {json.dumps(event)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/{case_id}/dossier", response_class=PlainTextResponse)
def get_case_dossier(case_id: str):
    md = evidence_vault.generate_dossier_markdown(case_id)
    return md
