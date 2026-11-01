# FraudGraph AI — Product Requirements Document (PRD v1.0)

## Problem Statement

Conventional AML/anti-fraud systems typically produce opaque probability scores (e.g. `fraud_probability = 0.93`) without verifiable proof chains, forcing human compliance officers to spend hours manually querying databases, reconstructing transaction timelines, and sifting through false positives.

**FraudGraph AI** addresses this problem by unifying:
1. **Graph Neural Networks & Tabular ML:** Generating calibrated risk signals from multi-hop account topologies.
2. **Multi-Agent Critical Investigation:** 36 specialized AI agents running hypothesis testing, counter-hypothesis exploration, and evidence verification.
3. **Forensic Evidence Dossiers:** Producing fully auditable, cited case files with zero ungrounded assertions.

## Target User Personas
- **L1 / L2 Fraud Analyst:** Triages incoming high-velocity alerts, explores subgraphs, and initiates agent investigations.
- **L3 Senior Investigator:** Reviews generated hypotheses, inspects contradictory proofs, and executes final disposition.
- **Risk & ML Engineer:** Evaluates model drift, PR-AUC benchmarks, and GNN attention weights.
- **Compliance & Audit Officer:** Inspects immutable Merkle audit trails and validates regulatory reporting schemas.

## Core Research Questions (RQs)
- **RQ-01:** Does multi-agent critical investigation improve evidence precision compared to a single monolithic LLM prompt?
- **RQ-02:** Does combining Tabular ML + Graph Topological features + GNN attention improve PR-AUC and Recall@100 over standalone models?
- **RQ-03:** Does temporal graph windowing yield earlier detection of structuring/layering than static graph analysis?
- **RQ-04:** Do dedicated Critic and Evidence Verifier agents reduce hallucinated fraud justifications?
- **RQ-05:** Does dynamic specialist routing reduce token cost compared to executing all 36 agents blindly?
- **RQ-06:** Does conformal uncertainty calibration improve the selection of cases requiring human review?
- **RQ-07:** Can graph patterns learned on synthetic AMLSim data generalize to real-world blockchain networks (Elliptic++)?
- **RQ-08:** Does minimal explainable subgraph selection improve human analyst investigation speed?
