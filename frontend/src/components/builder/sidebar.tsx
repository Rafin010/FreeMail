'use client'

import { EmailBlock } from './email-builder'

interface BuilderSidebarProps {
  blocks: EmailBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>
  selectedBlockId: string | null
}

export function BuilderSidebar({ blocks, setBlocks, selectedBlockId }: BuilderSidebarProps) {
  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
        <h3 className="font-semibold text-foreground">
          {selectedBlock ? 'Edit Block' : 'Blocks'}
        </h3>
        {selectedBlock && (
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedBlock ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Content</label>
              {selectedBlock.type === 'text' && (
                <textarea 
                  className="w-full min-h-[120px] p-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedBlock.content}
                  onChange={(e) => {
                    setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b))
                  }}
                />
              )}
              {selectedBlock.type === 'button' && (
                <input 
                  type="text"
                  className="w-full p-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedBlock.content}
                  onChange={(e) => {
                    setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, content: e.target.value } : b))
                  }}
                />
              )}
            </div>
            
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Padding</label>
              <input 
                type="text"
                className="w-full p-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedBlock.style.padding as string || ''}
                placeholder="e.g. 20px"
                onChange={(e) => {
                  setBlocks(blocks.map(b => b.id === selectedBlock.id ? { ...b, style: { ...b.style, padding: e.target.value } } : b))
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-200">
            {/* Draggable Block Icons (Mock for now) */}
            {[
              { type: 'text', label: 'Text', icon: 'T' },
              { type: 'button', label: 'Button', icon: 'B' },
              { type: 'image', label: 'Image', icon: 'img' },
              { type: 'divider', label: 'Divider', icon: '—' },
              { type: 'spacer', label: 'Spacer', icon: '[]' },
            ].map((tool) => (
              <div 
                key={tool.type} 
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card hover:border-primary hover:text-primary cursor-grab transition-colors"
              >
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold mb-2">
                  {tool.icon}
                </div>
                <span className="text-xs font-medium">{tool.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
