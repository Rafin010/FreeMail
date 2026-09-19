'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo, LogoIcon } from '@/components/shared/logo'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Megaphone, 
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const [mounted, setMounted] = useState(false)
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-[80px]' : 'w-64'}
        `}
      >
        <div className={`h-16 flex items-center border-b border-sidebar-border ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          {isCollapsed ? (
            <LogoIcon size="md" />
          ) : (
            <div className="flex items-center justify-between w-full">
              <Logo />
              <button className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center py-2.5 rounded-lg transition-colors duration-200 ${
                    isCollapsed ? 'justify-center px-0' : 'px-3'
                  } ${
                    isActive
                      ? 'bg-sidebar-active text-sidebar-active-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-foreground'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-sidebar-active-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    } ${!isCollapsed && 'mr-3'}`}
                    aria-hidden="true"
                  />
                  {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className={`p-4 border-t border-sidebar-border space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`group flex items-center py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-hover transition-colors duration-200 ${
              isCollapsed ? 'justify-center w-full px-0' : 'px-3'
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className={`h-5 w-5 text-muted-foreground group-hover:text-foreground ${!isCollapsed && 'mr-3'}`} />
            {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className={`w-full group flex items-center py-2.5 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 ${
              isCollapsed ? 'justify-center px-0' : 'px-3'
            }`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className={`h-5 w-5 text-muted-foreground group-hover:text-destructive ${!isCollapsed && 'mr-3'}`} />
            {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-secondary/30">
        {/* Top header */}
        <header className="h-16 flex-shrink-0 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 z-10 shadow-sm gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="p-2 -ml-2 rounded-md hover:bg-muted text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileOpen(!isMobileOpen)
                } else {
                  setIsCollapsed(!isCollapsed)
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="max-w-md w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors relative hidden sm:block">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-foreground leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{user?.email || 'user@example.com'}</p>
              </div>
              {user?.image ? (
                <img src={user.image} alt="Profile" className="h-9 w-9 rounded-full object-cover border border-border shadow-sm cursor-pointer" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer border border-primary-hover">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className={`max-w-7xl mx-auto ${pathname?.includes('/edit') || pathname?.includes('/campaigns/new') ? 'p-0' : 'p-4 sm:p-8'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
