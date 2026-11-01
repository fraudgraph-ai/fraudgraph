# FraudGraph AI
### Enterprise Financial Crime Intelligence · Graph Machine Learning · Multi-Agent Investigation · Explainable AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3.30-ea580c.svg)](https://js.cytoscape.org/)

FraudGraph AI is a graph-native, multi-agent financial crime intelligence and investigation platform designed for institutional banking, fintech risk teams, and forensic analysts.

---

## Key Capabilities

- **12 Primary Operational Modules:**
  1. **Command Center:** Executive fraud metrics, active cases, risk distribution donut, alert trend chart, agent health gauge.
  2. **Alert Intelligence:** Automated detection triage queue with SLA timers and model origins.
  3. **Investigation Workspace:** 3-column forensic workbench with case timeline, interactive subgraphs, and AI hypotheses.
  4. **Graph Explorer:** Interactive Cytoscape.js canvas with halo-pulsing high-risk nodes, Louvain community detection, and inspector.
  5. **Transaction Intelligence:** Real-time stream analysis with layering, smurfing, and rapid drain pattern filters.
  6. **Agent Operations:** Multi-agent orchestration center managing all 36 specialist roles across 6 domains.
  7. **Evidence Center:** Forensic vault with SHA-256 signed evidence items and claim-to-proof verification.
  8. **Risk Analytics:** Model benchmark evaluations (PR-AUC, Recall@100, Brier calibration score, confusion matrices).
  9. **Model Intelligence:** Model registry with SHAP feature importances, artifact hashes, and drift metrics.
  10. **Dataset Registry:** Ingestion contracts for IBM AMLSim, Elliptic++, and TransXion datasets.
  11. **Compliance & Audit:** Immutable append-only audit trail and human-in-the-loop regulatory guards.
  12. **System Administration:** Neo4j connection pool, PostgreSQL store, Redis queue, and LLM budget circuit breakers.

---

## 36 Specialist Agent Architecture

Organized into 6 cooperative operational domains:
- **Group A (A01–A06):** Orchestration & Case Management
- **Group B (B07–B14):** Transaction & Graph Intelligence
- **Group C (C15–C21):** Machine Learning & Risk Intelligence
- **Group D (D22–D28):** Evidence & Critical Investigation
- **Group E (E29–E32):** Compliance & Security
- **Group F (F33–F36):** Reporting & Continuous Learning

Full formal specifications are located in [`docs/AGENT_CATALOG.md`](./docs/AGENT_CATALOG.md).

---

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation & Development Run
```bash
# Clone and enter directory
cd "FRAUDGRAPH AI"

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## Documentation
- [`docs/PRD.md`](./docs/PRD.md) — Product Requirements & Research Questions
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Six-Layer System Architecture & Roadmap
- [`docs/AGENT_CATALOG.md`](./docs/AGENT_CATALOG.md) — Complete 36 Specialist Agent Contracts
