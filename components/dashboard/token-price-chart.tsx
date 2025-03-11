"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useState } from "react"

const timeRanges = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "ALL" },
]

// Sample data
const generateData = (days: number) => {
  const data = []
  const startPrice = 2000 + Math.random() * 1000
  let currentPrice = startPrice

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 100
    currentPrice += change
    currentPrice = Math.max(currentPrice, startPrice * 0.7) // Prevent too much drop

    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      price: currentPrice.toFixed(2),
    })
  }

  return data
}

const dataMap = {
  "1D": generateData(24),
  "1W": generateData(7),
  "1M": generateData(30),
  "3M": generateData(90),
  "1Y": generateData(365),
  ALL: generateData(365 * 2),
}

export function TokenPriceChart() {
  const [timeRange, setTimeRange] = useState("1M")

  const data = dataMap[timeRange as keyof typeof dataMap]
  const startPrice = Number.parseFloat(data[0].price)
  const endPrice = Number.parseFloat(data[data.length - 1].price)
  const priceChange = endPrice - startPrice
  const percentChange = (priceChange / startPrice) * 100
  const isPositive = priceChange >= 0

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Ethereum (ETH)</CardTitle>
          <CardDescription className="flex items-center">
            <span className="text-2xl font-bold">${endPrice.toFixed(2)}</span>
            <span className={`ml-2 flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(percentChange).toFixed(2)}%
            </span>
          </CardDescription>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            {timeRanges.map((range) => (
              <TabsTrigger key={range.value} value={range.value}>
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px]">
          <ChartContainer>
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return timeRange === "1D"
                        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : date.toLocaleDateString([], { month: "short", day: "numeric" })
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Chart>
            <ChartTooltip className="bg-background p-2 border rounded-md shadow-md">
              {({ payload }) => {
                if (!payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-muted-foreground">{data.date}</div>
                    <div className="font-bold">${data.price}</div>
                  </div>
                )
              }}
            </ChartTooltip>
            <ChartLegend className="mt-4 flex justify-center gap-4">
              <ChartLegendItem name="Price" color="hsl(var(--primary))" />
            </ChartLegend>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

