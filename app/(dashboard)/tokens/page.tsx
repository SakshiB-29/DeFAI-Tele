import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Token Research - DeFAI",
  description: "Research and analyze cryptocurrency tokens and projects",
}

export default function TokensPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Token Research</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Search Tokens</CardTitle>
              <CardDescription>Find detailed information about any cryptocurrency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by name or symbol (e.g. Bitcoin, BTC)" className="pl-8" />
                </div>
                <Button>Search</Button>
              </div>

              <div className="mt-6 text-center text-muted-foreground">
                <p>Search for a token to view detailed information</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Popular Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Bitcoin (BTC)",
                  "Ethereum (ETH)",
                  "Solana (SOL)",
                  "Cardano (ADA)",
                  "Binance Coin (BNB)",
                  "XRP (XRP)",
                  "Polkadot (DOT)",
                  "Avalanche (AVAX)",
                ].map((token) => (
                  <Button key={token} variant="outline" className="h-auto py-2">
                    {token}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Trending Tokens</CardTitle>
              <CardDescription>Most viewed in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Ethereum", symbol: "ETH", change: "+5.2%" },
                  { name: "Solana", symbol: "SOL", change: "+12.4%" },
                  { name: "Arbitrum", symbol: "ARB", change: "+8.7%" },
                  { name: "Sui", symbol: "SUI", change: "+3.1%" },
                  { name: "Aptos", symbol: "APT", change: "-2.3%" },
                ].map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground font-medium">{index + 1}</div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className={token.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                      {token.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token Categories</CardTitle>
          <CardDescription>Browse tokens by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="defi">
            <TabsList className="mb-4">
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="layer1">Layer 1</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
              <TabsTrigger value="nft">NFT</TabsTrigger>
              <TabsTrigger value="meme">Meme</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
            </TabsList>

            <TabsContent value="defi" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Uniswap", symbol: "UNI", desc: "Decentralized exchange protocol" },
                  { name: "Aave", symbol: "AAVE", desc: "Lending and borrowing protocol" },
                  { name: "Compound", symbol: "COMP", desc: "Algorithmic money markets" },
                  { name: "MakerDAO", symbol: "MKR", desc: "Decentralized stablecoin issuer" },
                  { name: "Curve", symbol: "CRV", desc: "Stablecoin exchange liquidity pool" },
                  { name: "SushiSwap", symbol: "SUSHI", desc: "Decentralized exchange and yield farming" },
                ].map((token) => (
                  <Card key={token.symbol} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-xs text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{token.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="layer1" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Ethereum", symbol: "ETH", desc: "Smart contract platform" },
                  { name: "Solana", symbol: "SOL", desc: "High-performance blockchain" },
                  { name: "Avalanche", symbol: "AVAX", desc: "Scalable blockchain platform" },
                  { name: "Cardano", symbol: "ADA", desc: "Proof-of-stake blockchain platform" },
                  { name: "Polkadot", symbol: "DOT", desc: "Multi-chain interoperability protocol" },
                  { name: "Near Protocol", symbol: "NEAR", desc: "Developer-friendly blockchain" },
                ].map((token) => (
                  <Card key={token.symbol} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-xs text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{token.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Other tabs would have similar content structure */}
            <TabsContent value="gaming">
              <div className="p-4 text-center text-muted-foreground">Gaming tokens content would appear here</div>
            </TabsContent>
            <TabsContent value="nft">
              <div className="p-4 text-center text-muted-foreground">NFT tokens content would appear here</div>
            </TabsContent>
            <TabsContent value="meme">
              <div className="p-4 text-center text-muted-foreground">Meme tokens content would appear here</div>
            </TabsContent>
            <TabsContent value="ai">
              <div className="p-4 text-center text-muted-foreground">AI tokens content would appear here</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

