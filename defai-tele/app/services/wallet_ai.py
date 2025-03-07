import tensorflow as tf
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import logging
from datetime import datetime, timedelta
from app.models.wallet import Wallet
from app.models.transaction import Transaction
from app.models.wallet_classification import (
    WalletClassification, WalletType, WalletBehavior, RiskLevel
)

logger = logging.getLogger(__name__)

class WalletAIService:
    def __init__(self):
        self.classification_model = self._build_classification_model()
        self.behavior_model = self._build_behavior_model()
        self.feature_columns = [
            'transaction_volume',
            'contract_interaction_frequency',
            'token_diversity',
            'network_centrality',
            'avg_transaction_value',
            'transaction_frequency',
            'time_since_last_tx',
            'whale_interaction_ratio',
            'risky_contract_interaction_ratio'
        ]

    def _build_classification_model(self) -> tf.keras.Model:
        """
        Build a neural network model for wallet classification
        """
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_shape=(len(self.feature_columns),)),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(len(WalletType), activation='softmax')
        ])

        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        return model

    def _build_behavior_model(self) -> tf.keras.Model:
        """
        Build a neural network model for behavior prediction
        """
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(len(self.feature_columns),)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(len(WalletBehavior), activation='softmax')
        ])

        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        return model

    def _extract_features(self, wallet: Wallet, transactions: List[Transaction]) -> np.ndarray:
        """
        Extract features from wallet and transaction data
        """
        try:
            features = np.zeros(len(self.feature_columns))

            # Transaction volume (normalized)
            total_volume = sum(tx.usd_value for tx in transactions)
            features[0] = min(total_volume / 10000000, 1.0)  # Normalize to $10M

            # Contract interaction frequency
            contract_txs = [tx for tx in transactions if tx.transaction_type == "CONTRACT_INTERACTION"]
            features[1] = len(contract_txs) / max(len(transactions), 1)

            # Token diversity (placeholder)
            features[2] = 0.5  # This should be calculated based on token holdings

            # Network centrality (placeholder)
            features[3] = 0.5  # This should be calculated based on network analysis

            # Average transaction value
            if transactions:
                avg_value = sum(tx.usd_value for tx in transactions) / len(transactions)
                features[4] = min(avg_value / 100000, 1.0)  # Normalize to $100K

            # Transaction frequency
            if transactions:
                time_span = (max(tx.timestamp for tx in transactions) - 
                           min(tx.timestamp for tx in transactions)).total_seconds()
                if time_span > 0:
                    features[5] = min(len(transactions) / (time_span / 86400), 1.0)  # Normalize to daily rate

            # Time since last transaction
            if transactions:
                last_tx_time = max(tx.timestamp for tx in transactions)
                time_diff = (datetime.utcnow() - last_tx_time).total_seconds()
                features[6] = min(time_diff / 86400, 1.0)  # Normalize to 24 hours

            # Whale interaction ratio (placeholder)
            features[7] = 0.5  # This should be calculated based on known whale addresses

            # Risky contract interaction ratio (placeholder)
            features[8] = 0.5  # This should be calculated based on known risky contracts

            return features
        except Exception as e:
            logger.error(f"Error extracting features: {str(e)}")
            return np.zeros(len(self.feature_columns))

    async def classify_wallet(self, wallet: Wallet, transactions: List[Transaction]) -> WalletClassification:
        """
        Classify a wallet based on its behavior and characteristics
        """
        try:
            features = self._extract_features(wallet, transactions)
            features = features.reshape(1, -1)

            # Get wallet type classification
            type_prediction = self.classification_model.predict(features)[0]
            wallet_type_idx = np.argmax(type_prediction)
            wallet_type = list(WalletType)[wallet_type_idx]
            type_confidence = float(type_prediction[wallet_type_idx])

            # Get behavior prediction
            behavior_prediction = self.behavior_model.predict(features)[0]
            behavior_idx = np.argmax(behavior_prediction)
            behavior = list(WalletBehavior)[behavior_idx]
            behavior_confidence = float(behavior_prediction[behavior_idx])

            # Calculate risk level
            risk_score = self._calculate_risk_score(features[0], wallet_type, behavior)
            risk_level = self._determine_risk_level(risk_score)

            # Calculate overall confidence
            confidence = (type_confidence + behavior_confidence) / 2

            return WalletClassification(
                address=wallet.address,
                wallet_type=wallet_type,
                behavior=behavior,
                risk_level=risk_level,
                risk_score=risk_score,
                confidence=confidence,
                features=dict(zip(self.feature_columns, features[0])),
                metadata={
                    "total_transactions": len(transactions),
                    "first_seen": min(tx.timestamp for tx in transactions) if transactions else None,
                    "last_seen": max(tx.timestamp for tx in transactions) if transactions else None
                }
            )
        except Exception as e:
            logger.error(f"Error classifying wallet: {str(e)}")
            return WalletClassification(
                address=wallet.address,
                wallet_type=WalletType.UNKNOWN,
                behavior=WalletBehavior.UNKNOWN,
                risk_level=RiskLevel.UNKNOWN,
                risk_score=0.5,
                confidence=0.0
            )

    def _calculate_risk_score(self, features: np.ndarray, wallet_type: WalletType, 
                            behavior: WalletBehavior) -> float:
        """
        Calculate risk score based on features, wallet type, and behavior
        """
        try:
            risk_score = 0.0

            # Base risk based on wallet type
            type_risk = {
                WalletType.WHALE: 0.3,
                WalletType.MARKET_MAKER: 0.2,
                WalletType.RETAIL_TRADER: 0.1,
                WalletType.RISKY_WALLET: 0.8,
                WalletType.UNKNOWN: 0.5
            }
            risk_score += type_risk[wallet_type]

            # Behavior-based risk
            behavior_risk = {
                WalletBehavior.ACCUMULATING: 0.1,
                WalletBehavior.DUMPING: 0.3,
                WalletBehavior.WASH_TRADING: 0.7,
                WalletBehavior.STABLE: 0.1,
                WalletBehavior.UNKNOWN: 0.5
            }
            risk_score += behavior_risk[behavior]

            # Feature-based risk
            risk_score += features[7] * 0.2  # Whale interaction risk
            risk_score += features[8] * 0.3  # Risky contract interaction risk
            risk_score += features[1] * 0.2  # Contract interaction frequency risk

            return min(risk_score, 1.0)
        except Exception as e:
            logger.error(f"Error calculating risk score: {str(e)}")
            return 0.5

    def _determine_risk_level(self, risk_score: float) -> RiskLevel:
        """
        Determine risk level based on risk score
        """
        if risk_score >= 0.7:
            return RiskLevel.HIGH
        elif risk_score >= 0.4:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW

    async def train(self, training_data: List[Dict[str, Any]]):
        """
        Train both classification and behavior models
        """
        try:
            X = []
            y_type = []
            y_behavior = []

            for data in training_data:
                features = self._extract_features(data['wallet'], data['transactions'])
                X.append(features)
                y_type.append(data['wallet_type'])
                y_behavior.append(data['behavior'])

            X = np.array(X)
            y_type = np.array(y_type)
            y_behavior = np.array(y_behavior)

            # Split data
            split_idx = int(len(X) * 0.8)
            X_train, X_val = X[:split_idx], X[split_idx:]
            y_type_train, y_type_val = y_type[:split_idx], y_type[split_idx:]
            y_behavior_train, y_behavior_val = y_behavior[:split_idx], y_behavior[split_idx:]

            # Train classification model
            self.classification_model.fit(
                X_train, y_type_train,
                validation_data=(X_val, y_type_val),
                epochs=10,
                batch_size=32,
                verbose=1
            )

            # Train behavior model
            self.behavior_model.fit(
                X_train, y_behavior_train,
                validation_data=(X_val, y_behavior_val),
                epochs=10,
                batch_size=32,
                verbose=1
            )

            logger.info("Models training completed successfully")
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            raise

    def save_models(self, path: str):
        """
        Save trained models
        """
        try:
            self.classification_model.save(f"{path}/classification_model")
            self.behavior_model.save(f"{path}/behavior_model")
            logger.info(f"Models saved to {path}")
        except Exception as e:
            logger.error(f"Error saving models: {str(e)}")
            raise

    def load_models(self, path: str):
        """
        Load trained models
        """
        try:
            self.classification_model = tf.keras.models.load_model(f"{path}/classification_model")
            self.behavior_model = tf.keras.models.load_model(f"{path}/behavior_model")
            logger.info(f"Models loaded from {path}")
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise 