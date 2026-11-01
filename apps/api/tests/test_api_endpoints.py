import pytest
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_healthcheck(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["subsystems"]["graph_engine"] == "ONLINE"

def test_get_datasets(client):
    res = client.get("/api/v1/datasets/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    dataset_ids = [d["id"] for d in data]
    assert "ibm_amlsim_500k" in dataset_ids
    assert "elliptic_plus_plus" in dataset_ids

def test_subgraph_extraction_api(client):
    payload = {
        "entity_id": "TR-90421073",
        "dataset": "ibm_amlsim_500k",
        "max_hops": 2,
        "min_amount": 0.0
    }
    res = client.post("/api/v1/graphs/subgraph", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["center_entity_id"] == "TR-90421073"
    assert data["node_count"] > 0
    assert data["edge_count"] > 0

def test_cycle_detection_api(client):
    payload = {
        "dataset": "ibm_amlsim_500k",
        "min_amount": 1000000.0,
        "max_cycle_length": 6
    }
    res = client.post("/api/v1/graphs/algorithms/cycles", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["cycle_count"] >= 1
    assert data["typology"] == "Circular Flow Layering"

def test_risk_scoring_api(client):
    payload = {
        "entity_id": "TR-90421073",
        "dataset": "ibm_amlsim_500k",
        "lookback_days": 30
    }
    res = client.post("/api/v1/risk/score", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["entity_id"] == "TR-90421073"
    assert 0.0 <= data["calibrated_risk_score"] <= 1.0
    assert len(data["risk_signals"]) > 0

def test_run_investigation_api(client):
    payload = {
        "case_id": "FG-8421",
        "entity_id": "TR-90421073",
        "dataset": "ibm_amlsim_500k",
        "priority": "High"
    }
    res = client.post("/api/v1/investigations/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["case_id"] == "FG-8421"
    assert len(data["execution_steps"]) >= 5

def test_evidence_deposit_api(client):
    payload = {
        "case_id": "FG-8421",
        "title": "Wire Transfer Swift Confirmation MT103",
        "evidence_type": "bank_statement",
        "raw_content": "{'sender': 'TR-90421073', 'amount': 2500000, 'currency': 'TRY'}",
        "deposited_by": "Lead Investigator E. Kaya"
    }
    res = client.post("/api/v1/evidence/deposit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "sha256_hash" in data
    assert len(data["sha256_hash"]) == 64
    assert data["status"] == "Verified & Merkle-Anchored"

def test_explain_subgraph_api(client):
    res = client.post("/api/v1/graphs/explain", params={"entity_id": "TR-90421073", "dataset": "ibm_amlsim_500k"})
    assert res.status_code == 200
    data = res.json()
    assert data["center_entity_id"] == "TR-90421073"
    assert data["critical_edges_count"] >= 1
    assert "GNN Graph Attention" in data["narrative_explanation"]

def test_sar_xml_export_api(client):
    res = client.get("/api/v1/evidence/FG-8421/sar-xml")
    assert res.status_code == 200
    assert "application/xml" in res.headers["content-type"]
    text = res.text
    assert "<SuspiciousActivityReport" in text
    assert "FG-8421" in text
    assert "</SuspiciousActivityReport>" in text

def test_verify_evidence_hash_api(client):
    # Test valid hash seeded in EV-901
    payload = {"sha256_hash": "b2f6762391082"}
    res = client.post("/api/v1/evidence/verify", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "is_valid" in data
    assert "merkle_root" in data

def test_benchmark_leaderboard_api(client):
    res = client.get("/api/v1/benchmarks/leaderboard")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    champion = next(m for m in data if m["status"] == "champion")
    assert champion["amlsim_prauc"] > 0.90

def test_run_benchmark_suite_api(client):
    res = client.post("/api/v1/benchmarks/run")
    assert res.status_code == 200
    data = res.json()
    assert data["benchmark_status"] == "COMPLETED"
    assert "PR-AUC" in data["empirical_lift_vs_tabular"]
    assert len(data["datasets_evaluated"]) == 3


