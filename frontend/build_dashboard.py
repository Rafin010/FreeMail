import os

content = r'''import Link from 'next/link'
import { Users, Mail, ArrowUpRight, Plus, ExternalLink } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Overview Stats */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <Link 
            href="/campaigns/new" 
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Audiences</h3>
                <span className="text-3xl font-bold text-foreground mt-2 block">14,248</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-500"><Users className="w-5 h-5" /></div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Emails Sent</h3>
                <span className="text-3xl font-bold text-foreground mt-2 block">82,420</span>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-500"><Mail className="w-5 h-5" /></div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Avg. Open Rate</h3>
                <span className="text-3xl font-bold text-foreground mt-2 block">28.4%</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-500"><ArrowUpRight className="w-5 h-5" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <h2 className="text-lg font-semibold text-foreground mb-4">Recent Campaigns</h2>
           <div className="space-y-4">
             {[
               {name: 'Black Friday Super Sale', date: 'Just now', sent: 0, status: 'Draft'},
               {name: 'Welcome Series V1', date: '2 days ago', sent: 450, status: 'Sent'}
             ].map((c, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-medium text-sm text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">{c.status}</span>
                    <Link href="/campaigns" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
               </div>
             ))}
           </div>
           <Link href="/campaigns" className="block text-center text-sm text-primary font-medium mt-6 hover:underline">
             View all campaigns
           </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
             <Plus className="w-8 h-8 text-muted-foreground" />
           </div>
           <h3 className="font-semibold text-foreground text-lg mb-2">Create a new campaign</h3>
           <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
             Engage your audience with beautifully designed emails using our new professional builder.
           </p>
           <Link 
             href="/campaigns/new" 
             className="bg-foreground text-background px-6 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
           >
             Start Building
           </Link>
        </div>
      </div>
      
    </div>
  )
}
'''

with open(r'e:\_FreeMail\frontend\src\app\(dashboard)\dashboard\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
