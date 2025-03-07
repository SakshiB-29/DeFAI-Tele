from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class WalletType(str, Enum):
    WHALE = "whale"
    MARKET_MAKER = "market_maker"
    RETAIL_TRADER = "retail_trader"
    RISKY_WALLET = "risky_wallet"
    UNKNOWN = "unknown"

class WalletBehavior(str, Enum):
    ACCUMULATING = "accumulating"
    DUMPING = "dumping"
    WASH_TRADING = "wash_trading"
    STABLE = "stable"
    UNKNOWN = "unknown"

class RiskLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNKNOWN = "unknown"

class WalletClassification(BaseModel):
    address: str = Field(..., description="Ethereum wallet address")
    wallet_type: WalletType = Field(WalletType.UNKNOWN, description="Classified wallet type")
    behavior: WalletBehavior = Field(WalletBehavior.UNKNOWN, description="Current wallet behavior")
    risk_level: RiskLevel = Field(RiskLevel.UNKNOWN, description="Overall risk level")
    risk_score: float = Field(0.0, description="Risk score (0-1)")
    confidence: float = Field(0.0, description="Classification confidence (0-1)")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    features: Dict[str, float] = Field(default_factory=dict, description="Wallet features used for classification")
    tags: List[str] = Field(default_factory=list, description="Additional wallet tags")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional classification metadata")

    class Config:
        schema_extra = {
            "example": {
                "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                "wallet_type": "whale",
                "behavior": "accumulating",
                "risk_level": "medium",
                "risk_score": 0.4,
                "confidence": 0.85,
                "last_updated": "2024-03-07T12:00:00Z",
                "features": {
                    "transaction_volume": 0.8,
                    "contract_interaction_frequency": 0.3,
                    "token_diversity": 0.7,
                    "network_centrality": 0.6
                },
                "tags": ["defi", "liquidity_provider"],
                "metadata": {
                    "first_seen": "2023-01-01T00:00:00Z",
                    "total_transactions": 1500,
                    "active_tokens": 25
                }
            }
        } 