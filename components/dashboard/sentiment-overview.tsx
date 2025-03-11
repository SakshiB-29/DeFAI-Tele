"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Twitter, MessageSquare } from "lucide-react"

type SentimentData = {
  positive: number
  neutral: number
  negative: number
  score: number
  trending: string[]
}

const sentimentData: Record<string, SentimentData> = {
  twitter: {
    positive: 65,
    neutral: 20,
    negative: 15,
    score: 72,
    trending: ["#Ethereum", "#DeFi", "#NFTs", "#Web3", "#Crypto"],
  },
  reddit: {
    positive: 58,
    neutral: 25,
    negative: 17,
    score: 68,
    trending: ["Ethereum 2.0", "Layer 2", "Gas Fees", "DeFi Summer", "Staking"],
  },
}

export function SentimentOverview() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Social Sentiment</CardTitle>
        <CardDescription>Sentiment analysis from social platforms</CardDescription>
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
          </TabsList>

          {Object.entries(sentimentData).map(([platform, data]) => (
            <TabsContent key={platform} value={platform} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Sentiment Score</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">{data.score}</span>
                  <Badge variant={data.score > 70 ? "outline" : data.score > 50 ? "secondary" : "destructive"}>
                    {data.score > 70 ? "Bullish" : data.score > 50 ? "Neutral" : "Bearish"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Positive</span>
                  <span className="font-medium">{data.positive}%</span>
                </div>
                <Progress value={data.positive} className="h-2 bg-muted" indicatorClassName="bg-green-500" />

                <div className="flex justify-between text-sm">
                  <span>Neutral</span>
                  <span className="font-medium">{data.neutral}%</span>
                </div>
                <Progress value={data.neutral} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />

                <div className="flex justify-between text-sm">
                  <span>Negative</span>
                  <span className="font-medium">{data.negative}%</span>
                </div>
                <Progress value={data.negative} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Trending Topics</div>
                <div className="flex flex-wrap gap-2">
                  {data.trending.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

