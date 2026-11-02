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

def test_stream_investigation_api(client):
    res = client.get("/api/v1/investigations/stream/FG-8421?entity_id=TR-90421073")
    assert res.status_code == 200
    assert "text/event-stream" in res.headers["content-type"]
    body = res.text
    assert "event: AGENT_STARTED" in body
    assert "event: TOOL_CALL" in body
    assert "event: EVIDENCE_FOUND" in body
    assert "event: CRITIC_CHALLENGE" in body
    assert "event: SCORE_UPDATED" in body
    assert "event: AGENT_COMPLETED" in body
    assert "johnson_cycle_detector" in body

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

def test_list_alerts_api(client):
    res = client.get("/api/v1/alerts/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    assert any(a["id"] == "ALT-1094" for a in data)

def test_escalate_alert_api(client):
    payload = {
        "alert_id": "ALT-1094",
        "target_account": "TR-90421073",
        "analyst_notes": "Rapid dispersion across multiple mule nodes detected",
        "priority": "High"
    }
    res = client.post("/api/v1/alerts/escalate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["alert_id"] == "ALT-1094"
    assert "FG-" in data["case_id"]
    assert len(data["sha256_audit_hash"]) == 64

def test_list_transactions_api(client):
    res = client.get("/api/v1/transactions/?min_amount=1000000")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert all(t["amount"] >= 1000000 for t in data)

def test_list_rules_api(client):
    res = client.get("/api/v1/rules/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    rule_ids = [r["id"] for r in data]
    assert "RUL-CIRC-01" in rule_ids

def test_create_rule_api(client):
    payload = {
        "name": "Custom Peeling Chain Detector",
        "typology": "peeling_chain",
        "description": "Custom rule detecting rapid split peels",
        "severity": "High",
        "parameters": {"min_hops": 5, "min_amount": 250000.0},
        "is_active": True
    }
    res = client.post("/api/v1/rules/", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "RUL-CUSTOM-" in data["id"]
    assert data["name"] == "Custom Peeling Chain Detector"

def test_toggle_rule_api(client):
    res = client.patch("/api/v1/rules/RUL-CIRC-01/toggle")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "RUL-CIRC-01"
    # toggle back to active
    res2 = client.patch("/api/v1/rules/RUL-CIRC-01/toggle")
    assert res2.status_code == 200
    assert res2.json()["is_active"] is True

def test_simulate_rule_api(client):
    payload = {
        "dataset": "ibm_amlsim_500k",
        "sample_entities_limit": 100
    }
    res = client.post("/api/v1/rules/RUL-CIRC-01/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["rule_id"] == "RUL-CIRC-01"
    assert data["rule_hits_count"] >= 1
    assert data["hit_rate_percentage"] > 0
    assert data["total_exposure_volume_try"] > 0

def test_submit_case_review_api(client):
    payload = {
        "case_id": "FG-8421",
        "disposition": "Escalate for SAR/STR Regulatory Filing",
        "justification": "Confirmed multi-hop circular funds layering across 3 entities",
        "lead_analyst": "Analyst E. Kaya"
    }
    res = client.post("/api/v1/compliance/reviews/submit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["case_id"] == "FG-8421"
    assert data["status"] == "PENDING_COMPLIANCE_SIGNOFF"
    assert len(data["primary_signature_sha256"]) == 64
    assert data["sar_filing_unlocked"] is False

def test_approve_case_review_api(client):
    payload = {
        "compliance_officer": "MLRO S. Demir",
        "notes": "Verified against graph nodes. Approved for FinCEN filing."
    }
    res = client.post("/api/v1/compliance/reviews/FG-8421/approve", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["case_id"] == "FG-8421"
    assert data["status"] == "DUAL_AUTHORIZED_FOR_REGULATORY_SUBMISSION"
    assert data["sar_filing_unlocked"] is True
    assert len(data["secondary_signature_sha256"]) == 64

def test_remand_case_review_api(client):
    payload = {
        "compliance_officer": "MLRO S. Demir",
        "remand_reasons": "Need audited proof of IP address geolocation."
    }
    res = client.post("/api/v1/compliance/reviews/FG-8419/remand", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["case_id"] == "FG-8419"
    assert data["status"] == "REMANDED_FOR_EVIDENCE"
    assert data["sar_filing_unlocked"] is False

def test_get_compliance_audit_logs_api(client):
    res = client.get("/api/v1/compliance/audit-logs")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert all("sha256_hash" in l for l in data)

def test_stream_metrics_api(client):
    res = client.get("/api/v1/stream/metrics")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY_STREAMING"
    assert data["total_events_processed"] > 0
    assert data["current_throughput_tx_sec"] > 0
    assert "average_ingest_latency_ms" in data
    assert data["connected_consumers_count"] >= 1

def test_stream_ingest_api(client):
    payload = {
        "events": [
            {
                "event_id": "TEST-STREAM-001",
                "source_account": "ACC-STREAM-ORIGIN",
                "target_account": "ACC-STREAM-TARGET",
                "amount": 7500000.0,
                "currency": "TRY",
                "channel": "FAST Instant"
            }
        ],
        "dataset_target": "ibm_amlsim_500k",
        "evaluate_rules": True
    }
    res = client.post("/api/v1/stream/ingest", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["events_ingested"] == 1
    assert data["nodes_added_or_updated"] == 2
    assert data["edges_added"] == 1
    assert data["alerts_generated_count"] >= 1
    assert data["status"] == "INGESTED_AND_GRAPH_SYNCHRONIZED"

def test_stream_simulate_burst_api(client):
    payload = {
        "burst_size": 200,
        "inject_circular_loop": True,
        "dataset_target": "ibm_amlsim_500k"
    }
    res = client.post("/api/v1/stream/simulate-burst", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["burst_size"] == 200
    assert data["throughput_tx_sec"] > 0
    assert data["critical_cycles_detected"] == 1
    assert data["status"] == "COMPLETED_STRESS_BENCHMARK"

