"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { useState, useEffect } from "react"
import { getCryptoHistoricalData, getCryptoMarketData, TimeInterval, PriceDataPoint, MarketData } from "@/lib/api"
import { Loader2 } from "lucide-react"

const timeRanges = [
  { value: "1D", label: "1D", apiValue: "1d" as TimeInterval },
  { value: "1W", label: "1W", apiValue: "7d" as TimeInterval },
  { value: "1M", label: "1M", apiValue: "30d" as TimeInterval },
  { value: "3M", label: "3M", apiValue: "90d" as TimeInterval },
  { value: "1Y", label: "1Y", apiValue: "365d" as TimeInterval },
  { value: "ALL", label: "ALL", apiValue: "max" as TimeInterval },
]

export function TokenPriceChart() {
  const [timeRange, setTimeRange] = useState("1D");
  const [chartData, setChartData] = useState<PriceDataPoint[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Get the API value for the selected time range
  const getApiTimeInterval = (): TimeInterval => {
    const range = timeRanges.find(r => r.value === timeRange);
    return range ? range.apiValue : "30d";
  };
  
  // Fetch historical data when time range changes or on retry
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch historical price data
        const data = await getCryptoHistoricalData("ethereum", getApiTimeInterval());
        
        if (data.length === 0) {
          throw new Error("No price data available");
        }
        
        setChartData(data);
        
        // Only fetch market data if we don't already have it or it's stale
        if (!marketData) {
          const marketInfo = await getCryptoMarketData("ethereum");
          setMarketData(marketInfo);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        // Still set the data if we got fallback data
        const data = await getCryptoHistoricalData("ethereum", getApiTimeInterval());
        if (data.length > 0) {
          setChartData(data);
          const marketInfo = await getCryptoMarketData("ethereum");
          setMarketData(marketInfo);
        } else {
          setError("Failed to fetch price data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistoricalData();
    
    // Refresh market data every 60 seconds
    const marketDataInterval = setInterval(async () => {
      try {
        const marketInfo = await getCryptoMarketData("ethereum");
        setMarketData(marketInfo);
      } catch (err) {
        console.error("Error refreshing market data:", err);
      }
    }, 60000);
    
    return () => clearInterval(marketDataInterval);
  }, [timeRange, retryCount]);
  
  // Function to retry data loading
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // Show loading state
  if (isLoading && chartData.length === 0) {
    return (
      <Card className="col-span-3">
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading price data...</p>
          </div>
        </div>
      </Card>
    );
  }
  
  // Show error state
  if (error && chartData.length === 0) {
    return (
      <Card className="col-span-3">
        <div className="h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={handleRetry} 
              className="text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }
  
  // Handle empty data
  if (chartData.length === 0) {
    return (
      <Card className="col-span-3">
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No price data available</p>
        </div>
      </Card>
    );
  }
  
  // Calculate price change for the selected time period
  const startPrice = chartData[0]?.price || 0;
  const currentPrice = marketData?.price || chartData[chartData.length - 1]?.price || 0;
  const priceChange = currentPrice - startPrice;
  const percentChange = startPrice > 0 ? (priceChange / startPrice) * 100 : 0;
  const isPositive = priceChange >= 0;
  
  // Find min and max prices for reference lines
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
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
  
  // Format date based on selected time range
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    if (timeRange === "1D") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === "1W" || timeRange === "1M") {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Ethereum (ETH)</CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-2xl font-bold">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(percentChange).toFixed(2)}%
              <span className="text-xs text-muted-foreground">({timeRange})</span>
            </span>
          </CardDescription>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            {timeRanges.map((range) => (
              <TabsTrigger key={range.value} value={range.value}>
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">24h Change</p>
            <p className={`text-sm font-medium ${(marketData?.priceChange24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {(marketData?.priceChange24h || 0) >= 0 ? "+" : ""}{marketData?.priceChange24h.toFixed(2)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">24h High</p>
            <p className="text-sm font-medium">${marketData?.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">24h Low</p>
            <p className="text-sm font-medium">${marketData?.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm font-medium">{formatCurrency(marketData?.volume || 0)}</p>
          </div>
        </div>
        <div className="h-[300px] mt-2 relative">
          {isLoading && chartData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <Tooltip 
                content={<CustomTooltip timeRange={timeRange} />} 
                cursor={{ stroke: '#6b7280', strokeDasharray: '3 3' }}
              />
              <ReferenceLine y={minPrice} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: `Min: $${minPrice.toLocaleString()}`, position: 'insideBottomLeft', fill: '#9ca3af', fontSize: 10 }} />
              <ReferenceLine y={maxPrice} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: `Max: $${maxPrice.toLocaleString()}`, position: 'insideTopLeft', fill: '#9ca3af', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
                activeDot={{ r: 6, stroke: isPositive ? "#10b981" : "#ef4444", strokeWidth: 2, fill: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-right text-muted-foreground">
          <p>Data updates automatically every minute</p>
          <p className="text-primary cursor-pointer hover:underline" onClick={() => setTimeRange(timeRange)}>
            Refresh Now
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  timeRange: string;
}

function CustomTooltip({ active, payload, label, timeRange }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const date = new Date(data.timestamp);
  
  let formattedDate;
  if (timeRange === "1D") {
    formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeRange === "1W" || timeRange === "1M") {
    formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    formattedDate = date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  return (
    <div className="bg-background p-3 border rounded-md shadow-md">
      <div className="font-medium text-md mb-1">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div className="text-xs text-muted-foreground">{formattedDate}</div>
    </div>
  );
}

