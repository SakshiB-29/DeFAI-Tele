from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    TRANSFER = "transfer"
    SWAP = "swap"
    CONTRACT_INTERACTION = "contract_interaction"
    TOKEN_APPROVAL = "token_approval"
    UNKNOWN = "unknown"

class Transaction(BaseModel):
    hash: str = Field(..., description="Transaction hash")
    from_address: str = Field(..., description="Sender's wallet address")
    to_address: str = Field(..., description="Recipient's wallet address")
    value: float = Field(0.0, description="Transaction value in ETH")
    usd_value: float = Field(0.0, description="Transaction value in USD")
    timestamp: datetime = Field(..., description="Transaction timestamp")
    block_number: int = Field(..., description="Block number")
    gas_price: float = Field(..., description="Gas price in Gwei")
    gas_used: int = Field(..., description="Gas used")
    transaction_type: TransactionType = Field(TransactionType.UNKNOWN)
    contract_address: Optional[str] = None
    method_name: Optional[str] = None
    input_data: Optional[str] = None
    risk_score: float = Field(0.0, description="Risk assessment score (0-1)")
    tags: List[str] = Field(default_factory=list, description="Transaction tags")
    is_whale_transaction: bool = Field(False, description="Whether this is a whale transaction")
    related_addresses: List[str] = Field(default_factory=list, description="Related wallet addresses")

    class Config:
        schema_extra = {
            "example": {
                "hash": "0x123...abc",
                "from_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "to_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44f",
                "value": 100.0,
                "usd_value": 250000.0,
                "timestamp": "2024-03-07T12:00:00Z",
                "block_number": 18000000,
                "gas_price": 50.0,
                "gas_used": 21000,
                "transaction_type": "transfer",
                "risk_score": 0.2,
                "tags": ["whale", "defi"],
                "is_whale_transaction": True,
                "related_addresses": ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"]
            }
        } 