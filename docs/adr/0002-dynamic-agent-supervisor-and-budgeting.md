# ADR-002: Dynamic 36-Agent Supervisor Routing with Budget Constraints (RQ-05)

## Status
Accepted

## Context
Executing all 36 specialist agents (Groups A through F) exhaustively for every financial crime alert creates prohibitive API token costs ($2.80+ per alert) and unacceptable latency (>18 seconds), causing investigator alert backlogs. Furthermore, benign alerts or simple structuring typologies do not require cross-border crypto specialists or advanced shell company piercing agents.

## Decision
We implemented a hierarchical supervisor routing model (`MultiAgentOrchestrator`):
1. **Dynamic Typology Classification:** The Master Investigation Supervisor (A-01) parses initial alert signals and classifies the dominant typology (Layering, Structuring, Peeling Chains, Hardware Collisions).
2. **Selective DAG Compilation:** Instead of triggering all 36 agents, the supervisor dynamically compiles a pruned Directed Acyclic Graph (DAG) consisting of 4 to 6 critical specialists.
3. **Specialist Budget Bounds:** Enforces hard token limits (max $0.35/case) and latency bounds (≤ 3.4 seconds).

## Consequences
- **Positive:**
  - Latency reduced from 18.2s to 2.4s (86.8% improvement), exceeding the RQ-05 goal of ≥ 40%.
  - Drastic token cost savings: Typical alert cost reduced to $0.24.
  - Transparent execution DAG visible to human investigators in the Agent Operations workbench.
- **Negative:**
  - Complex transnational multi-typology cases may require dynamic secondary expansion if the initial specialist team uncovers unexpected foreign hops.
