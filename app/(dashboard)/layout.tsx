import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { MainNav } from "@/components/main-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 grid md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block border-r">
          <div className="flex flex-col h-full py-4">
            <MainNav />
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

