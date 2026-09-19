'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, MousePointerClick, Eye, Users, X, MoreVertical, Trash2 } from 'lucide-react'
import { useCampaignStore } from '@/store/campaign-store'

export default function CampaignsPage() {
  const router = useRouter()
  const campaigns = useCampaignStore(state => state.campaigns)
  const addCampaign = useCampaignStore(state => state.addCampaign)
  const deleteCampaign = useCampaignStore(state => state.deleteCampaign)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')
  const [activeTab, setActiveTab] = useState<'All' | 'Drafts' | 'Sent'>('All')
  const [mounted, setMounted] = useState(false)
  
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null)
  const [campaignToDelete, setCampaignToDelete] = useState<{id: string, name: string} | null>(null)
  
  const menuRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
    
    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenFor(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCampaignName.trim()) return
    
    const newCamp = addCampaign(newCampaignName)
    setIsModalOpen(false)
    setNewCampaignName('')
    
    // Redirect to the wizard with the ID
    router.push(`/campaigns/${newCamp.id}/edit`)
  }
  
  const confirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete.id)
      setCampaignToDelete(null)
    }
  }

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === 'All') return true
    if (activeTab === 'Drafts') return c.status === 'Draft'
    if (activeTab === 'Sent') return c.status === 'Sent'
    return true
  })

  if (!mounted) return null

  return (
    <div className="space-y-6 relative animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Campaigns</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage and track your email marketing campaigns.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm hover:scale-[1.02] transition-transform">
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        {(['All', 'Drafts', 'Sent'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'All' ? 'All Campaigns' : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <div 
          onClick={() => setIsModalOpen(true)} 
          className="cursor-pointer bg-card border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[220px] group"
        >
           <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Plus className="w-6 h-6" />
           </div>
           <h3 className="font-semibold text-foreground">New Campaign</h3>
           <p className="text-sm text-muted-foreground mt-1">Start a new email campaign</p>
        </div>

        {/* Existing Campaigns */}
        {filteredCampaigns.map(c => (
          <div key={c.id} className="relative bg-card border border-border hover:border-foreground/20 hover:shadow-md transition-all rounded-xl flex flex-col min-h-[220px]">
            {/* Clickable Area for Navigation */}
            <div 
              onClick={(e) => {
                // Navigate only if the click wasn't on the menu button
                if (!(e.target as HTMLElement).closest('.menu-button-area')) {
                  router.push(`/campaigns/${c.id}/${c.status === 'Sent' ? 'monitor' : 'edit'}`)
                }
              }}
              className="flex-1 p-6 flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="pr-8">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Last edited: {c.date}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${c.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-foreground'}`}>
                  {c.status}
                </span>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-4">
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> Sent</span>
                   <span className="font-semibold text-sm">{c.sent || 0}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3"/> Opens</span>
                   <span className="font-semibold text-sm">{c.opens || 0}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-muted-foreground flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> Clicks</span>
                   <span className="font-semibold text-sm">{c.clicks || 0}</span>
                 </div>
              </div>
            </div>

            {/* 3 Dot Menu Button */}
            <div className="absolute top-5 right-4 menu-button-area z-10" ref={menuOpenFor === c.id ? menuRef : null}>
              <button 
                onClick={() => setMenuOpenFor(menuOpenFor === c.id ? null : c.id)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown */}
              {menuOpenFor === c.id && (
                <div className="absolute right-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => {
                      setMenuOpenFor(null)
                      setCampaignToDelete({id: c.id, name: c.name})
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-lg text-foreground">Create New Campaign</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">Campaign Name</label>
              <input 
                type="text" 
                autoFocus
                placeholder="e.g., Summer Sale 2026"
                className="w-full h-11 px-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                value={newCampaignName}
                onChange={e => setNewCampaignName(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={!newCampaignName.trim()}>Create & Continue</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {campaignToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-destructive/5 text-destructive">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Trash2 className="w-5 h-5" /> Delete Campaign</h3>
              <button onClick={() => setCampaignToDelete(null)} className="p-1 hover:bg-destructive/10 rounded-md transition-colors text-destructive hover:text-destructive/80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-foreground mb-1">Are you sure you want to delete this campaign?</p>
              <p className="font-bold text-foreground bg-muted/50 py-2 px-3 rounded-md mt-3 inline-block break-all">"{campaignToDelete.name}"</p>
              <p className="text-sm text-muted-foreground mt-4">This action cannot be undone. All data and stats will be permanently removed.</p>
              
              <div className="flex gap-3 justify-end mt-8">
                <Button type="button" variant="outline" onClick={() => setCampaignToDelete(null)}>Cancel</Button>
                <Button type="button" variant="destructive" onClick={confirmDelete}>Yes, Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
