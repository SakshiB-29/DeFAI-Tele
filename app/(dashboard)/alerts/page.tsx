import type React from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Plus, Trash2, Edit, ArrowUp, Clock, Wallet, BarChart3, Percent } from "lucide-react"

export const metadata: Metadata = {
  title: "Alerts - DeFAI",
  description: "Set up and manage your DeFi alerts",
}

export default function AlertsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Alert
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: "price",
                asset: "ETH",
                condition: "above",
                value: "$2,500",
                created: "2 days ago",
                status: "active",
              },
              {
                type: "price",
                asset: "BTC",
                condition: "below",
                value: "$40,000",
                created: "1 week ago",
                status: "active",
              },
              {
                type: "yield",
                asset: "USDC on Aave",
                condition: "above",
                value: "5% APY",
                created: "3 days ago",
                status: "active",
              },
              {
                type: "wallet",
                asset: "0x1a2...3b4c",
                condition: "movement",
                value: "Any",
                created: "1 day ago",
                status: "active",
              },
              {
                type: "smart_money",
                asset: "ETH",
                condition: "large outflow",
                value: "> $10M",
                created: "5 days ago",
                status: "active",
              },
              {
                type: "price",
                asset: "SOL",
                condition: "change",
                value: "> 10% in 24h",
                created: "12 hours ago",
                status: "active",
              },
            ].map((alert, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {alert.type === "price" && <BarChart3 className="h-4 w-4 text-primary" />}
                        {alert.type === "yield" && <Percent className="h-4 w-4 text-primary" />}
                        {alert.type === "wallet" && <Wallet className="h-4 w-4 text-primary" />}
                        {alert.type === "smart_money" && <ArrowUp className="h-4 w-4 text-primary" />}
                        {alert.asset}
                      </CardTitle>
                      <CardDescription>
                        {alert.type === "price" && "Price Alert"}
                        {alert.type === "yield" && "Yield Alert"}
                        {alert.type === "wallet" && "Wallet Alert"}
                        {alert.type === "smart_money" && "Smart Money Alert"}
                      </CardDescription>
                    </div>
                    <Switch checked={alert.status === "active"} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium">
                        {alert.condition === "above" && "Price above"}
                        {alert.condition === "below" && "Price below"}
                        {alert.condition === "change" && "Price change"}
                        {alert.condition === "movement" && "Any movement"}
                        {alert.condition === "large outflow" && "Large outflow"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-medium">{alert.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{alert.created}</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Recent alerts that have been triggered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "price",
                    asset: "ETH",
                    message: "ETH price increased above $2,400",
                    time: "2 hours ago",
                  },
                  {
                    type: "smart_money",
                    asset: "BTC",
                    message: "Large BTC outflow detected: 1,500 BTC moved to Binance",
                    time: "5 hours ago",
                  },
                  {
                    type: "yield",
                    asset: "USDC",
                    message: "New yield opportunity: USDC on Compound now 4.8% APY",
                    time: "1 day ago",
                  },
                  {
                    type: "wallet",
                    asset: "0x1a2...3b4c",
                    message: "Tracked wallet 0x1a2...3b4c moved 500 ETH",
                    time: "2 days ago",
                  },
                  {
                    type: "price",
                    asset: "SOL",
                    message: "SOL price dropped below $90",
                    time: "3 days ago",
                  },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className={`p-2 rounded-full bg-primary/10`}>
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <Label htmlFor="browser">Browser Notifications</Label>
                      </div>
                      <Switch id="browser" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="email">Email Notifications</Label>
                      </div>
                      <Switch id="email" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <Label htmlFor="mobile">Mobile Push Notifications</Label>
                      </div>
                      <Switch id="mobile" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alert Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <Label htmlFor="price">Price Alerts</Label>
                      </div>
                      <Switch id="price" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        <Label htmlFor="yield">Yield Alerts</Label>
                      </div>
                      <Switch id="yield" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <Label htmlFor="wallet">Wallet Alerts</Label>
                      </div>
                      <Switch id="wallet" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4" />
                        <Label htmlFor="smart">Smart Money Alerts</Label>
                      </div>
                      <Switch id="smart" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Settings</h3>
                  <div className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="email-address">Email Address</Label>
                      <Input type="email" id="email-address" placeholder="your@email.com" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="daily-digest" />
                      <Label htmlFor="daily-digest">Send daily digest instead of individual alerts</Label>
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function Smartphone(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

