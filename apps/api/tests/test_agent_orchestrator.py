"""
FraudGraph AI — Multi-Agent Orchestrator Verification Tests
Validates Dynamic Routing (RQ-05), Anti-Hallucination Grounding (RQ-01), and Devil's Advocate Critic (RQ-04).
"""

import pytest
from src.core.agent_orchestrator import agent_orchestrator
from src.core.graph_engine import graph_engine

def test_dynamic_routing_specialist_budget():
    """Validates that dynamic routing respects the specialist budget and avoids exhaustive 36-agent execution (RQ-05)."""
    res = agent_orchestrator.run_investigation(
        case_id="FG-8421",
        entity_id="TR-90421073",
        dataset="ibm_amlsim_500k",
        budget=12
    )
    assert res["status"] == "In Progress"
    assert res["assigned_agents_count"] <= 12
    assert res["assigned_agents_count"] >= 4
    assert res["total_latency_seconds"] < 5.0

def test_anti_hallucination_verification_rq01():
    """Validates that 100% of generated entity citations resolve against real graph nodes (RQ-01)."""
    res = agent_orchestrator.run_investigation(
        case_id="FG-8421",
        entity_id="TR-90421073",
        dataset="ibm_amlsim_500k"
    )
    g = graph_engine.get_graph("ibm_amlsim_500k")
    valid_nodes = set(g.nodes())
    
    # Check that any cited account/device exists in the graph or is an audit token
    for step in res["execution_steps"]:
        for citation in step["citations"]:
            if citation.startswith("TR-") or citation.startswith("DEV-"):
                assert citation in valid_nodes, f"Hallucinated citation detected: {citation}"

def test_risk_critic_counter_hypothesis_rq04():
    """Validates that Risk Critic (Role E-26) evaluates legitimate alternative explanations (RQ-04)."""
    res = agent_orchestrator.run_investigation(
        case_id="FG-8421",
        entity_id="TR-90421073",
        dataset="ibm_amlsim_500k"
    )
    # Step 4 should be the Risk Critic & Devil's Advocate
    critic_step = next(s for s in res["execution_steps"] if s["agent_role_id"] == "E-26")
    assert critic_step["agent_name"] == "Risk Critic & Devil's Advocate"
    assert "hypothesis" in critic_step["finding_summary"].lower()
    assert "invoice" in critic_step["finding_summary"].lower() or "commercial" in critic_step["finding_summary"].lower()
