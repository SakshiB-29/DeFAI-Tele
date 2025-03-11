"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, BarChart3, Coins, Flame, Home, LineChart, Wallet } from "lucide-react"

const items = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Token Research",
    href: "/tokens",
    icon: Coins,
  },
  {
    name: "Social Sentiment",
    href: "/sentiment",
    icon: Activity,
  },
  {
    name: "Yield Opportunities",
    href: "/yield",
    icon: Flame,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Wallet,
  },
  {
    name: "Smart Money",
    href: "/smart-money",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: LineChart,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
            pathname === item.href ? "bg-secondary text-primary" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

