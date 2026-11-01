# ADR-004: Cryptographic SHA-256 Tamper-Evident Evidence Vault & SAR XML Export

## Status
Accepted

## Context
Regulatory compliance frameworks (FinCEN, MASAK, FATF, MAS) require chain-of-custody verification for every piece of digital evidence involved in a suspicious activity filing. If an investigator or system actor modifies transaction details or timestamps after an alert is opened, the audit trail is compromised. Furthermore, regulatory agencies reject free-form narratives and require strictly structured XML payloads adhering to official schemas.

## Decision
We engineered `CryptographicEvidenceVault`:
1. **SHA-256 Merkle Ledger:** Every piece of evidence (bank statements, graph snapshots, IP logs) is hashed immediately upon ingest using deterministic SHA-256. The hash is anchored into an append-only cryptographic ledger with Merkle root computation.
2. **Deterministic Tamper Verification:** The `/api/v1/evidence/verify` endpoint allows compliance officers or judicial authorities to verify document integrity against the Merkle root in O(1) time.
3. **Automated Regulatory SAR XML Export:** The vault compiles investigation findings, subject details, activity dates, and narrative grounds into FinCEN / MASAK compliant XML format via `/api/v1/evidence/{case_id}/sar-xml`.

## Consequences
- **Positive:**
  - Tamper-evident chain of custody satisfying banking secrecy and anti-money laundering evidentiary standards.
  - Zero-touch export of machine-readable XML ready for direct regulatory portal transmission.
- **Negative:**
  - Once evidence is deposited, it cannot be modified in place; corrections require an append-only superseding amendment entry.
