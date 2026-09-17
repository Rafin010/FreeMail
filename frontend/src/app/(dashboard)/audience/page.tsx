import { Button } from '@/components/ui/button'

export default function AudiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Audience</h2>
          <p className="text-muted-foreground mt-1">Manage your contacts, segments, and tags.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Import</Button>
          <Button>Add Contact</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-2">
          <h3 className="font-medium text-foreground mb-4">Recent Contacts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">JD</div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </div>
              <span className="text-xs font-medium bg-success/10 text-success px-2 py-1 rounded-md">Subscribed</span>
            </div>
            {/* More contacts can be mapped here */}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium text-foreground mb-4">Segments</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium">1,240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inactive (30 days)</span>
                <span className="font-medium">423</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-medium text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-muted text-foreground px-2 py-1 rounded-md border border-border">Customer</span>
              <span className="text-xs bg-muted text-foreground px-2 py-1 rounded-md border border-border">Newsletter</span>
              <span className="text-xs bg-muted text-foreground px-2 py-1 rounded-md border border-border">VIP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
