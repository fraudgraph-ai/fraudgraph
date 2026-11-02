from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

class StreamTransactionEvent(BaseModel):
    event_id: str = Field(..., description="Unique streaming transaction ID (e.g. EVT-98124)")
    source_account: str = Field(..., description="Originator account or wallet")
    target_account: str = Field(..., description="Beneficiary account or wallet")
    amount: float = Field(..., ge=0.01, description="Transaction amount")
    currency: str = Field("TRY", description="ISO currency code")
    channel: str = Field("EFT / Fast Wire", description="Payment rail / channel")
    timestamp: Optional[str] = Field(None, description="ISO or normalized UTC timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Device, IP, or memo attributes")

class StreamIngestBatchRequest(BaseModel):
    events: List[StreamTransactionEvent] = Field(..., description="Batch of real-time transaction events")
    dataset_target: str = Field("ibm_amlsim_500k", description="Target temporal graph storage namespace")
    evaluate_rules: bool = Field(True, description="Whether to evaluate active AML typologies in-line")

class StreamIngestResponse(BaseModel):
    batch_id: str
    events_ingested: int
    nodes_added_or_updated: int
    edges_added: int
    alerts_generated_count: int
    latency_ms: float
    throughput_tx_sec: float
    status: str

class StreamMetricsResponse(BaseModel):
    status: str
    total_events_processed: int
    current_throughput_tx_sec: float
    buffer_depth: int
    max_buffer_capacity: int
    average_ingest_latency_ms: float
    alerts_emitted_total: int
    memory_footprint_mb: float
    connected_consumers_count: int

class StreamSimulateBurstRequest(BaseModel):
    burst_size: int = Field(1000, ge=100, le=10000, description="Number of synthetic streaming transactions to inject")
    inject_circular_loop: bool = Field(True, description="Whether to inject a deliberate 3-hop money laundering cycle")
    dataset_target: str = Field("ibm_amlsim_500k", description="Target graph namespace")

class StreamSimulateBurstResponse(BaseModel):
    simulation_id: str
    burst_size: int
    ingest_duration_seconds: float
    throughput_tx_sec: float
    alerts_triggered: int
    critical_cycles_detected: int
    status: str
