'use client'

import React, { useState, useEffect } from 'react'
import { User, Server, Key, Save, ShieldCheck, Plus, Trash2, Mail, Info } from 'lucide-react'
import { useSession } from 'next-auth/react'

type SmtpAccount = {
  id: string
  host: string
  port: number
  user: string
  pass: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [activeTab, setActiveTab] = useState<'General' | 'SMTP' | 'API'>('General')
  const [isSaved, setIsSaved] = useState(false)
  
  // BYOE State
  const [accounts, setAccounts] = useState<SmtpAccount[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newHost, setNewHost] = useState('smtp.gmail.com')
  const [newPort, setNewPort] = useState('465')
  const [newUser, setNewUser] = useState('')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    const savedAccounts = localStorage.getItem('freemail_connected_accounts')
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts))
      } catch (e) {
        console.error('Failed to parse saved accounts')
      }
    }
  }, [])

  const saveAccounts = (newAccounts: SmtpAccount[]) => {
    setAccounts(newAccounts)
    localStorage.setItem('freemail_connected_accounts', JSON.stringify(newAccounts))
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser || !newPass) return
    const acc: SmtpAccount = {
      id: Date.now().toString(),
      host: newHost,
      port: Number(newPort),
      user: newUser,
      pass: newPass
    }
    saveAccounts([...accounts, acc])
    setIsAdding(false)
    setNewUser('')
    setNewPass('')
  }

  const removeAccount = (id: string) => {
    saveAccounts(accounts.filter(a => a.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your account and platform preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {[
              { id: 'General', icon: User, label: 'Account Profile' },
              { id: 'SMTP', icon: Server, label: 'Verified Senders (SMTP)' },
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
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-lg font-bold text-foreground">{activeTab} Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">Update your {activeTab.toLowerCase()} preferences here.</p>
          </div>

          <div className="p-6">
            
            {activeTab === 'General' && (
              <form onSubmit={handleSave} className="space-y-4 animate-in slide-in-from-right-2 duration-300">
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
                
                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <span className={`text-sm font-bold text-emerald-500 flex items-center gap-1.5 transition-opacity duration-300 ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
                    <ShieldCheck className="w-4 h-4" /> Settings Saved
                  </span>
                  <button type="submit" className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'SMTP' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-1 text-base">Bring Your Own Email (BYOE)</strong>
                    Connect your own email accounts to send campaigns directly from your verified domains. Your passwords are saved securely in your local browser storage.
                    <br/><strong className="mt-2 block opacity-80">Daily Limit Note:</strong> Free Gmail accounts support 500 emails per day. cPanel/Zoho limits vary by host.
                  </div>
                </div>

                {/* Account List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center justify-between">
                    Connected Accounts ({accounts.length})
                    {!isAdding && (
                      <button onClick={() => setIsAdding(true)} className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add New Sender
                      </button>
                    )}
                  </h3>

                  {accounts.length === 0 && !isAdding && (
                    <div className="text-center p-8 border border-dashed border-border rounded-xl bg-muted/20">
                      <p className="text-sm text-muted-foreground">No custom accounts connected yet.</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">Emails will be sent using FreeMail's shared server pool.</p>
                      <button onClick={() => setIsAdding(true)} className="inline-flex items-center gap-2 text-sm bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" /> Connect Email Account
                      </button>
                    </div>
                  )}

                  <div className="grid gap-3">
                    {accounts.map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {acc.user.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{acc.user}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1"><Server className="w-3 h-3"/> {acc.host}</span>
                              <span className="w-1 h-1 rounded-full bg-border"></span>
                              <span>Port: {acc.port}</span>
                            </p>
                          </div>
                        </div>
                        <button onClick={() => removeAccount(acc.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Remove Account">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Form */}
                {isAdding && (
                  <div className="mt-6 border border-border rounded-xl overflow-hidden bg-card shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                      <h4 className="font-bold text-sm">Add New Sender Account</h4>
                      <button onClick={() => setIsAdding(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                    </div>
                    <form onSubmit={handleAddAccount} className="p-5 space-y-4">
                      
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3 text-xs text-blue-600 dark:text-blue-400">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <strong>How to get your App Password:</strong>
                          <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                            <li><strong>Gmail / Google Workspace:</strong> Go to Google Account - Security - 2-Step Verification - App Passwords. Generate a 16-character code.</li>
                            <li><strong>Zoho Mail:</strong> Go to accounts.zoho.com - Security - App Passwords.</li>
                            <li><strong>cPanel / Hostinger:</strong> Use your <strong>Real Email Password</strong>. No app password required!</li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">SMTP Host</label>
                          <input required type="text" value={newHost} onChange={e=>setNewHost(e.target.value)} placeholder="smtp.gmail.com" className="w-full h-9 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm font-mono" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Port</label>
                          <input required type="number" value={newPort} onChange={e=>setNewPort(e.target.value)} placeholder="465" className="w-full h-9 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm font-mono" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                          <input required type="email" value={newUser} onChange={e=>setNewUser(e.target.value)} placeholder="you@domain.com" className="w-full h-9 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground">App Password (or Real Password)</label>
                          <input required type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="••••••••••••••••" className="w-full h-9 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary text-sm font-mono" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <button type="submit" className="w-full bg-primary text-primary-foreground h-10 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors">
                          Save Account
                        </button>
                      </div>
                    </form>
                  </div>
                )}
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
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
