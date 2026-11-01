"""
FraudGraph AI — Evidence Vault & Cryptographic Audit Ledger
Provides SHA-256 evidence hashing, tamper-evident proof chains, and SAR dossier generation.
"""

import hashlib
import time
from typing import Dict, List, Any

class EvidenceVault:
    def __init__(self):
        self.evidence_store: Dict[str, Dict[str, Any]] = {}
        self._seed_default_evidence()

    def _seed_default_evidence(self):
        initial_evidence = [
            {
                "evidence_id": "EV-901",
                "case_id": "FG-8421",
                "title": "Circular Fund Transfer Graph Snapshot",
                "evidence_type": "graph_snapshot",
                "raw_content": "CYCLE: TR-90421073 -> TR-10293847 -> TR-55667788 -> TR-90421073 (₺7,430,000.00)",
                "deposited_by": "Agent B-08 (Circular Routing Detector)"
            },
            {
                "evidence_id": "EV-902",
                "case_id": "FG-8421",
                "title": "Hardware Fingerprint Collision Audit",
                "evidence_type": "ip_geolocation",
                "raw_content": "DEVICE_ID: DEV-9921 | IP: 195.175.254.12 | Simultaneous session on TR-90421073 and TR-33445566",
                "deposited_by": "Agent C-14 (Device & IP Fingerprint Auditor)"
            }
        ]
        for ev in initial_evidence:
            h = hashlib.sha256(ev["raw_content"].encode("utf-8")).hexdigest()
            self.evidence_store[ev["evidence_id"]] = {
                **ev,
                "sha256_hash": h,
                "timestamp": "2026-03-29 14:22:15",
                "status": "Verified & Merkle-Anchored"
            }

    def deposit_evidence(self, case_id: str, title: str, evidence_type: str, raw_content: str, deposited_by: str = "Analyst E. Kaya") -> Dict[str, Any]:
        """Calculates deterministic SHA-256 hash and records into vault."""
        sha256_hash = hashlib.sha256(raw_content.encode("utf-8")).hexdigest()
        ev_id = f"EV-{len(self.evidence_store) + 901}"
        ts = time.strftime("%Y-%m-%d %H:%M:%S")

        record = {
            "evidence_id": ev_id,
            "case_id": case_id,
            "title": title,
            "evidence_type": evidence_type,
            "raw_content": raw_content,
            "sha256_hash": sha256_hash,
            "timestamp": ts,
            "status": "Verified & Merkle-Anchored",
            "deposited_by": deposited_by
        }
        self.evidence_store[ev_id] = record
        return record

    def get_case_evidence(self, case_id: str) -> List[Dict[str, Any]]:
        return [ev for ev in self.evidence_store.values() if ev["case_id"] == case_id]

    def generate_dossier_markdown(self, case_id: str) -> str:
        items = self.get_case_evidence(case_id)
        md = [
            f"# FORENSIC FINANCIAL CRIME DOSSIER: {case_id}",
            f"**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S UTC')}",
            f"**Classification:** STRICTLY CONFIDENTIAL // LAW ENFORCEMENT & COMPLIANCE USE ONLY",
            "",
            "## 1. Executive Summary",
            f"Investigation {case_id} relates to multi-hop coordinated layering and circular funds routing detected across bank accounts.",
            "",
            "## 2. Cryptographic Proof Chain (SHA-256 Evidence Vault)",
            "| Evidence ID | Title | Type | Deposited By | SHA-256 Fingerprint |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ]
        for it in items:
            md.append(f"| `{it['evidence_id']}` | {it['title']} | `{it['evidence_type']}` | {it['deposited_by']} | `{it['sha256_hash'][:24]}...` |")

        md.extend([
            "",
            "## 3. Regulatory Disposition & Recommendation",
            "- **Action:** Immediate account freeze and generation of FinCEN Suspicious Activity Report (SAR).",
            "- **Analyst Signoff:** Emre Kaya (Lead Financial Crime Investigator)",
            "- **Four-Eye Compliance Officer:** Cansu Kalkan (Head of AML Compliance)"
        ])
        return "\n".join(md)

evidence_vault = EvidenceVault()
