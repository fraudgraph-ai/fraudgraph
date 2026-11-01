import pytest
from src.core.ml_engine import RiskMLEngine

@pytest.fixture
def ml_engine():
    return RiskMLEngine()

def test_extract_graph_features(ml_engine):
    feats = ml_engine.extract_graph_features("TR-90421073", "ibm_amlsim_500k")
    assert "in_degree" in feats
    assert "out_degree" in feats
    assert "flow_asymmetry" in feats
    assert feats["in_degree"] >= 1
    assert feats["out_degree"] >= 1

def test_calibrated_risk_score(ml_engine):
    res = ml_engine.score_entity("TR-90421073", "ibm_amlsim_500k")
    assert 0.0 <= res["calibrated_risk_score"] <= 1.0
    assert res["risk_level"] in ["High", "Medium", "Low"]
    assert res["uncertainty_brier"] == 0.042
    assert len(res["feature_drivers"]) >= 3
    assert len(res["risk_signals"]) >= 3
