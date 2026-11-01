# FraudGraph AI Security Policy

## 1. Security Philosophy & Guardrails

FraudGraph AI is engineered for high-assurance financial intelligence environments. The platform adheres to strict institutional security principles:

1. **Human-in-the-Loop Constraint:** Under no circumstances does FraudGraph AI autonomously execute account freezes, asset seizures, transaction cancellations, or official regulatory STR/SAR filings without human verification and digital sign-off by a certified analyst.
2. **Zero-PII Propagation in LLM Prompts:** Before any transaction graph data or account metadata is dispatched to AI agent contexts, the `E31 Privacy Guardian` tokenizes and salts national identity numbers, credit card PANs, and phone numbers.
3. **Immutable Cryptographic Audit Trail:** All agent tool invocations, analyst reviews, hypothesis tests, and evidence records are signed into an append-only SHA-256 Merkle hash chain.
4. **Least-Privilege Tool Execution:** Agents do not possess arbitrary shell or unbounded SQL/Cypher execution capabilities. All database interactions occur through sanitized, parameterized read-only view adapters.
5. **Circuit Breakers & Hard Budget Limits:** `A05 Budget Controller` enforces strict per-case latency, token ($1.50 cap), and execution recursion limits to prevent runaway loops or denial-of-service states.

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability, please do **NOT** open a public issue.

Please submit your report through the secure security intake channel:
- **Email:** `security@fraudgraph-ai.internal` or via our coordinated disclosure portal.
- **PGP Key:** Available upon request.

### Response Timelines
- **Initial Response:** Within 24 hours.
- **Triage & Reproduction:** Within 72 hours.
- **Remediation & Patch Release:** Coordinated release within 14 business days depending on severity.

---

## 3. Supported Versions

| Version | Supported | Security Maintenance |
| :---: | :---: | :---: |
| 1.0.x | Yes | Current Release |
| < 1.0 | No | End of Life |

---

## 4. Threat Model & Safeguards

| Threat Vector | Potential Impact | Enforced Safeguard |
| :--- | :--- | :--- |
| **Prompt Injection via Counterparty Notes** | Malicious transaction memo attempting to override supervisor plan | Strict input sanitization, structural delimiter enforcement, separate data vs instructions channels. |
| **Model Inversion / PII Extraction** | Extraction of training identities from GNN node embeddings | Inductive sampling with neighborhood differential privacy checks, zero raw identity storage in weights. |
| **Information Leakage (Temporal Snooping)** | Future transaction data poisoning past risk estimations | Hard separation of `event_time` and `ingested_at` with strict causal time cutoffs. |
| **Unauthorized Evidence Manipulation** | Tampering with case findings before regulatory review | SHA-256 payload checksums verified by `D23 Evidence Verifier` on every read. |
