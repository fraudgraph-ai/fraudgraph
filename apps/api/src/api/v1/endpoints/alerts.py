from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import time
import hashlib
from src.schemas.alert import AlertItemSchema, EscalateAlertRequest, EscalateAlertResponse
from src.core.evidence_vault import evidence_vault

router = APIRouter(prefix="/alerts", tags=["Alert Intelligence"])

# Seed database for alerts
ALERTS_DATABASE = [
    {
        "id": "ALT-1094",
        "title": "Rapid Outbound Fund Dispersion",
        "description": "High-velocity outbound transfers from single node dispersing funds into 5 auxiliary mule accounts within 45 minutes.",
        "timestamp": "2026-03-29 14:21:00",
        "risk_level": "Critical",
        "risk_score": 0.94,
        "status": "Open",
        "target_account": "TR-90421073",
        "amount": "₺16,400,000",
        "typology": "Structuring & Layering (ML-04)",
        "rule_or_model": "Ensemble Fusion (GNN + LightGBM)"
    },
    {
        "id": "ALT-1093",
        "title": "Shared Device Hardware Identifier",
        "description": "Hardware identifier DEV-9921 shared across multiple corporate accounts initiating cross-entity transfers simultaneously.",
        "timestamp": "2026-03-29 14:03:00",
        "risk_level": "High",
        "risk_score": 0.89,
        "status": "Investigating",
        "target_account": "TR-48201994",
        "amount": "₺8,200,000",
        "typology": "Device & IP Collision",
        "rule_or_model": "Graph Link Prediction"
    },
    {
        "id": "ALT-1092",
        "title": "Closed 3-Node Circular Transfer Cycle",
        "description": "Closed circular transaction loop detected returning to originator after 3 intermediate hops with < 2% friction loss.",
        "timestamp": "2026-03-29 13:42:00",
        "risk_level": "Critical",
        "risk_score": 0.92,
        "status": "Open",
        "target_account": "TR-77291048",
        "amount": "₺24,100,000",
        "typology": "Circular Flow Layering",
        "rule_or_model": "Johnson Cycle Detector (C12)"
    },
    {
        "id": "ALT-1091",
        "title": "Cross-Border High-Volume Crypto Peeling",
        "description": "Rapid multi-hop wallet peel transactions originating from high-risk darknet liquidity pool.",
        "timestamp": "2026-03-29 13:15:00",
        "risk_level": "High",
        "risk_score": 0.85,
        "status": "Resolved",
        "target_account": "TR-10293847",
        "amount": "₺5,600,000",
        "typology": "Crypto Peeling Chain",
        "rule_or_model": "Elliptic GNN Classifier"
    },
    {
        "id": "ALT-1090",
        "title": "Dormant Corporate Account Sudden Spurt",
        "description": "Account inactive for 340 days suddenly receives ₺12M and initiates immediate cross-border wire transfers.",
        "timestamp": "2026-03-29 12:50:00",
        "risk_level": "Medium",
        "risk_score": 0.74,
        "status": "Open",
        "target_account": "TR-55667788",
        "amount": "₺12,000,000",
        "typology": "Dormant Velocity Spike",
        "rule_or_model": "Statistical Velocity Z-Score"
    }
]

@router.get("/", response_model=List[AlertItemSchema])
def list_alerts(
    severity: Optional[str] = Query(None, description="Filter by risk severity (Critical, High, Medium, Low)"),
    status: Optional[str] = Query(None, description="Filter by status (Open, Investigating, Resolved)"),
    search: Optional[str] = Query(None, description="Search term for title or account"),
    limit: int = Query(50, ge=1, le=100)
):
    """Retrieves high-priority financial crime alerts with optional severity and status filtering."""
    results = ALERTS_DATABASE
    if severity and severity.lower() != "all":
        results = [a for a in results if a["risk_level"].lower() == severity.lower()]
    if status and status.lower() != "all":
        results = [a for a in results if a["status"].lower() == status.lower()]
    if search:
        q = search.lower()
        results = [
            a for a in results
            if q in a["id"].lower() or q in a["title"].lower() or q in a["target_account"].lower()
        ]
    return results[:limit]

@router.post("/escalate", response_model=EscalateAlertResponse)
def escalate_alert(payload: EscalateAlertRequest):
    """
    Escalates an alert to a formal forensic case, anchors evidence with SHA-256 fingerprint,
    and dispatches the Multi-Agent Supervisor.
    """
    alert = next((a for a in ALERTS_DATABASE if a["id"] == payload.alert_id), None)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {payload.alert_id} not found")

    case_id = f"FG-{payload.alert_id.replace('ALT-', '')}"
    alert["status"] = "Investigating"

    # Deposit escalation evidence into cryptographic vault
    deposit = evidence_vault.deposit_evidence(
        case_id=case_id,
        title=f"Alert Escalation Record: {alert['title']}",
        evidence_type="alert_escalation",
        raw_content=f"ALERT: {alert['id']} | TARGET: {payload.target_account} | NOTES: {payload.analyst_notes}",
        deposited_by="Analyst E. Kaya"
    )

    return EscalateAlertResponse(
        alert_id=alert["id"],
        case_id=case_id,
        status="Escalated to Multi-Agent Supervisor",
        lead_analyst="Emre Kaya",
        sha256_audit_hash=deposit["sha256_hash"],
        message=f"Alert {alert['id']} escalated to Case {case_id} with cryptographic proof anchor."
    )
