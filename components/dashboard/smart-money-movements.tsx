"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownToLine, ArrowUpFromLine, ExternalLink } from "lucide-react"

type Movement = {
  id: string
  type: "in" | "out"
  wallet: string
  amount: string
  token: string
  destination: string
  time: string
}

const movements: Movement[] = [
  {
    id: "1",
    type: "out",
    wallet: "0x1a2...3b4c",
    amount: "1,500",
    token: "ETH",
    destination: "Binance",
    time: "10 min ago",
  },
  {
    id: "2",
    type: "in",
    wallet: "0x5d6...7e8f",
    amount: "25,000",
    token: "USDC",
    destination: "Wallet",
    time: "25 min ago",
  },
  {
    id: "3",
    type: "out",
    wallet: "0x9a0...1b2c",
    amount: "500,000",
    token: "USDT",
    destination: "Coinbase",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "in",
    wallet: "0x3d4...5e6f",
    amount: "100",
    token: "BTC",
    destination: "Wallet",
    time: "2 hours ago",
  },
]

export function SmartMoneyMovements() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Smart Money Movements</CardTitle>
        <CardDescription>Recent significant wallet activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${movement.type === "in" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {movement.type === "in" ? (
                    <ArrowDownToLine className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {movement.wallet}
                    <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {movement.type === "in" ? "Received from" : "Sent to"} {movement.destination}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {movement.amount} <span className="text-muted-foreground">{movement.token}</span>
                </div>
                <div className="text-xs text-muted-foreground">{movement.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

