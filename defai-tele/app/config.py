from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Keys
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    ALCHEMY_API_KEY: str = os.getenv("ALCHEMY_API_KEY", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Blockchain Settings
    ETH_NETWORK: str = os.getenv("ETH_NETWORK", "mainnet")
    WHALE_THRESHOLD: float = float(os.getenv("WHALE_THRESHOLD", "1000000"))  # USD
    
    # Application Settings
    APP_NAME: str = "DeFi Smart Money Tracker"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database Settings
    DB_NAME: str = "defi_tracker"
    
    # ML Model Settings
    MODEL_PATH: str = "app/ml/models"
    RISK_THRESHOLD: float = 0.7
    
    # Alert Settings
    ALERT_COOLDOWN: int = 300  # seconds
    MAX_ALERTS_PER_HOUR: int = 10
    
    class Config:
        env_file = ".env"

settings = Settings() 