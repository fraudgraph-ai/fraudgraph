"""
Unit tests for the StreamingIngestionEngine ring buffer, batch processor, and cycle simulator.
"""

import pytest
from src.core.stream_engine import StreamingIngestionEngine

def test_streaming_engine_ring_buffer_bounds():
    engine = StreamingIngestionEngine(max_buffer_capacity=10)
    events = [
        {
            "event_id": f"EVT-{i}",
            "source_account": f"SRC-{i}",
            "target_account": f"DST-{i}",
            "amount": 1000.0,
            "currency": "TRY",
            "channel": "FAST"
        }
        for i in range(25)
    ]
    res = engine.ingest_batch(events=events, dataset_target="ibm_amlsim_500k", evaluate_rules=False)
    assert res["events_ingested"] == 25
    assert len(engine.event_buffer) == 10
    assert engine.event_buffer[-1]["event_id"] == "EVT-24"

def test_streaming_engine_burst_with_cycle_injection():
    engine = StreamingIngestionEngine(max_buffer_capacity=5000)
    burst_res = engine.simulate_burst(burst_size=100, inject_circular_loop=True)
    assert burst_res["burst_size"] == 100
    assert burst_res["critical_cycles_detected"] == 1
    assert burst_res["throughput_tx_sec"] > 0
    assert burst_res["status"] == "COMPLETED_STRESS_BENCHMARK"

def test_streaming_engine_metrics_calculation():
    engine = StreamingIngestionEngine()
    metrics = engine.get_metrics()
    assert metrics["status"] == "HEALTHY_STREAMING"
    assert metrics["buffer_depth"] >= 0
    assert metrics["average_ingest_latency_ms"] >= 0
    assert metrics["connected_consumers_count"] == 4
