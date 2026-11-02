from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from src.schemas.stream import (
    StreamIngestBatchRequest,
    StreamIngestResponse,
    StreamMetricsResponse,
    StreamSimulateBurstRequest,
    StreamSimulateBurstResponse,
)
from src.core.stream_engine import streaming_engine

router = APIRouter(prefix="/stream", tags=["Real-Time Streaming Engine"])

@router.post("/ingest", response_model=StreamIngestResponse)
def ingest_transaction_stream(payload: StreamIngestBatchRequest):
    """
    Ingests a batch of real-time streaming transaction events.
    Synchronously updates the in-memory directed graph and evaluates active AML typologies.
    """
    try:
        events_dicts = [ev.model_dump() for ev in payload.events]
        result = streaming_engine.ingest_batch(
            events=events_dicts,
            dataset_target=payload.dataset_target,
            evaluate_rules=payload.evaluate_rules
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming ingestion error: {str(e)}")

@router.get("/metrics", response_model=StreamMetricsResponse)
def get_streaming_metrics():
    """
    Retrieves real-time streaming ingestion throughput, queue depth, and latency metrics.
    """
    return streaming_engine.get_metrics()

@router.post("/simulate-burst", response_model=StreamSimulateBurstResponse)
def simulate_transaction_burst(payload: StreamSimulateBurstRequest):
    """
    Triggers a synthetic high-velocity stress test injecting high volumes of transactions
    and deliberate circular laundering cycles to verify zero-drop ingestion resilience.
    """
    try:
        result = streaming_engine.simulate_burst(
            burst_size=payload.burst_size,
            inject_circular_loop=payload.inject_circular_loop,
            dataset_target=payload.dataset_target
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Burst simulation error: {str(e)}")
