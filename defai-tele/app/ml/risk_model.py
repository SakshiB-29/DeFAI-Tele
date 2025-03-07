import tensorflow as tf
import numpy as np
from typing import List, Dict, Any, Tuple
import logging
from datetime import datetime, timedelta
from app.models.transaction import Transaction
from app.models.wallet import Wallet

logger = logging.getLogger(__name__)

class RiskAssessmentModel:
    def __init__(self):
        self.model = self._build_model()
        self.feature_columns = [
            'transaction_value',
            'gas_price',
            'contract_interaction',
            'transaction_frequency',
            'wallet_balance',
            'time_since_last_tx',
            'network_centrality'
        ]

    def _build_model(self) -> tf.keras.Model:
        """
        Build a simple neural network model for risk assessment
        """
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(len(self.feature_columns),)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])

        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )

        return model

    def _extract_features(self, transaction: Transaction, wallet: Wallet, 
                         recent_transactions: List[Transaction]) -> np.ndarray:
        """
        Extract features from transaction and wallet data
        """
        try:
            features = np.zeros(len(self.feature_columns))

            # Transaction value (normalized)
            features[0] = min(transaction.usd_value / 1000000, 1.0)  # Normalize to $1M

            # Gas price (normalized)
            features[1] = min(transaction.gas_price / 100, 1.0)  # Normalize to 100 Gwei

            # Contract interaction
            features[2] = 1.0 if transaction.transaction_type == "CONTRACT_INTERACTION" else 0.0

            # Transaction frequency (normalized)
            if recent_transactions:
                features[3] = min(len(recent_transactions) / 1000, 1.0)  # Normalize to 1000 txs

            # Wallet balance (normalized)
            features[4] = min(wallet.usd_value / 1000000, 1.0)  # Normalize to $1M

            # Time since last transaction (normalized)
            if recent_transactions:
                last_tx_time = max(tx.timestamp for tx in recent_transactions)
                time_diff = (datetime.utcnow() - last_tx_time).total_seconds()
                features[5] = min(time_diff / 86400, 1.0)  # Normalize to 24 hours

            # Network centrality (placeholder)
            features[6] = 0.5  # This should be calculated based on network analysis

            return features
        except Exception as e:
            logger.error(f"Error extracting features: {str(e)}")
            return np.zeros(len(self.feature_columns))

    async def predict_risk(self, transaction: Transaction, wallet: Wallet, 
                          recent_transactions: List[Transaction]) -> float:
        """
        Predict risk score for a transaction
        """
        try:
            features = self._extract_features(transaction, wallet, recent_transactions)
            features = features.reshape(1, -1)
            
            # Get model prediction
            risk_score = float(self.model.predict(features)[0][0])
            
            # Apply additional risk factors
            if transaction.usd_value > 1000000:  # $1M threshold
                risk_score = min(risk_score * 1.2, 1.0)
            
            if transaction.transaction_type == "CONTRACT_INTERACTION":
                risk_score = min(risk_score * 1.1, 1.0)
            
            return risk_score
        except Exception as e:
            logger.error(f"Error predicting risk: {str(e)}")
            return 0.5  # Return medium risk on error

    async def train(self, training_data: List[Dict[str, Any]]):
        """
        Train the model on historical data
        """
        try:
            X = []
            y = []
            
            for data in training_data:
                features = self._extract_features(
                    data['transaction'],
                    data['wallet'],
                    data['recent_transactions']
                )
                X.append(features)
                y.append(data['risk_score'])
            
            X = np.array(X)
            y = np.array(y)
            
            # Split data into train and validation sets
            split_idx = int(len(X) * 0.8)
            X_train, X_val = X[:split_idx], X[split_idx:]
            y_train, y_val = y[:split_idx], y[split_idx:]
            
            # Train the model
            self.model.fit(
                X_train, y_train,
                validation_data=(X_val, y_val),
                epochs=10,
                batch_size=32,
                verbose=1
            )
            
            logger.info("Model training completed successfully")
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise

    def save_model(self, path: str):
        """
        Save the trained model
        """
        try:
            self.model.save(path)
            logger.info(f"Model saved to {path}")
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            raise

    def load_model(self, path: str):
        """
        Load a trained model
        """
        try:
            self.model = tf.keras.models.load_model(path)
            logger.info(f"Model loaded from {path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise 