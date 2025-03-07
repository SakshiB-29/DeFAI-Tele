from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AlertType(str, Enum):
    WHALE_MOVEMENT = "whale_movement"
    LARGE_TRANSACTION = "large_transaction"
    RISK_DETECTED = "risk_detected"
    CONTRACT_INTERACTION = "contract_interaction"
    PRICE_IMPACT = "price_impact"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Alert(BaseModel):
    id: str = Field(..., description="Unique alert ID")
    type: AlertType = Field(..., description="Type of alert")
    severity: AlertSeverity = Field(..., description="Alert severity level")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    triggered_at: Optional[datetime] = None
    is_active: bool = Field(True, description="Whether the alert is active")
    conditions: Dict[str, Any] = Field(..., description="Alert conditions")
    notification_channels: List[str] = Field(default_factory=list, description="Notification channels (e.g., ['telegram'])")
    description: str = Field(..., description="Alert description")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional alert metadata")
    last_triggered: Optional[datetime] = None
    trigger_count: int = Field(0, description="Number of times this alert has been triggered")
    cooldown_period: int = Field(300, description="Cooldown period in seconds between triggers")

    class Config:
        schema_extra = {
            "example": {
                "id": "alert_123",
                "type": "whale_movement",
                "severity": "high",
                "created_at": "2024-03-07T12:00:00Z",
                "is_active": True,
                "conditions": {
                    "min_value_usd": 1000000,
                    "wallet_tags": ["whale", "institutional"]
                },
                "notification_channels": ["telegram"],
                "description": "Alert for whale movements over $1M USD",
                "metadata": {
                    "tracked_wallets": ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"],
                    "min_confidence": 0.8
                },
                "cooldown_period": 300
            }
        } 