import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Twitter, MessageSquare, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Social Sentiment - DeFAI",
  description: "Analyze social media sentiment for cryptocurrencies",
}

export default function SentimentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Social Sentiment Analysis</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Search Token Sentiment</CardTitle>
              <CardDescription>Analyze social sentiment for any cryptocurrency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by name or symbol (e.g. Bitcoin, BTC)" className="pl-8" />
                </div>
                <Button>Analyze</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ethereum Sentiment Analysis</CardTitle>
              <CardDescription>Social media sentiment for ETH over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="twitter">
                <TabsList className="mb-4">
                  <TabsTrigger value="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </TabsTrigger>
                  <TabsTrigger value="reddit" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Reddit
                  </TabsTrigger>
                  <TabsTrigger value="overall" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Overall
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="twitter" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Sentiment Score</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">72</span>
                      <Badge variant="outline">Bullish</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Positive</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Neutral</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <Progress value={20} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Negative</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Top Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {["ETH2.0", "Merge", "Staking", "DeFi", "Gas Fees", "Layer 2", "Scaling", "Vitalik"].map(
                        (keyword) => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Recent Tweets</div>
                    <div className="space-y-3">
                      {[
                        {
                          user: "@crypto_analyst",
                          text: "Ethereum's move to PoS is a game changer for energy consumption. Bullish on ETH long term! #Ethereum #ETH",
                          sentiment: "positive",
                        },
                        {
                          user: "@defi_trader",
                          text: "Gas fees still too high on Ethereum mainnet. Layer 2 solutions are the future. $ETH",
                          sentiment: "neutral",
                        },
                        {
                          user: "@blockchain_dev",
                          text: "Just deployed a new smart contract on Ethereum. The ecosystem is thriving despite the bear market. #ETH #Web3",
                          sentiment: "positive",
                        },
                        {
                          user: "@eth_holder",
                          text: "Staking rewards are great but the lock-up period is concerning. Hope Shanghai upgrade comes soon. #ETH",
                          sentiment: "neutral",
                        },
                      ].map((tweet, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="font-medium text-sm">{tweet.user}</div>
                          <div className="text-sm mt-1">{tweet.text}</div>
                          <div className="mt-2">
                            <Badge
                              variant={tweet.sentiment === "positive" ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              {tweet.sentiment === "positive" ? "Positive" : "Neutral"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reddit">
                  <div className="p-4 text-center text-muted-foreground">
                    Reddit sentiment analysis would appear here
                  </div>
                </TabsContent>

                <TabsContent value="overall">
                  <div className="p-4 text-center text-muted-foreground">
                    Overall sentiment analysis would appear here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Leaderboard</CardTitle>
              <CardDescription>Tokens with the most positive sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Solana", symbol: "SOL", score: 85 },
                  { name: "Ethereum", symbol: "ETH", score: 72 },
                  { name: "Polygon", symbol: "MATIC", score: 68 },
                  { name: "Arbitrum", symbol: "ARB", score: 65 },
                  { name: "Avalanche", symbol: "AVAX", score: 62 },
                ].map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground font-medium">{index + 1}</div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">{token.score}</span>
                      <Badge variant={token.score > 70 ? "outline" : token.score > 50 ? "secondary" : "destructive"}>
                        {token.score > 70 ? "Bullish" : token.score > 50 ? "Neutral" : "Bearish"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
              <CardDescription>Most discussed topics in crypto social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { topic: "Ethereum Shanghai Upgrade", mentions: "15.2K" },
                  { topic: "Bitcoin ETF Approval", mentions: "12.8K" },
                  { topic: "Solana DeFi Ecosystem", mentions: "8.5K" },
                  { topic: "Layer 2 Scaling Solutions", mentions: "7.3K" },
                  { topic: "Regulatory Concerns", mentions: "6.9K" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium">{item.topic}</div>
                    <div className="text-sm text-muted-foreground">{item.mentions} mentions</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

