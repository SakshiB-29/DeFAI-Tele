import type React from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowDownToLine, ArrowUpFromLine, ExternalLink, Search, Filter, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Smart Money - DeFAI",
  description: "Track smart money movements and whale activity",
}

export default function SmartMoneyPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Smart Money Insights</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Track Wallet Activity</CardTitle>
          <CardDescription>Monitor specific wallets or search for whale activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Enter wallet address (0x...)" className="pl-8" />
            </div>
            <Button>Track Wallet</Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Tracked Wallets</h3>
            <div className="space-y-2">
              {[
                {
                  address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
                  label: "Whale 1",
                  balance: "$25.4M",
                  lastActivity: "2 hours ago",
                },
                {
                  address: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
                  label: "Whale 2",
                  balance: "$18.7M",
                  lastActivity: "5 hours ago",
                },
                {
                  address: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
                  label: "Smart Money 1",
                  balance: "$42.1M",
                  lastActivity: "1 day ago",
                },
              ].map((wallet, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{wallet.label}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                        <ExternalLink className="h-3 w-3 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Balance</div>
                      <div className="font-medium">{wallet.balance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Activity</div>
                      <div className="font-medium">{wallet.lastActivity}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Activity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Recent Movements</TabsTrigger>
          <TabsTrigger value="whales">Whale Watch</TabsTrigger>
          <TabsTrigger value="tokens">Token Flows</TabsTrigger>
          <TabsTrigger value="exchanges">Exchange Flows</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Large Transactions</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-medium text-muted-foreground p-4 border-b">
                <div className="col-span-2">Transaction</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Value</div>
                <div className="text-right">Time</div>
                <div className="text-right">Explorer</div>
              </div>
              <div className="divide-y">
                {[
                  {
                    type: "out",
                    from: "0x1a2...3b4c",
                    to: "Binance",
                    amount: "1,500 ETH",
                    value: "$3.5M",
                    time: "10 min ago",
                  },
                  {
                    type: "in",
                    from: "Coinbase",
                    to: "0x5d6...7e8f",
                    amount: "25,000 USDC",
                    value: "$25K",
                    time: "25 min ago",
                  },
                  {
                    type: "out",
                    from: "0x9a0...1b2c",
                    to: "Kraken",
                    amount: "500,000 USDT",
                    value: "$500K",
                    time: "1 hour ago",
                  },
                  {
                    type: "in",
                    from: "Unknown",
                    to: "0x3d4...5e6f",
                    amount: "100 BTC",
                    value: "$4.2M",
                    time: "2 hours ago",
                  },
                  {
                    type: "out",
                    from: "0x7g8...9h0i",
                    to: "Unknown",
                    amount: "5,000 ETH",
                    value: "$11.8M",
                    time: "3 hours ago",
                  },
                  {
                    type: "in",
                    from: "Binance",
                    to: "0x1j2...3k4l",
                    amount: "10,000,000 SHIB",
                    value: "$120K",
                    time: "4 hours ago",
                  },
                  {
                    type: "out",
                    from: "0x5m6...7n8o",
                    to: "Uniswap",
                    amount: "2,500 ETH",
                    value: "$5.9M",
                    time: "5 hours ago",
                  },
                  {
                    type: "in",
                    from: "FTX",
                    to: "0x9p0...1q2r",
                    amount: "750 ETH",
                    value: "$1.8M",
                    time: "6 hours ago",
                  },
                ].map((tx, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4">
                    <div className="flex items-center gap-3 col-span-2">
                      <div className={`p-2 rounded-full ${tx.type === "in" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                        {tx.type === "in" ? (
                          <ArrowDownToLine className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {tx.from}
                          <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tx.type === "in" ? "From" : "To"} {tx.type === "in" ? tx.from : tx.to}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">{tx.amount}</div>
                    <div className="text-right font-medium">{tx.value}</div>
                    <div className="text-right text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {tx.time}
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

        <TabsContent value="whales">
          <div className="p-4 text-center text-muted-foreground">Whale watch data would appear here</div>
        </TabsContent>

        <TabsContent value="tokens">
          <div className="p-4 text-center text-muted-foreground">Token flow data would appear here</div>
        </TabsContent>

        <TabsContent value="exchanges">
          <div className="p-4 text-center text-muted-foreground">Exchange flow data would appear here</div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Smart Money Insights</CardTitle>
          <CardDescription>Analysis of recent smart money movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "ETH Accumulation by Whales",
                description:
                  "Large wallets have accumulated over 25,000 ETH in the past 24 hours, suggesting bullish sentiment.",
                impact: "Bullish",
                time: "2 hours ago",
              },
              {
                title: "USDT Flowing to Exchanges",
                description:
                  "Over $150M in USDT has moved to major exchanges in the last 12 hours, potentially indicating selling pressure.",
                impact: "Bearish",
                time: "5 hours ago",
              },
              {
                title: "SOL Outflow from Exchanges",
                description:
                  "Approximately 500,000 SOL has moved from exchanges to private wallets, suggesting accumulation.",
                impact: "Bullish",
                time: "8 hours ago",
              },
              {
                title: "BTC Long-Term Holder Movement",
                description:
                  "Several wallets holding BTC for 5+ years have shown activity, moving approximately 2,500 BTC.",
                impact: "Neutral",
                time: "12 hours ago",
              },
            ].map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge
                    variant={
                      insight.impact === "Bullish"
                        ? "outline"
                        : insight.impact === "Bearish"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {insight.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Wallet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}

