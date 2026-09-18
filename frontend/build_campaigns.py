import os

content = r''''use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, MousePointerClick, Eye, Users, X } from 'lucide-react'
import { useCampaignStore } from '@/store/campaign-store'

export default function CampaignsPage() {
  const router = useRouter()
  const campaigns = useCampaignStore(state => state.campaigns)
  const addCampaign = useCampaignStore(state => state.addCampaign)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCampaignName, setNewCampaignName] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCampaignName.trim()) return
    
    const newCamp = addCampaign(newCampaignName)
    setIsModalOpen(false)
    setNewCampaignName('')
    
    // Redirect to the wizard with the ID
    router.push(/campaigns//edit)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Campaigns</h2>
          <p className="text-muted-foreground mt-1">Manage and track your email marketing campaigns.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button className="pb-3 border-b-2 border-primary font-medium text-foreground">All Campaigns</button>
        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">Drafts</button>
        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">Sent</button>
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
        {campaigns.map(c => (
          <Link key={c.id} href={/campaigns//edit} className="bg-card border border-border hover:border-foreground/20 hover:shadow-md transition-all rounded-xl p-6 flex flex-col min-h-[220px]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Last edited: {c.date}</p>
              </div>
              <span className={	ext-xs font-medium px-2 py-1 rounded-md }>
                {c.status}
              </span>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-4">
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> Sent</span>
                 <span className="font-semibold text-sm">{c.sent}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3"/> Opens</span>
                 <span className="font-semibold text-sm">{c.opens}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> Clicks</span>
                 <span className="font-semibold text-sm">{c.clicks}</span>
               </div>
            </div>
          </Link>
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

    </div>
  )
}
'''

os.makedirs(r'e:\_FreeMail\frontend\src\app\(dashboard)\campaigns', exist_ok=True)
with open(r'e:\_FreeMail\frontend\src\app\(dashboard)\campaigns\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success Campaigns')
