'use client'

import React, { useState } from 'react'
import { User, Server, Key, Palette, Save, ShieldCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [activeTab, setActiveTab] = useState<'General' | 'SMTP' | 'API'>('General')
  
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and email configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {[
              { id: 'General', icon: User, label: 'Account Profile' },
              { id: 'SMTP', icon: Server, label: 'SMTP Server' },
              { id: 'API', icon: Key, label: 'API Keys' },
            ].map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-lg font-bold text-foreground">{activeTab} Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">Update your {activeTab.toLowerCase()} preferences here.</p>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            
            {activeTab === 'General' && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3 mb-6">
                  {user?.image ? (
                    <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full border border-primary/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">Google Account Linked</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Your profile is managed by Google. You cannot change these details here.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <input type="text" readOnly value={user?.name || ''} className="w-full h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground cursor-not-allowed focus:outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                  <input type="email" readOnly value={user?.email || ''} className="w-full h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground cursor-not-allowed focus:outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Timezone</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm">
                    <option>Asia/Dhaka (GMT+6)</option>
                    <option>America/New_York (GMT-5)</option>
                    <option>Europe/London (GMT+0)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'SMTP' && (
              <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex gap-3 text-sm text-emerald-600 dark:text-emerald-400 mb-6">
                  <Server className="w-5 h-5 shrink-0" />
                  <p>Your FreeMail SMTP Relay is active. Use these unique credentials in your local apps (like WordPress or local scripts) to send emails through FreeMail.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">SMTP Host</label>
                    <input type="text" readOnly value="smtp.freemail.x010.tech" className="w-full h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground font-mono text-sm cursor-not-allowed focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Port</label>
                    <input type="text" readOnly value="587 (TLS)" className="w-full h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground font-mono text-sm cursor-not-allowed focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">SMTP Username</label>
                  <input type="text" readOnly value={`fm_user_${user?.email?.split('@')[0] || 'admin'}`} className="w-full h-10 px-3 rounded-md border border-input bg-muted/50 text-foreground font-mono text-sm cursor-not-allowed focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center justify-between">
                    SMTP Password
                    <span className="text-xs text-muted-foreground font-normal">Generated securely</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="password" readOnly value="fm_sk_8f93ha82kjd82910kdla93hf" className="flex-1 h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground font-mono text-sm cursor-not-allowed focus:outline-none" />
                    <button type="button" className="px-4 h-10 bg-secondary hover:bg-muted border border-border text-foreground font-medium rounded-md text-sm transition-colors" onClick={() => navigator.clipboard.writeText('fm_sk_8f93ha82kjd82910kdla93hf')}>Copy</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'API' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Secret API Key</h3>
                  <div className="flex gap-2">
                    <input type="text" readOnly value="sk_live_51M..." className="flex-1 h-10 px-3 rounded-md border border-input bg-muted/50 text-muted-foreground text-sm font-mono" />
                    <button type="button" className="px-4 h-10 bg-secondary hover:bg-muted border border-border text-foreground font-medium rounded-md text-sm transition-colors">Copy</button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Do not share this key with anyone. It has full access to your campaigns.</p>
                </div>
                <hr className="border-border" />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Webhook URL</h3>
                  <input type="url" placeholder="https://your-domain.com/webhook" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm font-mono" />
                  <p className="text-xs text-muted-foreground mt-2">We will send POST requests here when emails are delivered or bounced.</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <span className={`text-sm font-bold text-emerald-500 flex items-center gap-1.5 transition-opacity duration-300 ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
                <ShieldCheck className="w-4 h-4" /> Settings Saved
              </span>
              <button type="submit" className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
