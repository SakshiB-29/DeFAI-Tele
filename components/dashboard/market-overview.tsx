"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

type MarketItem = {
  name: string
  symbol: string
  price: number
  change: number
  marketCap: string
  volume: string
}

const marketData: MarketItem[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 42356.78,
    change: 2.34,
    marketCap: "$820.5B",
    volume: "$28.9B",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 2356.42,
    change: 3.56,
    marketCap: "$283.2B",
    volume: "$15.7B",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    price: 312.45,
    change: -1.23,
    marketCap: "$48.3B",
    volume: "$2.1B",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 98.76,
    change: 5.67,
    marketCap: "$41.2B",
    volume: "$3.5B",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change: -2.45,
    marketCap: "$15.8B",
    volume: "$1.2B",
  },
]

export function MarketOverview() {
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
              key={item.symbol}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.symbol.charAt(0)}
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
                <Badge variant={item.change >= 0 ? "outline" : "destructive"} className="gap-1">
                  {item.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(item.change).toFixed(2)}%
                </Badge>
              </div>
              <div className="text-right hidden md:block">{item.marketCap}</div>
              <div className="text-right hidden md:block">{item.volume}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

