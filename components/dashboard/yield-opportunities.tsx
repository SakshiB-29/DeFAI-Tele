"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

type YieldOpportunity = {
  protocol: string
  asset: string
  apy: number
  tvl: string
  risk: "Low" | "Medium" | "High"
}

const yieldOpportunities: YieldOpportunity[] = [
  {
    protocol: "Aave",
    asset: "USDC",
    apy: 4.2,
    tvl: "$1.2B",
    risk: "Low",
  },
  {
    protocol: "Compound",
    asset: "ETH",
    apy: 3.8,
    tvl: "$890M",
    risk: "Low",
  },
  {
    protocol: "Curve",
    asset: "3pool",
    apy: 5.6,
    tvl: "$450M",
    risk: "Medium",
  },
  {
    protocol: "Yearn",
    asset: "USDT",
    apy: 8.3,
    tvl: "$320M",
    risk: "Medium",
  },
  {
    protocol: "Balancer",
    asset: "ETH/WBTC",
    apy: 12.5,
    tvl: "$180M",
    risk: "High",
  },
]

export function YieldOpportunities() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Yield Opportunities</CardTitle>
          <CardDescription>Best yield farming and staking opportunities</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <span>View All</span>
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {yieldOpportunities.map((opportunity) => (
            <div
              key={`${opportunity.protocol}-${opportunity.asset}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div>
                <div className="font-medium">{opportunity.protocol}</div>
                <div className="text-sm text-muted-foreground">{opportunity.asset}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">{opportunity.apy.toFixed(1)}% APY</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>TVL: {opportunity.tvl}</span>
                  <Badge
                    variant={
                      opportunity.risk === "Low"
                        ? "outline"
                        : opportunity.risk === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {opportunity.risk} Risk
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

