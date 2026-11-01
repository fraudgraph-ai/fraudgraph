from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class GraphNode(BaseModel):
    id: str
    label: str
    entity_type: str = Field(..., description="bank_account, crypto_wallet, corporate_entity, individual, card, device, ip")
    risk_score: float = Field(0.0, ge=0.0, le=1.0)
    risk_level: str = "Low"
    properties: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    amount: float = Field(..., ge=0.0)
    currency: str = "TRY"
    timestamp: str
    channel: str = "wire"
    is_flagged: bool = False

class SubgraphRequest(BaseModel):
    entity_id: str
    dataset: str = "ibm_amlsim_500k"
    max_hops: int = Field(2, ge=1, le=5)
    min_amount: float = Field(0.0, ge=0.0)
    time_window_hours: Optional[int] = None

class SubgraphResponse(BaseModel):
    center_entity_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_volume: float
    node_count: int
    edge_count: int

class CycleDetectionRequest(BaseModel):
    dataset: str = "ibm_amlsim_500k"
    min_amount: float = 0.0
    max_cycle_length: int = Field(6, ge=3, le=10)

class CycleResponse(BaseModel):
    detected_cycles: List[List[str]]
    cycle_count: int
    execution_time_ms: float
    typology: str = "Circular Flow Layering"

class PageRankResponse(BaseModel):
    top_central_entities: List[Dict[str, Any]]
    execution_time_ms: float
