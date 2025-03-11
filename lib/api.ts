// API service for fetching cryptocurrency data from CoinGecko

// Base URL for CoinGecko API
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Supported time intervals
export type TimeInterval = '1d' | '7d' | '30d' | '90d' | '365d' | 'max';

// Interface for the price data point
export interface PriceDataPoint {
  timestamp: number;
  date: string;
  price: number;
}

// Interface for market data
export interface MarketData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
  high24h: number;
  low24h: number;
}

// Fallback data for Ethereum
const FALLBACK_ETH_PRICE = 2691.66;
const FALLBACK_ETH_PRICE_CHANGE = 8.60;

// Fallback market data for Ethereum
const FALLBACK_ETH_MARKET_DATA: MarketData = {
  price: FALLBACK_ETH_PRICE,
  priceChange24h: FALLBACK_ETH_PRICE_CHANGE,
  marketCap: 323000000000,
  volume: 15700000000,
  high24h: FALLBACK_ETH_PRICE * 1.02,
  low24h: FALLBACK_ETH_PRICE * 0.97,
};

// Fallback top cryptocurrencies data
const FALLBACK_TOP_CRYPTOS = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 41234.56,
    priceChange24h: 3.2,
    marketCap: 807000000000,
    volume: 28900000000,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: FALLBACK_ETH_PRICE,
    priceChange24h: FALLBACK_ETH_PRICE_CHANGE,
    marketCap: 323000000000,
    volume: 15700000000,
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    price: 1.0,
    priceChange24h: 0.01,
    marketCap: 95800000000,
    volume: 67500000000,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    price: 312.45,
    priceChange24h: -1.23,
    marketCap: 48300000000,
    volume: 2100000000,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    price: 98.76,
    priceChange24h: 5.67,
    marketCap: 41200000000,
    volume: 3500000000,
  }
];

// Generate historical data points based on current price
function generateHistoricalData(
  interval: TimeInterval,
  currentPrice: number,
  priceChange: number
): PriceDataPoint[] {
  let days = 30;
  
  switch (interval) {
    case '1d': days = 1; break;
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '365d': days = 365; break;
    case 'max': days = 730; break;
  }
  
  const result: PriceDataPoint[] = [];
  const startPrice = currentPrice / (1 + (priceChange / 100));
  let price = startPrice;
  
  for (let i = 0; i < days; i++) {
    // Create randomized price movement with trend
    let timestamp = Date.now() - (days - i) * 24 * 60 * 60 * 1000;
    
    if (i === days - 1) {
      // Last point is current price
      price = currentPrice;
    } else {
      // Create randomized but trending price movement
      const progress = i / (days - 1);
      const change = ((Math.random() - 0.4) * 50) * (1 - progress) + (priceChange / 100) * progress * 20;
      price += change;
      price = Math.max(price, startPrice * 0.7);
    }
    
    result.push({
      timestamp,
      date: new Date(timestamp).toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  
  // Add hourly data points for 1d view
  if (interval === '1d') {
    result.length = 0;
    const hoursInDay = 24;
    for (let i = 0; i < hoursInDay; i++) {
      const timestamp = Date.now() - (hoursInDay - i) * 60 * 60 * 1000;
      const progress = i / (hoursInDay - 1);
      
      if (i === hoursInDay - 1) {
        price = currentPrice;
      } else {
        const change = ((Math.random() - 0.45) * 20) * (1 - progress) + (priceChange / 100) * progress * 5;
        price += change;
      }
      
      result.push({
        timestamp,
        date: new Date(timestamp).toISOString(),
        price: parseFloat(price.toFixed(2))
      });
    }
  }
  
  return result;
}

// Get current price for a cryptocurrency
export async function getCryptoPrice(coinId: string): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch current price data');
    }
    
    const data = await response.json();
    return data[coinId]?.usd || 0;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    // Return fallback price for ethereum
    if (coinId === 'ethereum') {
      return FALLBACK_ETH_PRICE;
    }
    return 0;
  }
}

// Get market data for a cryptocurrency (price, volume, market cap)
export async function getCryptoMarketData(coinId: string): Promise<MarketData> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    const data = await response.json();
    return {
      price: data.market_data?.current_price?.usd || 0,
      priceChange24h: data.market_data?.price_change_percentage_24h || 0,
      marketCap: data.market_data?.market_cap?.usd || 0,
      volume: data.market_data?.total_volume?.usd || 0,
      high24h: data.market_data?.high_24h?.usd || 0,
      low24h: data.market_data?.low_24h?.usd || 0,
    };
  } catch (error) {
    console.error('Error fetching crypto market data:', error);
    // Return fallback data for ethereum
    if (coinId === 'ethereum') {
      return FALLBACK_ETH_MARKET_DATA;
    }
    return {
      price: 0,
      priceChange24h: 0,
      marketCap: 0,
      volume: 0,
      high24h: 0,
      low24h: 0,
    };
  }
}

// Get historical price data for a cryptocurrency
export async function getCryptoHistoricalData(
  coinId: string,
  interval: TimeInterval
): Promise<PriceDataPoint[]> {
  try {
    // Convert interval to days
    let days = '30';
    
    switch (interval) {
      case '1d':
        days = '1';
        break;
      case '7d':
        days = '7';
        break;
      case '30d':
        days = '30';
        break;
      case '90d':
        days = '90';
        break;
      case '365d':
        days = '365';
        break;
      case 'max':
        days = 'max';
        break;
    }
    
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }
    
    const data = await response.json();
    
    // Process the data to the format we need
    return data.prices.map((item: [number, number]) => {
      const [timestamp, price] = item;
      const date = new Date(timestamp);
      
      return {
        timestamp,
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2))
      };
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    // Return simulated data for ethereum
    if (coinId === 'ethereum') {
      return generateHistoricalData(interval, FALLBACK_ETH_PRICE, FALLBACK_ETH_PRICE_CHANGE);
    }
    return [];
  }
}

// Get top cryptocurrencies by market cap
export async function getTopCryptocurrencies(limit: number = 10): Promise<any[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch top cryptocurrencies');
    }
    
    const data = await response.json();
    
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      priceChange24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
    }));
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    // Return fallback data
    return FALLBACK_TOP_CRYPTOS.slice(0, limit);
  }
} 