# FraudGraph AI — System Architecture Document (v1.0)

## 1. Executive Summary

FraudGraph AI is a graph-native, multi-agent financial crime investigation and intelligence platform. It bridges statistical machine learning, Graph Neural Networks (PyG / Neo4j), deterministic rule evaluation, and a 36-role agentic investigation orchestrator to provide explainable, auditable case dossiers for financial crime analysts.

```
+-----------------------------------------------------------------------------------+
| 01. Ingestion Layer      | AMLSim, Elliptic++, TransXion, Kafka Streaming Events  |
| 02. Graph & Feature Eng  | Temporal Graph Builder, Entity Resolution, Feature DB  |
| 03. Risk Intelligence    | Rule Engine, Tabular LightGBM, GraphSAGE/GAT, Fusion   |
| 04. Multi-Agent Engine   | LangGraph Dynamic Router, 36 Specialist Agents         |
| 05. Case & Audit Vault   | Evidence DAG, Merkle Hash Chain, Human-in-the-Loop     |
| 06. Frontend Workbench   | React 18, TypeScript, Cytoscape.js, Enterprise UI      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Six-Layer Modular Monolith Architecture

### Layer 01 · Data Ingestion
- **Adapters:** IBM AMLSim (synthetic banking), Elliptic++ (Bitcoin transactions), TransXion (agentic AML ecosystem).
- **Canonical Event Store:** Parquet/PostgreSQL event store with strict separation between `event_time` and `ingested_at` to prevent future leakage.

### Layer 02 · Data & Graph Processing
- **Database:** Neo4j 5.x enterprise read-replica graph store.
- **Node Schema:** `Person`, `Organization`, `Account`, `Transaction`, `Device`, `IPAddress`, `Alert`, `Case`.
- **Edge Schema:** `OWNS`, `SENDS`, `RECEIVED_BY`, `USES_DEVICE`, `ACCESSED_FROM`, `BELONGS_TO`, `LINKED_TO_CASE`.
- **Temporal Integrity:** Time-bounded neighborhood queries preventing future transaction information from poisoning past subgraphs.

### Layer 03 · Detection & Risk Intelligence
- **Rules Baseline (C15):** Deterministic AML rules (FATF structuring bounds, rapid round-trip cycles).
- **Tabular ML (C16):** LightGBM classifier with SHAP tree explainability (PR-AUC 0.74).
- **Graph ML (C17):** Inductive GraphSAGE and GAT running on PyTorch Geometric with edge attention (PR-AUC 0.85).
- **Multi-Modal Ensemble (C19):** Isotonic calibration fusing tabular and graph logits (PR-AUC 0.912, Brier score 0.042).

### Layer 04 · Agentic Investigation Engine
- **Orchestration:** Stateful LangGraph workflow with circuit breakers.
- **Dynamic Routing:** A01 Supervisor and A04 Routing Optimizer activate specialist pools conditioned on alert topology.
- **Budget Guardrails:** A05 Budget Controller enforces max token ($1.50) and iteration boundaries per case.

### Layer 05 · Case Management & Cryptographic Audit
- **Immutable Provenance:** SHA-256 Merkle chain signing all evidence artifacts, query outputs, and analyst notes.
- **Evidence Grounding:** D23 Evidence Verifier confirms every natural-language claim against concrete hashes.
- **Human Review Gate:** No automatic fund freezes or regulatory filings. All actions are subject to L3 analyst sign-off.

### Layer 06 · Investigation Workbench (Frontend)
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Cytoscape.js.
- **12 Primary Modules:** Command Center, Alert Intelligence, Investigation Workspace, Graph Explorer, Transaction Intelligence, Agent Operations, Evidence Center, Risk Analytics, Model Intelligence, Dataset Registry, Compliance & Audit, System Administration.
- **Visual Design:** Dark-first enterprise palette inspired by Palantir Foundry, Linear, and Neo4j Bloom.

---

## 3. 24-Week Development Roadmap & Quality Gates

| Milestone | Target | Deliverables |
| :--- | :---: | :--- |
| **Gate 1: Graph MVP** | Week 6 | Ingestion pipeline, verified Neo4j schema, temporal builder, baseline rules |
| **Gate 2: Agent MVP** | Week 12 | 12 core agents (A01-A03, B07, B10, B13, C16, C19, D22, D23, D25, F33), LangGraph DAG |
| **Gate 3: Research Beta** | Week 18 | GraphSAGE/GAT models, 24 specialist agents, counter-hypotheses, evidence audit |
| **Gate 4: Research Release** | Week 24 | Complete 36 specialist roles, full empirical benchmark report, production packaging |
