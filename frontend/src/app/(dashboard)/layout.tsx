'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/shared/logo'
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  Workflow, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Audience', href: '/audience', icon: Users },
  { name: 'Automations', href: '/automations', icon: Workflow },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-20">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Logo />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-sidebar-active text-sidebar-active-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-sidebar-active-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/settings"
            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-hover transition-colors duration-200"
          >
            <Settings className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            Settings
          </Link>
          <button className="w-full mt-1 group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-200">
            <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-destructive" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-secondary/30">
        {/* Top header */}
        <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center flex-1">
            {/* Search */}
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns, contacts..."
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors relative">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-sm cursor-pointer border border-primary-hover">
              JD
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
