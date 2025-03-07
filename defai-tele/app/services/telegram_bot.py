from telegram.ext import Application, ApplicationBuilder
from typing import List, Optional
import logging
from app.config import settings
from app.services.telegram_commands import TelegramCommandHandler
from app.services.blockchain import BlockchainService
from app.services.wallet_ai import WalletAIService
from app.models.alert import Alert
from app.models.transaction import Transaction
from app.models.wallet import Wallet

logger = logging.getLogger(__name__)

class TelegramBotService:
    def __init__(self):
        self.application: Optional[Application] = None
        self.blockchain_service = BlockchainService()
        self.wallet_ai_service = WalletAIService()
        self.command_handler = TelegramCommandHandler(
            self.blockchain_service,
            self.wallet_ai_service
        )

    async def start(self):
        """Start the Telegram bot"""
        try:
            # Build application
            self.application = ApplicationBuilder().token(settings.TELEGRAM_BOT_TOKEN).build()

            # Add command handlers
            for handler in self.command_handler.get_command_handlers():
                self.application.add_handler(handler)

            # Add callback query handlers
            for handler in self.command_handler.get_callback_handlers():
                self.application.add_handler(handler)

            # Start the bot
            await self.application.initialize()
            await self.application.start()
            await self.application.run_polling()
        except Exception as e:
            logger.error(f"Error starting Telegram bot: {str(e)}")
            raise

    async def stop(self):
        """Stop the Telegram bot"""
        try:
            if self.application:
                await self.application.stop()
                await self.application.shutdown()
        except Exception as e:
            logger.error(f"Error stopping Telegram bot: {str(e)}")
            raise

    async def send_alert(self, alert: Alert, transaction: Optional[Transaction] = None, 
                        wallet: Optional[Wallet] = None):
        """Send an alert to all subscribed users"""
        try:
            if not self.application:
                logger.error("Telegram bot not initialized")
                return

            # Format alert message
            message = self._format_alert_message(alert, transaction, wallet)

            # Send to all users with matching alert preferences
            for chat_id, preferences in self.command_handler.alert_preferences.items():
                if preferences.get(alert.type.value, True):
                    try:
                        await self.application.bot.send_message(
                            chat_id=chat_id,
                            text=message,
                            parse_mode='HTML'
                        )
                    except Exception as e:
                        logger.error(f"Error sending alert to chat {chat_id}: {str(e)}")
                        continue
        except Exception as e:
            logger.error(f"Error sending alert: {str(e)}")

    def _format_alert_message(self, alert: Alert, transaction: Optional[Transaction] = None, 
                            wallet: Optional[Wallet] = None) -> str:
        """Format alert message with transaction and wallet details"""
        try:
            # Get severity emoji
            severity_emoji = {
                "LOW": "📝",
                "MEDIUM": "⚠️",
                "HIGH": "🚨",
                "CRITICAL": "💥"
            }

            # Build message
            message = f"{severity_emoji.get(alert.severity.value, '📢')} "
            message += f"<b>{alert.type.value.replace('_', ' ').title()} Alert</b>\n\n"
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
        except Exception as e:
            logger.error(f"Error formatting alert message: {str(e)}")
            return "Error formatting alert message"

    async def send_error_notification(self, error_message: str):
        """Send error notification to all users"""
        try:
            if not self.application:
                logger.error("Telegram bot not initialized")
                return

            message = f"❌ <b>System Error</b>\n\n{error_message}"

            # Send to all users
            for chat_id in self.command_handler.alert_preferences.keys():
                try:
                    await self.application.bot.send_message(
                        chat_id=chat_id,
                        text=message,
                        parse_mode='HTML'
                    )
                except Exception as e:
                    logger.error(f"Error sending error notification to chat {chat_id}: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error sending error notification: {str(e)}")

    async def broadcast_message(self, message: str):
        """Broadcast a message to all users"""
        try:
            if not self.application:
                logger.error("Telegram bot not initialized")
                return

            # Send to all users
            for chat_id in self.command_handler.alert_preferences.keys():
                try:
                    await self.application.bot.send_message(
                        chat_id=chat_id,
                        text=message,
                        parse_mode='HTML'
                    )
                except Exception as e:
                    logger.error(f"Error broadcasting message to chat {chat_id}: {str(e)}")
                    continue
        except Exception as e:
            logger.error(f"Error broadcasting message: {str(e)}") 