from fastapi import APIRouter, HTTPException
from src.schemas.graph import SubgraphRequest, SubgraphResponse, CycleDetectionRequest, CycleResponse, PageRankResponse
from src.core.graph_engine import graph_engine

router = APIRouter(prefix="/graphs", tags=["Graph Operations"])

@router.post("/subgraph", response_model=SubgraphResponse)
def get_subgraph(req: SubgraphRequest):
    data = graph_engine.extract_subgraph(
        entity_id=req.entity_id,
        dataset=req.dataset,
        max_hops=req.max_hops,
        min_amount=req.min_amount
    )
    return data

@router.post("/algorithms/cycles", response_model=CycleResponse)
def detect_cycles(req: CycleDetectionRequest):
    cycles, exec_ms = graph_engine.detect_circular_flows(
        dataset=req.dataset,
        min_amount=req.min_amount,
        max_cycle_length=req.max_cycle_length
    )
    return {
        "detected_cycles": cycles,
        "cycle_count": len(cycles),
        "execution_time_ms": exec_ms,
        "typology": "Circular Flow Layering"
    }

@router.post("/algorithms/pagerank", response_model=PageRankResponse)
def calculate_pagerank(dataset: str = "ibm_amlsim_500k"):
    rankings, exec_ms = graph_engine.compute_pagerank(dataset)
    return {
        "top_central_entities": rankings[:10],
        "execution_time_ms": exec_ms
    }
