'use client'

import { Logo } from '@/components/shared/logo'
import LoadingDemo from '@/components/shared/loading-demo'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-r border-border md:h-screen sticky top-0 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-active text-sidebar-active-foreground font-medium">
            Dashboard
          </Link>
          <Link href="/campaigns" className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-hover font-medium">
            Campaigns
          </Link>
          <Link href="/audience" className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-hover font-medium">
            Audience
          </Link>
          <Link href="/automations" className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-hover font-medium">
            Automations
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <LoadingDemo />
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="font-semibold text-lg">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
