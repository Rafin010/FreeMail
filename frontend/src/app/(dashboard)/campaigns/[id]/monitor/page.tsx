'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, Mail, RefreshCw } from 'lucide-react'
import { useCampaignStore } from '@/store/campaign-store'

export default function CampaignMonitorPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const campaign = useCampaignStore(state => state.campaigns.find(c => c.id === id))

  // Simulate loading analytics data
  const [isLoading, setIsLoading] = useState(true)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null
  if (!campaign) {
    return <div className="p-8 text-center text-muted-foreground">Campaign not found.</div>
  }

  // Generate fake logs based on the campaign's rawEmails
  const emails = (campaign.rawEmails || '').split('\n').filter(Boolean)
  const totalEmails = emails.length || 0
  
  // Since we don't have real webhooks yet, we assume success for the demo.
  const delivered = totalEmails
  const failed = 0
  const bounced = 0

  const deliveryLogs = emails.map((email, i) => {
    const time = new Date(new Date(campaign.date).getTime() + (i * 1200)).toLocaleString()
    return { email, status: 'Delivered', reason: '-', time }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/campaigns')}
          className="p-2 bg-card hover:bg-muted border border-border rounded-lg transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${campaign.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'}`}>
              {campaign.status === 'Sent' ? 'Completed' : 'Processing'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Monitor delivery status and view detailed email logs.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Total Attempted</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{totalEmails}</p>
            </div>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Delivered</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-500">{delivered}</p>
                <span className="text-sm text-emerald-600/70 mb-1 font-medium">{totalEmails > 0 ? Math.round((delivered/totalEmails)*100) : 0}%</span>
              </div>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-destructive mb-4">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Failed</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-destructive">{failed}</p>
                <span className="text-sm text-destructive/70 mb-1 font-medium">{totalEmails > 0 ? Math.round((failed/totalEmails)*100) : 0}%</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-600 mb-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Bounced</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-500">{bounced}</p>
                <span className="text-sm text-amber-600/70 mb-1 font-medium">{totalEmails > 0 ? Math.round((bounced/totalEmails)*100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Detailed Logs Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-bold text-foreground">Detailed Delivery Logs</h3>
              <div className="text-sm text-muted-foreground">Showing {deliveryLogs.length} records</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Recipient Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Reason / Details</th>
                    <th className="px-6 py-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deliveryLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No delivery logs found.
                      </td>
                    </tr>
                  ) : (
                    deliveryLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-foreground">{log.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            log.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                            log.status === 'Failed' ? 'bg-destructive/10 text-destructive' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {log.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                            {log.status === 'Failed' && <XCircle className="w-3 h-3" />}
                            {log.status === 'Bounced' && <AlertCircle className="w-3 h-3" />}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-[300px] truncate">
                          {log.status === 'Delivered' ? <span className="opacity-50">-</span> : <span className="font-medium text-foreground">{log.reason}</span>}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground font-mono text-xs">
                          {log.time}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
