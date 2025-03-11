"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getTopCryptocurrencies } from "@/lib/api"

interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTopCryptocurrencies(5);
        
        if (data.length === 0) {
          throw new Error("No market data available");
        }
        
        setMarketData(data);
      } catch (err) {
        console.error("Error fetching market data:", err);
        // Check if we have fallback data
        const data = await getTopCryptocurrencies(5);
        if (data.length > 0) {
          setMarketData(data);
        } else {
          setError("Failed to fetch market data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
    
    // Refresh market data every 2 minutes
    const refreshInterval = setInterval(async () => {
      try {
        const data = await getTopCryptocurrencies(5);
        if (data.length > 0) {
          setMarketData(data);
        }
      } catch (err) {
        console.error("Error refreshing market data:", err);
      }
    }, 120000);
    
    return () => clearInterval(refreshInterval);
  }, [retryCount]);
  
  // Function to retry data loading
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // Format large numbers
  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };
  
  // Show loading state
  if (isLoading && marketData.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Top cryptocurrencies by market cap</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (error && marketData.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Top cryptocurrencies by market cap</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={handleRetry} 
              className="text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Top cryptocurrencies by market cap</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-2 px-1">
          <div>Asset</div>
          <div className="text-right">Price</div>
          <div className="text-right">24h Change</div>
          <div className="text-right hidden md:block">Market Cap</div>
          <div className="text-right hidden md:block">Volume (24h)</div>
        </div>
        <div className="space-y-2">
          {marketData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.symbol}</div>
                </div>
              </div>
              <div className="text-right font-medium">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-right">
                <Badge variant={item.priceChange24h >= 0 ? "outline" : "destructive"} className="gap-1">
                  {item.priceChange24h >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(item.priceChange24h).toFixed(2)}%
                </Badge>
              </div>
              <div className="text-right hidden md:block">{formatCurrency(item.marketCap)}</div>
              <div className="text-right hidden md:block">{formatCurrency(item.volume)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-right text-muted-foreground">
          <p>Data refreshes automatically every 2 minutes</p>
          <p className="text-primary cursor-pointer hover:underline" onClick={handleRetry}>
            Refresh Now
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

