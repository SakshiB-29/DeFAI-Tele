from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    CommandHandler, MessageHandler, CallbackQueryHandler,
    ContextTypes, filters
)
from typing import Dict, List, Optional
import logging
from app.services.blockchain import BlockchainService
from app.services.wallet_ai import WalletAIService
from app.models.wallet_classification import WalletClassification
from app.models.alert import Alert, AlertType, AlertSeverity

logger = logging.getLogger(__name__)

class TelegramCommandHandler:
    def __init__(self, blockchain_service: BlockchainService, wallet_ai_service: WalletAIService):
        self.blockchain_service = blockchain_service
        self.wallet_ai_service = wallet_ai_service
        self.watched_wallets: Dict[str, List[str]] = {}  # chat_id -> [wallet_addresses]
        self.alert_preferences: Dict[str, Dict[str, bool]] = {}  # chat_id -> {alert_type: enabled}

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        welcome_message = (
            "👋 Welcome to DeFi Smart Money Tracker!\n\n"
            "Available commands:\n"
            "/watch <wallet_address> - Track a specific wallet\n"
            "/whales - Show latest whale transactions\n"
            "/alerts - Configure alert preferences\n"
            "/token <symbol> - Get token risk analysis\n"
            "/help - Show this help message"
        )
        await update.message.reply_text(welcome_message)

    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_message = (
            "📚 DeFi Smart Money Tracker Commands:\n\n"
            "/watch <wallet_address> - Start tracking a specific wallet\n"
            "/whales - View latest whale transactions\n"
            "/alerts - Configure your alert preferences\n"
            "/token <symbol> - Get AI-based risk analysis for a token\n"
            "/unwatch <wallet_address> - Stop tracking a wallet\n"
            "/status - View your current tracking status"
        )
        await update.message.reply_text(help_message)

    async def watch_wallet(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /watch command"""
        try:
            if not context.args:
                await update.message.reply_text("Please provide a wallet address: /watch <address>")
                return

            wallet_address = context.args[0]
            chat_id = str(update.effective_chat.id)

            # Validate wallet address
            if not self.blockchain_service.w3.is_address(wallet_address):
                await update.message.reply_text("❌ Invalid wallet address. Please provide a valid Ethereum address.")
                return

            # Add wallet to tracking list
            if chat_id not in self.watched_wallets:
                self.watched_wallets[chat_id] = []
            
            if wallet_address not in self.watched_wallets[chat_id]:
                self.watched_wallets[chat_id].append(wallet_address)
                
                # Get initial wallet analysis
                wallet = await self.blockchain_service.get_wallet_info(wallet_address)
                transactions = await self.blockchain_service.get_wallet_transactions(wallet_address)
                classification = await self.wallet_ai_service.classify_wallet(wallet, transactions)

                await update.message.reply_text(
                    f"✅ Now tracking wallet: {wallet_address}\n\n"
                    f"Initial Analysis:\n"
                    f"Type: {classification.wallet_type.value}\n"
                    f"Risk Level: {classification.risk_level.value}\n"
                    f"Behavior: {classification.behavior.value}\n"
                    f"Confidence: {classification.confidence:.2%}"
                )
            else:
                await update.message.reply_text("This wallet is already being tracked.")
        except Exception as e:
            logger.error(f"Error in watch_wallet: {str(e)}")
            await update.message.reply_text("❌ Error tracking wallet. Please try again later.")

    async def unwatch_wallet(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /unwatch command"""
        try:
            if not context.args:
                await update.message.reply_text("Please provide a wallet address: /unwatch <address>")
                return

            wallet_address = context.args[0]
            chat_id = str(update.effective_chat.id)

            if chat_id in self.watched_wallets and wallet_address in self.watched_wallets[chat_id]:
                self.watched_wallets[chat_id].remove(wallet_address)
                await update.message.reply_text(f"✅ Stopped tracking wallet: {wallet_address}")
            else:
                await update.message.reply_text("This wallet is not being tracked.")
        except Exception as e:
            logger.error(f"Error in unwatch_wallet: {str(e)}")
            await update.message.reply_text("❌ Error removing wallet. Please try again later.")

    async def show_whales(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /whales command"""
        try:
            # TODO: Implement whale transaction fetching
            await update.message.reply_text(
                "🐋 Latest Whale Transactions:\n\n"
                "Coming soon! This feature will show recent large transactions "
                "and whale movements in real-time."
            )
        except Exception as e:
            logger.error(f"Error in show_whales: {str(e)}")
            await update.message.reply_text("❌ Error fetching whale transactions. Please try again later.")

    async def configure_alerts(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /alerts command"""
        try:
            chat_id = str(update.effective_chat.id)
            
            # Initialize alert preferences if not exists
            if chat_id not in self.alert_preferences:
                self.alert_preferences[chat_id] = {
                    alert_type.value: True for alert_type in AlertType
                }

            # Create inline keyboard for alert preferences
            keyboard = []
            for alert_type in AlertType:
                is_enabled = self.alert_preferences[chat_id].get(alert_type.value, True)
                keyboard.append([
                    InlineKeyboardButton(
                        f"{'✅' if is_enabled else '❌'} {alert_type.value.replace('_', ' ').title()}",
                        callback_data=f"toggle_alert_{alert_type.value}"
                    )
                ])
            keyboard.append([InlineKeyboardButton("Save Preferences", callback_data="save_alerts")])
            
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "🔔 Configure Alert Preferences:\n\n"
                "Toggle the alerts you want to receive:",
                reply_markup=reply_markup
            )
        except Exception as e:
            logger.error(f"Error in configure_alerts: {str(e)}")
            await update.message.reply_text("❌ Error configuring alerts. Please try again later.")

    async def handle_alert_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle alert preference callback queries"""
        try:
            query = update.callback_query
            chat_id = str(query.message.chat_id)
            
            if query.data == "save_alerts":
                await query.message.edit_text("✅ Alert preferences saved!")
                return

            if query.data.startswith("toggle_alert_"):
                alert_type = query.data.replace("toggle_alert_", "")
                self.alert_preferences[chat_id][alert_type] = not self.alert_preferences[chat_id].get(alert_type, True)
                
                # Update keyboard
                keyboard = []
                for alert_type_enum in AlertType:
                    is_enabled = self.alert_preferences[chat_id].get(alert_type_enum.value, True)
                    keyboard.append([
                        InlineKeyboardButton(
                            f"{'✅' if is_enabled else '❌'} {alert_type_enum.value.replace('_', ' ').title()}",
                            callback_data=f"toggle_alert_{alert_type_enum.value}"
                        )
                    ])
                keyboard.append([InlineKeyboardButton("Save Preferences", callback_data="save_alerts")])
                
                reply_markup = InlineKeyboardMarkup(keyboard)
                await query.message.edit_reply_markup(reply_markup=reply_markup)
        except Exception as e:
            logger.error(f"Error in handle_alert_callback: {str(e)}")
            await query.message.edit_text("❌ Error updating preferences. Please try again.")

    async def analyze_token(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /token command"""
        try:
            if not context.args:
                await update.message.reply_text("Please provide a token symbol: /token <symbol>")
                return

            token_symbol = context.args[0].upper()
            # TODO: Implement token analysis
            await update.message.reply_text(
                f"🔍 Token Analysis for {token_symbol}:\n\n"
                "Coming soon! This feature will provide AI-based risk analysis "
                "and market insights for the specified token."
            )
        except Exception as e:
            logger.error(f"Error in analyze_token: {str(e)}")
            await update.message.reply_text("❌ Error analyzing token. Please try again later.")

    async def show_status(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /status command"""
        try:
            chat_id = str(update.effective_chat.id)
            
            # Get watched wallets
            watched_wallets = self.watched_wallets.get(chat_id, [])
            
            # Get alert preferences
            alert_prefs = self.alert_preferences.get(chat_id, {})
            enabled_alerts = [alert_type for alert_type, enabled in alert_prefs.items() if enabled]
            
            status_message = "📊 Your Tracking Status:\n\n"
            
            if watched_wallets:
                status_message += "👀 Watched Wallets:\n"
                for wallet in watched_wallets:
                    status_message += f"• {wallet}\n"
            else:
                status_message += "No wallets being tracked. Use /watch <address> to start tracking.\n"
            
            status_message += "\n🔔 Alert Preferences:\n"
            if enabled_alerts:
                for alert in enabled_alerts:
                    status_message += f"• {alert.replace('_', ' ').title()}\n"
            else:
                status_message += "No alerts enabled. Use /alerts to configure preferences.\n"
            
            await update.message.reply_text(status_message)
        except Exception as e:
            logger.error(f"Error in show_status: {str(e)}")
            await update.message.reply_text("❌ Error fetching status. Please try again later.")

    def get_command_handlers(self) -> List[CommandHandler]:
        """Get all command handlers"""
        return [
            CommandHandler("start", self.start),
            CommandHandler("help", self.help),
            CommandHandler("watch", self.watch_wallet),
            CommandHandler("unwatch", self.unwatch_wallet),
            CommandHandler("whales", self.show_whales),
            CommandHandler("alerts", self.configure_alerts),
            CommandHandler("token", self.analyze_token),
            CommandHandler("status", self.show_status),
        ]

    def get_callback_handlers(self) -> List[CallbackQueryHandler]:
        """Get all callback query handlers"""
        return [
            CallbackQueryHandler(self.handle_alert_callback, pattern="^(toggle_alert_|save_alerts)")
        ] 