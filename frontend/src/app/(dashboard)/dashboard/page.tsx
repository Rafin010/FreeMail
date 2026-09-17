'use client'

import { useState } from 'react'
import { Send, Users, FileText, Type, Mail, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
  const [campaignName, setCampaignName] = useState('')
  const [emails, setEmails] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null)

  const handleSend = async () => {
    if (!campaignName || !emails || !message) {
      setStatus({ type: 'error', msg: 'Please fill all fields before sending.' })
      return
    }
    
    setIsSending(true)
    setStatus(null)
    
    // Simulate sending delay
    setTimeout(() => {
      setIsSending(false)
      setStatus({ type: 'success', msg: 'Campaign started! Emails are being sent automatically.' })
    }, 2000)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Overview Stats */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground mb-4">Dashboard Overview</h1>
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
              <div className="p-3 rounded-lg bg-success/10 text-success"><ArrowUpRight className="w-5 h-5" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Send New Campaign</h2>
        <p className="text-muted-foreground text-sm mt-1">Create your campaign, paste emails, and send instantly.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Campaign Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <Type className="w-4 h-4 text-primary" />
            Campaign Name
          </label>
          <input 
            type="text" 
            placeholder="e.g., Eid Discount Offer" 
            className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>

        {/* Target Emails */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <Users className="w-4 h-4 text-primary" />
            Target Email Addresses (One per line)
          </label>
          <textarea 
            placeholder="user1@example.com&#10;user2@example.com" 
            className="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-y"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">Paste all the email addresses you want to send this message to.</p>
        </div>

        {/* Message Body */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <FileText className="w-4 h-4 text-primary" />
            Email Message
          </label>
          <textarea 
            placeholder="Write your email message here..." 
            className="w-full min-h-[200px] p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-y"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Status Message */}
        {status && (
          <div className={`p-4 rounded-lg font-medium text-sm ${status.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {status.msg}
          </div>
        )}

        {/* Send Button */}
        <div className="pt-4 border-t border-border">
          <button 
            onClick={handleSend}
            disabled={isSending}
            className="w-full flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary-hover shadow-md transition-all disabled:opacity-70"
          >
            {isSending ? (
              <span className="animate-pulse">Sending Emails...</span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Run Campaign & Send Emails
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

