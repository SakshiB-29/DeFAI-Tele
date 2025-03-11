import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Search, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Yield Opportunities - DeFAI",
  description: "Find the best yield farming and staking opportunities",
}

export default function YieldPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Yield Opportunities</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Yield Opportunities</CardTitle>
          <CardDescription>Filter by APY, TVL, and risk level to find the best opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="apy-range">Minimum APY: 5%</Label>
              <Slider defaultValue={[5]} max={50} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tvl-range">Minimum TVL: $1M</Label>
              <Slider defaultValue={[1]} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Low
                </Button>
                <Button variant="outline" className="flex-1">
                  Medium
                </Button>
                <Button variant="outline" className="flex-1">
                  High
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by protocol or token" className="pl-8" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="lending">Lending</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="farming">Yield Farming</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Yield Opportunities</CardTitle>
              <CardDescription>Sorted by APY (highest first)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-medium text-muted-foreground mb-2 px-1">
                <div>Protocol / Asset</div>
                <div className="text-right">APY</div>
                <div className="text-right">TVL</div>
                <div className="text-right">Risk</div>
                <div className="text-right">Action</div>
              </div>
              <div className="space-y-2">
                {[
                  { protocol: "Aave", asset: "USDC", apy: 4.2, tvl: "$1.2B", risk: "Low" },
                  { protocol: "Compound", asset: "ETH", apy: 3.8, tvl: "$890M", risk: "Low" },
                  { protocol: "Curve", asset: "3pool", apy: 5.6, tvl: "$450M", risk: "Medium" },
                  { protocol: "Yearn", asset: "USDT", apy: 8.3, tvl: "$320M", risk: "Medium" },
                  { protocol: "Balancer", asset: "ETH/WBTC", apy: 12.5, tvl: "$180M", risk: "High" },
                  { protocol: "Uniswap", asset: "ETH/USDC", apy: 15.2, tvl: "$150M", risk: "High" },
                  { protocol: "Convex", asset: "cvxCRV", apy: 18.7, tvl: "$95M", risk: "High" },
                  { protocol: "Lido", asset: "stETH", apy: 4.0, tvl: "$1.5B", risk: "Low" },
                  { protocol: "Frax", asset: "frxETH", apy: 4.5, tvl: "$250M", risk: "Medium" },
                  { protocol: "Rocket Pool", asset: "rETH", apy: 3.9, tvl: "$350M", risk: "Low" },
                ].map((opportunity, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {opportunity.protocol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{opportunity.protocol}</div>
                        <div className="text-xs text-muted-foreground">{opportunity.asset}</div>
                      </div>
                    </div>
                    <div className="text-right font-bold text-primary">{opportunity.apy.toFixed(1)}%</div>
                    <div className="text-right">{opportunity.tvl}</div>
                    <div className="text-right">
                      <Badge
                        variant={
                          opportunity.risk === "Low"
                            ? "outline"
                            : opportunity.risk === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {opportunity.risk}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Button variant="outline" size="sm" className="gap-1">
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking">
          <div className="p-4 text-center text-muted-foreground">Staking opportunities would appear here</div>
        </TabsContent>

        <TabsContent value="lending">
          <div className="p-4 text-center text-muted-foreground">Lending opportunities would appear here</div>
        </TabsContent>

        <TabsContent value="liquidity">
          <div className="p-4 text-center text-muted-foreground">Liquidity pool opportunities would appear here</div>
        </TabsContent>

        <TabsContent value="farming">
          <div className="p-4 text-center text-muted-foreground">Yield farming opportunities would appear here</div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Guide</CardTitle>
          <CardDescription>Understanding risk levels in DeFi yield opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Low Risk</Badge>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Established protocols with long track record</li>
                <li>Audited multiple times</li>
                <li>Large TVL and user base</li>
                <li>Conservative strategies</li>
                <li>Usually lower APY (1-5%)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Medium Risk</Badge>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Newer but reputable protocols</li>
                <li>At least one audit</li>
                <li>Moderate TVL</li>
                <li>More complex strategies</li>
                <li>Medium APY range (5-15%)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">High Risk</Badge>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>New or experimental protocols</li>
                <li>Limited or no audits</li>
                <li>Lower TVL</li>
                <li>Complex or leveraged strategies</li>
                <li>High APY (15%+)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

