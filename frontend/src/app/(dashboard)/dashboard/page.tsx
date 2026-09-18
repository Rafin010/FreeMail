'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Users, Mail, ArrowUpRight, Plus, ExternalLink, Activity, Filter, Calendar } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useCampaignStore } from '@/store/campaign-store'

const data7Days = [
  { name: 'Mon', sent: 0, opens: 0 },
  { name: 'Tue', sent: 0, opens: 0 },
  { name: 'Wed', sent: 0, opens: 0 },
  { name: 'Thu', sent: 0, opens: 0 },
  { name: 'Fri', sent: 0, opens: 0 },
  { name: 'Sat', sent: 0, opens: 0 },
  { name: 'Sun', sent: 0, opens: 0 },
]

const data30Days = [
  { name: 'Week 1', sent: 0, opens: 0 },
  { name: 'Week 2', sent: 0, opens: 0 },
  { name: 'Week 3', sent: 0, opens: 0 },
  { name: 'Week 4', sent: 0, opens: 0 },
]

export default function DashboardPage() {
  const campaigns = useCampaignStore(state => state.campaigns)
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days'>('7days')
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chartData = timeFilter === '7days' ? data7Days : data30Days

  // Calculate real stats from store
  const totalCampaigns = campaigns.length
  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0)
  const totalAudience = 0

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your email marketing performance.</p>
        </div>
        <Link 
          href="/campaigns" 
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Link>
      </div>
      
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Audiences</h3>
            </div>
            <span className="text-4xl font-extrabold text-foreground tracking-tight">{totalAudience.toLocaleString()}</span>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span>—</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Mail className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Emails Sent</h3>
            </div>
            <span className="text-4xl font-extrabold text-foreground tracking-tight">{totalSent.toLocaleString()}</span>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span>—</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Avg. Open Rate</h3>
            </div>
            <span className="text-4xl font-extrabold text-foreground tracking-tight">0%</span>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span>—</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Performance Analytics</h2>
              <p className="text-xs text-muted-foreground mt-1">Track emails sent vs opens over time.</p>
            </div>
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
              <button 
                onClick={() => setTimeFilter('7days')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${timeFilter === '7days' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeFilter('30days')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${timeFilter === '30days' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" name="Emails Sent" />
                <Area type="monotone" dataKey="opens" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOpens)" name="Emails Opened" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Campaigns Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-foreground">Recent Campaigns</h2>
             <Calendar className="w-4 h-4 text-muted-foreground" />
           </div>
           
           <div className="flex-1 flex flex-col space-y-4">
             {campaigns.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                   <Mail className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <p className="text-sm font-medium text-foreground">No campaigns yet</p>
                 <p className="text-xs text-muted-foreground mt-1">Start your first email campaign.</p>
               </div>
             ) : (
               campaigns.slice(0, 4).map(c => (
                 <Link 
                   key={c.id} 
                   href={`/campaigns/${c.id}/${c.status === 'Sent' ? 'monitor' : 'edit'}`}
                   className="group flex flex-col p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/20 transition-all"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-semibold text-sm text-foreground truncate pr-4">{c.name}</h3>
                     <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                   </div>
                   <div className="flex items-center justify-between mt-auto">
                     <span className="text-xs text-muted-foreground font-medium">{c.date}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                       c.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                     }`}>
                       {c.status}
                     </span>
                   </div>
                 </Link>
               ))
             )}
           </div>

           <Link 
             href="/campaigns" 
             className="w-full mt-6 py-2 bg-secondary hover:bg-muted text-foreground text-sm font-bold rounded-lg transition-colors border border-border flex items-center justify-center gap-2"
           >
             View All Campaigns
           </Link>
        </div>

      </div>
      
    </div>
  )
}
