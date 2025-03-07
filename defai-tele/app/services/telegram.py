from telegram import Bot
from telegram.constants import ParseMode
from typing import List, Optional
import logging
from app.config import settings
from app.models.alert import Alert, AlertSeverity
from app.models.transaction import Transaction
from app.models.wallet import Wallet

logger = logging.getLogger(__name__)

class TelegramService:
    def __init__(self):
        self.bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
        self.chat_ids: List[str] = []

    async def add_chat_id(self, chat_id: str) -> bool:
        """
        Add a chat ID to receive alerts
        """
        try:
            if chat_id not in self.chat_ids:
                self.chat_ids.append(chat_id)
                await self.bot.send_message(
                    chat_id=chat_id,
                    text="✅ You have been successfully subscribed to DeFi Smart Money Tracker alerts!"
                )
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding chat ID {chat_id}: {str(e)}")
            return False

    async def remove_chat_id(self, chat_id: str) -> bool:
        """
        Remove a chat ID from alert recipients
        """
        try:
            if chat_id in self.chat_ids:
                self.chat_ids.remove(chat_id)
                await self.bot.send_message(
                    chat_id=chat_id,
                    text="❌ You have been unsubscribed from DeFi Smart Money Tracker alerts."
                )
                return True
            return False
        except Exception as e:
            logger.error(f"Error removing chat ID {chat_id}: {str(e)}")
            return False

    async def send_alert(self, alert: Alert, transaction: Optional[Transaction] = None, wallet: Optional[Wallet] = None):
        """
        Send an alert to all subscribed chat IDs
        """
        try:
            message = self._format_alert_message(alert, transaction, wallet)
            
            for chat_id in self.chat_ids:
                try:
                    await self.bot.send_message(
                        chat_id=chat_id,
                        text=message,
                        parse_mode=ParseMode.HTML
                    )
                except Exception as e:
                    logger.error(f"Error sending alert to chat ID {chat_id}: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error sending alert: {str(e)}")

    def _format_alert_message(self, alert: Alert, transaction: Optional[Transaction] = None, wallet: Optional[Wallet] = None) -> str:
        """
        Format alert message with transaction and wallet details
        """
        severity_emoji = {
            AlertSeverity.LOW: "📝",
            AlertSeverity.MEDIUM: "⚠️",
            AlertSeverity.HIGH: "🚨",
            AlertSeverity.CRITICAL: "💥"
        }

        message = f"{severity_emoji.get(alert.severity, '📢')} <b>{alert.type.value.upper()} Alert</b>\n\n"
        message += f"<b>Severity:</b> {alert.severity.value.upper()}\n"
        message += f"<b>Description:</b> {alert.description}\n\n"

        if transaction:
            message += "<b>Transaction Details:</b>\n"
            message += f"Hash: <code>{transaction.hash[:10]}...</code>\n"
            message += f"From: <code>{transaction.from_address[:10]}...</code>\n"
            message += f"To: <code>{transaction.to_address[:10]}...</code>\n"
            message += f"Value: {transaction.value:.4f} ETH (${transaction.usd_value:,.2f})\n"
            message += f"Type: {transaction.transaction_type.value}\n"
            message += f"Risk Score: {transaction.risk_score:.2f}\n\n"

        if wallet:
            message += "<b>Wallet Details:</b>\n"
            message += f"Address: <code>{wallet.address[:10]}...</code>\n"
            message += f"Balance: {wallet.balance:.4f} ETH (${wallet.usd_value:,.2f})\n"
            message += f"Risk Score: {wallet.risk_score:.2f}\n"
            if wallet.tags:
                message += f"Tags: {', '.join(wallet.tags)}\n"

        return message

    async def send_error_notification(self, error_message: str):
        """
        Send error notification to all subscribed chat IDs
        """
        try:
            message = f"❌ <b>System Error</b>\n\n{error_message}"
            
            for chat_id in self.chat_ids:
                try:
                    await self.bot.send_message(
                        chat_id=chat_id,
                        text=message,
                        parse_mode=ParseMode.HTML
                    )
                except Exception as e:
                    logger.error(f"Error sending error notification to chat ID {chat_id}: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error sending error notification: {str(e)}") 