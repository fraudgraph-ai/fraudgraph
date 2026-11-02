from pydantic import BaseModel, Field
from typing import List, Optional

class TransactionItemSchema(BaseModel):
    id: str = Field(..., description="Unique transaction reference ID")
    source_account: str = Field(..., description="Originator account or wallet")
    target_account: str = Field(..., description="Beneficiary account or wallet")
    amount: float = Field(..., description="Numeric transaction amount")
    currency: str = Field("TRY", description="ISO currency code")
    timestamp: str = Field(..., description="Normalized timestamp")
    channel: str = Field(..., description="Swift, EFT, FAST, Crypto, POS")
    is_flagged: bool = Field(False, description="Flagged by real-time detector")
    pattern_type: str = Field("normal", description="normal, circular, smurfing, peeling, hardware_collision")
    risk_score: float = Field(0.1, ge=0.0, le=1.0, description="Transaction anomaly score")
