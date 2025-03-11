"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type PortfolioAsset = {
  name: string
  symbol: string
  value: number
  color: string
  amount: string
}

const portfolioData: PortfolioAsset[] = [
  { name: "Ethereum", symbol: "ETH", value: 45, color: "#627EEA", amount: "2.5 ETH" },
  { name: "Bitcoin", symbol: "BTC", value: 30, color: "#F7931A", amount: "0.15 BTC" },
  { name: "Solana", symbol: "SOL", value: 15, color: "#00FFA3", amount: "25 SOL" },
  { name: "Avalanche", symbol: "AVAX", value: 5, color: "#E84142", amount: "10 AVAX" },
  { name: "Other", symbol: "Various", value: 5, color: "#6C7284", amount: "Various" },
]

export function PortfolioSummary() {
  const totalValue = 12450.78
  const dailyChange = 345.67
  const dailyChangePercent = 2.86

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${totalValue.toLocaleString()}</span>
          <span className={`text-sm ${dailyChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {dailyChange >= 0 ? "+" : ""}
            {dailyChange.toLocaleString()} ({dailyChangePercent.toFixed(2)}%)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer>
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </Chart>
            <ChartTooltip className="bg-background p-2 border rounded-md shadow-md">
              {({ payload }) => {
                if (!payload?.length) return null
                const data = payload[0].payload as PortfolioAsset
                return (
                  <div className="flex flex-col gap-1">
                    <div className="font-bold">
                      {data.name} ({data.symbol})
                    </div>
                    <div className="text-sm">{data.amount}</div>
                    <div className="text-sm">{data.value}% of portfolio</div>
                  </div>
                )
              }}
            </ChartTooltip>
          </ChartContainer>
        </div>
        <div className="mt-4 space-y-1">
          {portfolioData.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                <span className="text-sm">{asset.name}</span>
              </div>
              <div className="text-sm font-medium">{asset.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

