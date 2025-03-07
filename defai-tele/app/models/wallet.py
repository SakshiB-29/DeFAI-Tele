from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Wallet(BaseModel):
    address: str = Field(..., description="Ethereum wallet address")
    balance: float = Field(0.0, description="Current wallet balance in ETH")
    usd_value: float = Field(0.0, description="Current wallet value in USD")
    is_whale: bool = Field(False, description="Whether this wallet is considered a whale")
    risk_score: float = Field(0.0, description="Risk assessment score (0-1)")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    tags: List[str] = Field(default_factory=list, description="Wallet tags (e.g., 'institutional', 'defi')")
    transaction_count: int = Field(0, description="Total number of transactions")
    first_seen: Optional[datetime] = None
    last_transaction: Optional[datetime] = None

    class Config:
        schema_extra = {
            "example": {
                "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "balance": 1000.5,
                "usd_value": 2500000.0,
                "is_whale": True,
                "risk_score": 0.3,
                "last_updated": "2024-03-07T12:00:00Z",
                "tags": ["institutional", "defi"],
                "transaction_count": 150,
                "first_seen": "2023-01-01T00:00:00Z",
                "last_transaction": "2024-03-07T11:30:00Z"
            }
        } 