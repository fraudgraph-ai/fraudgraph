## 🎯 Overview & Context
<!-- Describe the change, the problem it solves, and which architectural layer it addresses. -->
- **Layer Impacted:** [e.g., Layer 2 Graph Processing / Layer 4 Agent Orchestration / Layer 6 UI Workbench]
- **Related Issue:** Fixes #<!-- issue number -->
- **Milestone / Roadmap Gate:** [e.g., Phase 1 / Phase 2]

## 🔬 Research & Empirical Grounding
<!-- If this PR touches detection, models, or multi-agent orchestration, indicate PRD research question alignment: -->
- [ ] Addresses **RQ-01** (Multi-Agent vs Single LLM Evidence Accuracy)
- [ ] Addresses **RQ-02** (Tabular + Graph Feature + GNN PR-AUC Improvements)
- [ ] Addresses **RQ-03** (Temporal Graph Analysis vs Static Early Warning)
- [ ] Addresses **RQ-04** (Critic & Evidence Verifier False Reason Reduction)
- [ ] Addresses **RQ-05** (Dynamic Agent Routing Cost/Latency)
- [ ] Addresses **RQ-06** (Uncertainty Calibration & Human Review Triage)
- [ ] Addresses **RQ-07** (Synthetic Generalization Across Generators)
- [ ] Addresses **RQ-08** (Explainable Subgraph Extraction)
- [ ] Not applicable (Infra / UI / Docs)

## 🧪 Testing & Verification
<!-- Describe testing steps and attach proof of passing test suite -->
- [ ] Unit tests added / updated in `src/tests/`
- [ ] Test suite passed: `npm test -- --run`
- [ ] Production build cleanly verified: `npm run build`
- [ ] Visual verification of UI responsiveness / interactive graph layout

## 🛡️ Security & PII Checklist
- [ ] No API keys, credentials, or private access tokens committed
- [ ] No real PII or live banking customer data (synthetic or anonymized data only)
- [ ] Strict input validation on graph query endpoints and filter sliders
