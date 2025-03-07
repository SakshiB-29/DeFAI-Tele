# DeFi Smart Money Tracker

An AI-powered DeFi wallet tracking system that monitors whale movements, institutional trades, and risk transactions, providing real-time alerts via Telegram.

## Features

- Real-time monitoring of whale wallet movements
- Institutional trading pattern detection
- Risk transaction analysis
- AI-powered transaction analysis using OpenServ AI
- Real-time Telegram alerts
- Historical data analysis and trend prediction
- Risk assessment scoring

## Tech Stack

- Python 3.9+
- Web3.py for blockchain interaction
- FastAPI for API endpoints
- MongoDB for data storage
- TensorFlow for ML models
- Telegram Bot API for notifications
- Alchemy/Infura for blockchain node access

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with the following variables:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ALCHEMY_API_KEY=your_alchemy_api_key
   MONGODB_URI=your_mongodb_uri
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

## Project Structure

```
defai-tele/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── ml/                  # Machine learning models
├── tests/                   # Test files
├── requirements.txt         # Python dependencies
└── README.md               # Project documentation
```

## API Endpoints

- `GET /api/v1/whales`: Get list of tracked whale wallets
- `GET /api/v1/transactions`: Get recent transactions
- `POST /api/v1/alert`: Configure alert settings
- `GET /api/v1/risk-score`: Get risk assessment for a wallet

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 