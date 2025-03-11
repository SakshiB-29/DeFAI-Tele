"use client"

import type * as React from "react"
import { TooltipProps } from "recharts"

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

const Chart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartTooltip = ({ className, children }: { className?: string; children: (props: any) => React.ReactNode }) => {
  return <div className={className}>{typeof children === "function" ? children({}) : children}</div>
}

const ChartTooltipContent = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-background p-2 border rounded-md shadow-md">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-bold">${payload[0].value}</div>
    </div>
  );
}

const ChartLegend = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={className}>{children}</div>
}

const ChartLegendItem = ({ name, color }: { name: string; color: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{name}</span>
    </div>
  )
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

