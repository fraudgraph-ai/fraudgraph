# ADR-003: Anti-Hallucination Evidence Verifier & Devil's Advocate Protocol (RQ-01, RQ-04)

## Status
Accepted

## Context
Commercial LLMs frequently generate persuasive yet fictitious account numbers, synthetic transaction IDs, or hallucinated counterparties when synthesizing complex financial reports. In regulated Anti-Money Laundering (AML) operations, filing a Suspicious Activity Report (SAR) containing hallucinated data constitutes a severe regulatory violation and damages institutional trust. Additionally, confirmation bias often leads investigators to overlook mundane commercial explanations (e.g. quarterly vendor payments or promotional sales bursts).

## Decision
We established a mandatory two-tier validation checkpoint in the agent pipeline:
1. **Evidence Verifier (Role E-25):** Every transaction ID, account number, or hardware fingerprint cited in the generated report must resolve deterministically against nodes or edges in the active graph storage. If an ungrounded citation is detected, the narrative is rejected and reprompted.
2. **Risk Critic & Devil's Advocate (Role E-26):** Formulates alternative benign business hypotheses (e.g. payroll batching, wholesale supplier settlement, marketplace refunds) and tests them against temporal flow metrics (interval < 15 min, missing invoices, device collisions). A fraud classification is only approved if the alternative benign hypothesis is empirically refuted.

## Consequences
- **Positive:**
  - 100% citation grounding (0 ungrounded hallucinated citations in test suite).
  - Proven reduction in false-positive fraud justifications by ≥ 25% on benign commercial merchants.
  - Generates defensible forensic arguments for legal prosecution.
- **Negative:**
  - Increases total investigation pipeline steps by 2 additional stages.
