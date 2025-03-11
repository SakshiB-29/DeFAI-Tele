import type { Metadata } from "next"
import { TokenPriceChart } from "@/components/dashboard/token-price-chart"
import { MarketOverview } from "@/components/dashboard/market-overview"
import { SentimentOverview } from "@/components/dashboard/sentiment-overview"
import { YieldOpportunities } from "@/components/dashboard/yield-opportunities"
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary"
import { SmartMoneyMovements } from "@/components/dashboard/smart-money-movements"

export const metadata: Metadata = {
  title: "Dashboard - DeFAI",
  description: "DeFAI Dashboard - Decentralized Financial Insights",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Total Market Cap</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">$2.45T</span>
            <span className="text-sm font-medium text-green-500">+3.2%</span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">24h Volume</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">$78.9B</span>
            <span className="text-sm font-medium text-green-500">+5.7%</span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">BTC Dominance</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">42.3%</span>
            <span className="text-sm font-medium text-red-500">-0.8%</span>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">Fear & Greed Index</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold">65</span>
            <span className="text-sm font-medium text-muted-foreground">Greed</span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <TokenPriceChart />
        <MarketOverview />
        <SentimentOverview />
        <YieldOpportunities />
        <PortfolioSummary />
        <SmartMoneyMovements />
      </div>
    </div>
  )
}

