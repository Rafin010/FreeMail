import { Button } from '@/components/ui/button'

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Campaigns</h2>
          <p className="text-muted-foreground mt-1">Manage and track your email marketing campaigns.</p>
        </div>
        <Button>+ Create Campaign</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        <button className="pb-3 border-b-2 border-primary font-medium text-foreground">All Campaigns</button>
        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">Drafts</button>
        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">Scheduled</button>
        <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium">Sent</button>
      </div>

      {/* Empty State */}
      <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No campaigns yet</h3>
        <p className="text-muted-foreground max-w-sm mt-2 mb-6">Create your first campaign to start engaging with your audience and driving results.</p>
        <Button>Create your first campaign</Button>
      </div>
    </div>
  )
}
