"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState, useEffect } from "react"
import { getTopCryptocurrencies } from "@/lib/api"
import { Loader2 } from "lucide-react"

// Interface for portfolio item
interface PortfolioItem {
  name: string;
  symbol: string;
  value: number;
  allocation: number;
  color: string;
}

// Colors for the pie chart
const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function PortfolioSummary() {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get top cryptocurrencies to use as our "portfolio"
        const cryptoData = await getTopCryptocurrencies(6);
        
        if (cryptoData.length === 0) {
          throw new Error("Failed to fetch cryptocurrency data");
        }
        
        // Simulate portfolio holdings with random allocations
        const totalPortfolioValue = 25000 + Math.random() * 15000; // Random total between $25K-$40K
        setTotalValue(totalPortfolioValue);
        
        // Create portfolio items with random allocations
        let remainingAllocation = 100;
        const portfolio = cryptoData.map((crypto, index) => {
          // Last item gets the remaining allocation
          const isLast = index === cryptoData.length - 1;
          const allocation = isLast ? remainingAllocation : Math.floor(Math.random() * remainingAllocation * 0.7);
          
          if (!isLast) {
            remainingAllocation -= allocation;
          }
          
          const value = (allocation / 100) * totalPortfolioValue;
          
          return {
            name: crypto.name,
            symbol: crypto.symbol,
            value: parseFloat(value.toFixed(2)),
            allocation,
            color: COLORS[index % COLORS.length]
          };
        });
        
        setPortfolioData(portfolio);
      } catch (err) {
        console.error("Error loading portfolio data:", err);
        // Still try to create a portfolio with fallback data
        const cryptoData = await getTopCryptocurrencies(6);
        
        if (cryptoData.length > 0) {
          const totalPortfolioValue = 25000 + Math.random() * 15000;
          setTotalValue(totalPortfolioValue);
          
          // Create portfolio with whatever data we have
          let remainingAllocation = 100;
          const portfolio = cryptoData.map((crypto, index) => {
            const isLast = index === cryptoData.length - 1;
            const allocation = isLast ? remainingAllocation : Math.floor(Math.random() * remainingAllocation * 0.7);
            
            if (!isLast) {
              remainingAllocation -= allocation;
            }
            
            const value = (allocation / 100) * totalPortfolioValue;
            
            return {
              name: crypto.name,
              symbol: crypto.symbol,
              value: parseFloat(value.toFixed(2)),
              allocation,
              color: COLORS[index % COLORS.length]
            };
          });
          
          setPortfolioData(portfolio);
        } else {
          setError("Failed to load portfolio data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolioData();
  }, [retryCount]);
  
  // Function to retry data loading
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Show loading state
  if (isLoading && portfolioData.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>Asset distribution in your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading portfolio data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (error && portfolioData.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>Asset distribution in your portfolio</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <p className="text-red-500">{error}</p>
            <button className="text-sm text-primary hover:underline" onClick={handleRetry}>Retry</button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Asset distribution in your portfolio</span>
          <span className="font-semibold">{formatCurrency(totalValue)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-3 border rounded-md shadow-md">
                        <p className="font-medium">{data.name} ({data.symbol})</p>
                        <p className="text-sm">{formatCurrency(data.value)}</p>
                        <p className="text-xs text-muted-foreground">{data.allocation}% of portfolio</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {portfolioData.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="text-xs">
                <span className="font-medium">{item.symbol}</span>
                <span className="text-muted-foreground ml-1">{item.allocation}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Demo portfolio - not connected to real assets</p>
      </CardFooter>
    </Card>
  );
}

