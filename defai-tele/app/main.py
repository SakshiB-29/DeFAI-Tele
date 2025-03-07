from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from typing import List, Dict, Any
import logging
import asyncio
from app.models.wallet_classification import WalletClassification
from app.services.wallet_ai import WalletAIService
from app.services.blockchain import BlockchainService
from app.services.telegram_bot import TelegramBotService
from app.models.alert import Alert, AlertType, AlertSeverity
from app.models.transaction import Transaction
from app.models.wallet import Wallet

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered DeFi wallet tracking system",
    version="1.0.0"
)

# Initialize services
blockchain_service = BlockchainService()
wallet_ai_service = WalletAIService()
telegram_bot_service = TelegramBotService()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    try:
        # Start Telegram bot
        asyncio.create_task(telegram_bot_service.start())
        logger.info("Telegram bot started successfully")
    except Exception as e:
        logger.error(f"Error starting Telegram bot: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    try:
        # Stop Telegram bot
        await telegram_bot_service.stop()
        logger.info("Telegram bot stopped successfully")
    except Exception as e:
        logger.error(f"Error stopping Telegram bot: {str(e)}")
        raise

async def monitor_wallets():
    """Background task to monitor wallets and send alerts"""
    while True:
        try:
            # Get all watched wallets from command handler
            for chat_id, wallets in telegram_bot_service.command_handler.watched_wallets.items():
                for wallet_address in wallets:
                    try:
                        # Get latest wallet info and transactions
                        wallet = await blockchain_service.get_wallet_info(wallet_address)
                        transactions = await blockchain_service.get_wallet_transactions(wallet_address)
                        
                        # Get wallet classification
                        classification = await wallet_ai_service.classify_wallet(wallet, transactions)
                        
                        # Check for significant changes and generate alerts
                        if classification.risk_score >= settings.RISK_THRESHOLD:
                            alert = Alert(
                                id=f"alert_{wallet_address}_{wallet.last_updated.timestamp()}",
                                type=AlertType.RISK_DETECTED,
                                severity=AlertSeverity.HIGH,
                                description=f"High risk detected for wallet {wallet_address}",
                                conditions={
                                    "risk_score": classification.risk_score,
                                    "wallet_type": classification.wallet_type.value,
                                    "behavior": classification.behavior.value
                                }
                            )
                            await telegram_bot_service.send_alert(alert, None, wallet)
                        
                        # Check for whale movements
                        if classification.wallet_type == "whale" and transactions:
                            latest_tx = transactions[0]
                            if latest_tx.usd_value >= settings.WHALE_THRESHOLD:
                                alert = Alert(
                                    id=f"whale_alert_{wallet_address}_{latest_tx.timestamp.timestamp()}",
                                    type=AlertType.WHALE_MOVEMENT,
                                    severity=AlertSeverity.MEDIUM,
                                    description=f"Whale movement detected for {wallet_address}",
                                    conditions={
                                        "transaction_value": latest_tx.usd_value,
                                        "transaction_type": latest_tx.transaction_type.value
                                    }
                                )
                                await telegram_bot_service.send_alert(alert, latest_tx, wallet)
                        
                        # Check for risky contract interactions
                        contract_txs = [tx for tx in transactions if tx.transaction_type == "CONTRACT_INTERACTION"]
                        if contract_txs and any(tx.risk_score >= 0.7 for tx in contract_txs):
                            alert = Alert(
                                id=f"contract_alert_{wallet_address}_{contract_txs[0].timestamp.timestamp()}",
                                type=AlertType.CONTRACT_INTERACTION,
                                severity=AlertSeverity.HIGH,
                                description=f"Risky contract interaction detected for {wallet_address}",
                                conditions={
                                    "contract_address": contract_txs[0].contract_address,
                                    "risk_score": contract_txs[0].risk_score
                                }
                            )
                            await telegram_bot_service.send_alert(alert, contract_txs[0], wallet)
                    
                    except Exception as e:
                        logger.error(f"Error monitoring wallet {wallet_address}: {str(e)}")
                        continue
            
            # Wait before next check
            await asyncio.sleep(60)  # Check every minute
            
        except Exception as e:
            logger.error(f"Error in wallet monitoring task: {str(e)}")
            await asyncio.sleep(60)  # Wait before retrying

@app.get("/")
async def root():
    return {"message": "Welcome to DeFi Smart Money Tracker API"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/whales")
async def get_whales():
    """
    Get list of tracked whale wallets
    """
    try:
        # TODO: Implement whale tracking logic
        return {"whales": []}
    except Exception as e:
        logger.error(f"Error fetching whales: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/transactions")
async def get_transactions():
    """
    Get recent transactions
    """
    try:
        # TODO: Implement transaction fetching logic
        return {"transactions": []}
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/alert")
async def configure_alert(alert_config: Dict[str, Any]):
    """
    Configure alert settings
    """
    try:
        # TODO: Implement alert configuration logic
        return {"status": "success", "message": "Alert configured successfully"}
    except Exception as e:
        logger.error(f"Error configuring alert: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/risk-score/{wallet_address}")
async def get_risk_score(wallet_address: str):
    """
    Get risk assessment for a wallet
    """
    try:
        # Get wallet info and transactions
        wallet = await blockchain_service.get_wallet_info(wallet_address)
        transactions = await blockchain_service.get_wallet_transactions(wallet_address)
        
        # Get wallet classification
        classification = await wallet_ai_service.classify_wallet(wallet, transactions)
        
        return {
            "wallet": wallet_address,
            "risk_score": classification.risk_score,
            "risk_level": classification.risk_level,
            "wallet_type": classification.wallet_type,
            "behavior": classification.behavior,
            "confidence": classification.confidence
        }
    except Exception as e:
        logger.error(f"Error calculating risk score: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/wallet-analysis/{wallet_address}")
async def get_wallet_analysis(wallet_address: str):
    """
    Get detailed wallet analysis including classification and behavior
    """
    try:
        # Get wallet info and transactions
        wallet = await blockchain_service.get_wallet_info(wallet_address)
        transactions = await blockchain_service.get_wallet_transactions(wallet_address)
        
        # Get wallet classification
        classification = await wallet_ai_service.classify_wallet(wallet, transactions)
        
        return classification.dict()
    except Exception as e:
        logger.error(f"Error analyzing wallet: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/train-models")
async def train_models(training_data: List[Dict[str, Any]]):
    """
    Train the wallet classification and behavior models
    """
    try:
        await wallet_ai_service.train(training_data)
        return {"status": "success", "message": "Models trained successfully"}
    except Exception as e:
        logger.error(f"Error training models: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 