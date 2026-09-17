'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading to show the animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    // This will trigger the Next.js loading.tsx if we used Suspense, 
    // but here we can just rely on the router or show a manual one.
    // However, the requested Loading animation is in `loading.tsx`.
    // Let's just render the dashboard content.
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Good morning, User</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your email marketing.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover shadow-sm transition-colors">
          + Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Emails Sent', value: '82,420', change: '+12.5%', pos: true },
          { label: 'Open Rate', value: '24.8%', change: '+2.1%', pos: true },
          { label: 'Click Rate', value: '3.6%', change: '-0.4%', pos: false },
          { label: 'Revenue', value: '$12,430', change: '+18.2%', pos: true },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{stat.value}</span>
              <span className={`text-xs font-medium ${stat.pos ? 'text-success' : 'text-destructive'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Campaign Performance Chart Area</p>
      </div>
    </div>
  )
}
