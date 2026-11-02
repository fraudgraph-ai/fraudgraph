from fastapi import APIRouter, Query
from typing import List, Optional
from src.schemas.transaction import TransactionItemSchema

router = APIRouter(prefix="/transactions", tags=["Transaction Intelligence"])

# Seed database for transactions
TRANSACTIONS_DATABASE = [
    {
        "id": "TX-901842",
        "source_account": "TR-90421073",
        "target_account": "TR-38192044",
        "amount": 3850000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 14:10:12",
        "channel": "EFT / Fast Wire",
        "is_flagged": True,
        "pattern_type": "layering",
        "risk_score": 0.91
    },
    {
        "id": "TX-901843",
        "source_account": "TR-90421073",
        "target_account": "TR-49210082",
        "amount": 2450000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 14:15:33",
        "channel": "EFT / Fast Wire",
        "is_flagged": True,
        "pattern_type": "layering",
        "risk_score": 0.88
    },
    {
        "id": "TX-901844",
        "source_account": "TR-90421073",
        "target_account": "TR-88192011",
        "amount": 1980000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 14:22:45",
        "channel": "EFT / Fast Wire",
        "is_flagged": True,
        "pattern_type": "layering",
        "risk_score": 0.94
    },
    {
        "id": "TX-901845",
        "source_account": "TR-10293847",
        "target_account": "TR-55667788",
        "amount": 7430000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 14:35:10",
        "channel": "Swift MT103",
        "is_flagged": True,
        "pattern_type": "circular",
        "risk_score": 0.96
    },
    {
        "id": "TX-901846",
        "source_account": "TR-55667788",
        "target_account": "TR-90421073",
        "amount": 7380000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 14:55:00",
        "channel": "Swift MT103",
        "is_flagged": True,
        "pattern_type": "circular",
        "risk_score": 0.95
    },
    {
        "id": "TX-901847",
        "source_account": "TR-22334455",
        "target_account": "TR-99887766",
        "amount": 45000.0,
        "currency": "TRY",
        "timestamp": "2026-03-29 15:02:18",
        "channel": "FAST Instant",
        "is_flagged": False,
        "pattern_type": "normal",
        "risk_score": 0.08
    }
]

@router.get("/", response_model=List[TransactionItemSchema])
def list_transactions(
    pattern_type: Optional[str] = Query(None, description="Filter by pattern (layering, circular, normal)"),
    is_flagged: Optional[bool] = Query(None, description="Filter by flagged status"),
    min_amount: float = Query(0.0, ge=0.0, description="Minimum transaction amount"),
    search: Optional[str] = Query(None, description="Search by transaction ID or account"),
    limit: int = Query(50, ge=1, le=100)
):
    """Lists streaming transaction events with velocity and typology filtering."""
    results = [t for t in TRANSACTIONS_DATABASE if t["amount"] >= min_amount]
    if pattern_type and pattern_type.lower() != "all":
        results = [t for t in results if t["pattern_type"].lower() == pattern_type.lower()]
    if is_flagged is not None:
        results = [t for t in results if t["is_flagged"] == is_flagged]
    if search:
        q = search.lower()
        results = [
            t for t in results
            if q in t["id"].lower() or q in t["source_account"].lower() or q in t["target_account"].lower()
        ]
    return results[:limit]
