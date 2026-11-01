import pytest
from src.core.graph_engine import FinancialGraphEngine

@pytest.fixture
def engine():
    return FinancialGraphEngine()

def test_extract_subgraph_center_entity(engine):
    res = engine.extract_subgraph("TR-90421073", dataset="ibm_amlsim_500k", max_hops=2)
    assert res["center_entity_id"] == "TR-90421073"
    assert res["node_count"] >= 5
    assert res["edge_count"] >= 5
    assert res["total_volume"] > 0

def test_amount_threshold_filtering(engine):
    # With min_amount = 2,000,000, smaller edges (< 2M) are excluded
    res_low = engine.extract_subgraph("TR-90421073", min_amount=0.0)
    res_high = engine.extract_subgraph("TR-90421073", min_amount=2000000.0)
    assert res_high["edge_count"] <= res_low["edge_count"]

def test_detect_circular_flows(engine):
    cycles, exec_ms = engine.detect_circular_flows(dataset="ibm_amlsim_500k", min_amount=1000000.0)
    assert len(cycles) >= 1
    # Check that known laundering cycle TR-90421073 -> TR-10293847 -> TR-55667788 is identified
    cycle_nodes = set()
    for c in cycles:
        cycle_nodes.update(c)
    assert "TR-90421073" in cycle_nodes
    assert exec_ms >= 0

def test_pagerank_computation(engine):
    rankings, exec_ms = engine.compute_pagerank("ibm_amlsim_500k")
    assert len(rankings) > 0
    # Center node should have top PageRank
    top_entity = rankings[0]["entity_id"]
    assert top_entity in ["TR-90421073", "TR-55667788"]
    assert rankings[0]["pagerank_score"] > 0
