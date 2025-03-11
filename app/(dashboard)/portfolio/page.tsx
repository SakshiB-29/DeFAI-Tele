import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Wallet, ExternalLink, Download, Filter } from "lucide-react"

export const metadata: Metadata = {
  title: "Portfolio - DeFAI",
  description: "Track your crypto portfolio and performance",
}

export default function PortfolioPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Total Value</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">$12,450.78</span>
            <span className="text-sm font-medium text-green-500">+2.86%</span>
          </div>
        </Card>
        <Card className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">24h Change</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">+$345.67</span>
            <span className="text-sm font-medium text-green-500">+2.86%</span>
          </div>
        </Card>
        <Card className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Assets</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">8</span>
            <span className="text-sm font-medium text-muted-foreground">tokens</span>
          </div>
        </Card>
        <Card className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Best Performer</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">SOL</span>
            <span className="text-sm font-medium text-green-500">+12.4%</span>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Breakdown</CardTitle>
          <CardDescription>Your portfolio composition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-medium text-muted-foreground mb-2 px-1">
            <div className="col-span-2">Asset</div>
            <div className="text-right">Price</div>
            <div className="text-right">Holdings</div>
            <div className="text-right">Value</div>
            <div className="text-right">24h</div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Ethereum", symbol: "ETH", price: 2356.42, amount: "2.5 ETH", value: 5891.05, change: 3.56 },
              { name: "Bitcoin", symbol: "BTC", price: 42356.78, amount: "0.15 BTC", value: 6353.52, change: 2.34 },
              { name: "Solana", symbol: "SOL", price: 98.76, amount: "25 SOL", value: 2469.0, change: 12.4 },
              { name: "Avalanche", symbol: "AVAX", price: 32.45, amount: "10 AVAX", value: 324.5, change: -1.23 },
              { name: "Polygon", symbol: "MATIC", price: 0.85, amount: "1000 MATIC", value: 850.0, change: 5.67 },
              { name: "Chainlink", symbol: "LINK", price: 12.34, amount: "50 LINK", value: 617.0, change: -2.45 },
              { name: "Uniswap", symbol: "UNI", price: 5.67, amount: "100 UNI", value: 567.0, change: 1.23 },
              { name: "Aave", symbol: "AAVE", price: 78.9, amount: "5 AAVE", value: 394.5, change: 0.45 },
            ].map((asset, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {asset.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                  </div>
                </div>
                <div className="text-right font-medium">
                  ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-right">{asset.amount}</div>
                <div className="text-right font-bold">
                  ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-right">
                  <Badge variant={asset.change >= 0 ? "outline" : "destructive"} className="gap-1">
                    {asset.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(asset.change).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
          <TabsTrigger value="history">Performance History</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-medium text-muted-foreground p-4 border-b">
                <div className="col-span-2">Transaction</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Value</div>
                <div className="text-right">Date</div>
                <div className="text-right">Explorer</div>
              </div>
              <div className="divide-y">
                {[
                  {
                    type: "Swap",
                    from: "ETH",
                    to: "USDC",
                    amount: "0.5 ETH",
                    value: "$1,178.21",
                    date: "2023-06-15",
                    time: "14:32",
                  },
                  {
                    type: "Receive",
                    from: "External",
                    to: "ETH",
                    amount: "1.2 ETH",
                    value: "$2,827.70",
                    date: "2023-06-12",
                    time: "09:15",
                  },
                  {
                    type: "Send",
                    from: "SOL",
                    to: "External",
                    amount: "10 SOL",
                    value: "$987.60",
                    date: "2023-06-10",
                    time: "18:45",
                  },
                  {
                    type: "Swap",
                    from: "USDC",
                    to: "BTC",
                    amount: "1000 USDC",
                    value: "$1,000.00",
                    date: "2023-06-08",
                    time: "11:20",
                  },
                  {
                    type: "Stake",
                    from: "ETH",
                    to: "stETH",
                    amount: "0.8 ETH",
                    value: "$1,885.14",
                    date: "2023-06-05",
                    time: "16:10",
                  },
                ].map((tx, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4">
                    <div className="flex items-center gap-3 col-span-2">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === "Receive"
                            ? "bg-green-500/10"
                            : tx.type === "Send"
                              ? "bg-red-500/10"
                              : "bg-primary/10"
                        }`}
                      >
                        {tx.type === "Receive" ? (
                          <ArrowDown className={`h-4 w-4 ${tx.type === "Receive" ? "text-green-500" : ""}`} />
                        ) : tx.type === "Send" ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {tx.type === "Swap"
                            ? `${tx.from} → ${tx.to}`
                            : tx.type === "Receive"
                              ? `From ${tx.from}`
                              : `To ${tx.to}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">{tx.amount}</div>
                    <div className="text-right font-medium">{tx.value}</div>
                    <div className="text-right text-muted-foreground">
                      <div>{tx.date}</div>
                      <div className="text-xs">{tx.time}</div>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on Explorer</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts">
          <div className="p-4 text-center text-muted-foreground">Your NFT collection would appear here</div>
        </TabsContent>

        <TabsContent value="defi">
          <div className="p-4 text-center text-muted-foreground">Your DeFi positions would appear here</div>
        </TabsContent>

        <TabsContent value="history">
          <div className="p-4 text-center text-muted-foreground">
            Your portfolio performance history would appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

