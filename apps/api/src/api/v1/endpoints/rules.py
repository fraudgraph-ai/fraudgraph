from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from src.schemas.rule import (
    RuleDefinitionSchema,
    RuleCreateRequest,
    RuleSimulationRequest,
    RuleSimulationResponse
)
from src.core.rule_engine import typology_rule_engine

router = APIRouter(prefix="/rules", tags=["AML Rule & Typology Studio"])

@router.get("/", response_model=List[RuleDefinitionSchema])
def list_rules(
    typology: Optional[str] = Query(None, description="Filter by typology"),
    is_active: Optional[bool] = Query(None, description="Filter by active status")
):
    """Lists all configured AML detection rules with tunable parameter definitions."""
    return typology_rule_engine.list_rules(typology=typology, is_active=is_active)

@router.get("/{rule_id}", response_model=RuleDefinitionSchema)
def get_rule(rule_id: str):
    """Retrieves single rule definition by ID."""
    rule = typology_rule_engine.get_rule(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail=f"Rule {rule_id} not found")
    return rule

@router.post("/", response_model=RuleDefinitionSchema)
def create_rule(payload: RuleCreateRequest):
    """Creates a new AML detection rule with tunable parameters."""
    record = typology_rule_engine.create_or_update_rule(payload.model_dump())
    return record

@router.patch("/{rule_id}/toggle", response_model=RuleDefinitionSchema)
def toggle_rule_status(rule_id: str):
    """Toggles rule active/inactive state in real time."""
    rule = typology_rule_engine.toggle_rule(rule_id)
    if not rule:
        raise HTTPException(status_code=404, detail=f"Rule {rule_id} not found")
    return rule

@router.post("/{rule_id}/simulate", response_model=RuleSimulationResponse)
def simulate_rule(
    rule_id: str,
    payload: Optional[RuleSimulationRequest] = Body(default_factory=RuleSimulationRequest)
):
    """
    Executes backtest simulation of rule logic against a selected graph dataset snapshot.
    Returns hit rate, financial volume exposure, and false-positive calibration.
    """
    try:
        req = payload or RuleSimulationRequest()
        result = typology_rule_engine.simulate_rule(
            rule_id=rule_id,
            dataset=req.dataset,
            sample_entities_limit=req.sample_entities_limit
        )
        return result
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
