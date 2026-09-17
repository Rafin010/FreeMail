import { EmailBuilder } from '@/components/builder/email-builder'

export default function CampaignEditorPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">
            &larr; Back
          </button>
          <h1 className="font-semibold text-lg">Edit Campaign: Welcome Series</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-md transition-colors">
            Send Test
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary-hover shadow-sm transition-colors">
            Save & Next
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <EmailBuilder />
      </main>
    </div>
  )
}
