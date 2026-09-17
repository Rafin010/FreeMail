'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, Mail, MousePointerClick, DollarSign, Plus } from 'lucide-react'

const performanceData = [
  { name: 'Mon', sent: 4000, opened: 2400, clicks: 1200 },
  { name: 'Tue', sent: 3000, opened: 1398, clicks: 800 },
  { name: 'Wed', sent: 2000, opened: 9800, clicks: 2400 },
  { name: 'Thu', sent: 2780, opened: 3908, clicks: 1800 },
  { name: 'Fri', sent: 1890, opened: 4800, clicks: 1000 },
  { name: 'Sat', sent: 2390, opened: 3800, clicks: 1400 },
  { name: 'Sun', sent: 3490, opened: 4300, clicks: 2100 },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">Track your campaign performance and audience growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="h-10 bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Contacts', value: '14,248', change: '12.5%', pos: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Emails Sent', value: '82,420', change: '24.1%', pos: true, icon: Mail, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Avg. Open Rate', value: '28.4%', change: '4.2%', pos: true, icon: ArrowUpRight, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Click Rate', value: '3.2%', change: '1.4%', pos: false, icon: MousePointerClick, color: 'text-destructive', bg: 'bg-destructive/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.pos ? 'text-success' : 'text-destructive'}`}>
                {stat.pos ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Engagement Overview</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="opened" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorOpened)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Campaigns</h3>
            <div className="space-y-5">
              {[
                { name: 'Black Friday Sale', status: 'Sent', date: 'Nov 24', open: '32%', click: '8%' },
                { name: 'Welcome Series #1', status: 'Active', date: 'Always', open: '45%', click: '12%' },
                { name: 'Product Update Q4', status: 'Draft', date: 'Not sent', open: '-', click: '-' },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{campaign.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        campaign.status === 'Sent' ? 'bg-success/10 text-success' :
                        campaign.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {campaign.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{campaign.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.open}</p>
                    <p className="text-xs text-muted-foreground">Opens</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Audience Growth</h3>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                  <Bar dataKey="sent" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

