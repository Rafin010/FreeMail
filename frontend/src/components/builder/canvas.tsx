'use client'

import { EmailBlock } from './email-builder'

interface CanvasProps {
  blocks: EmailBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<EmailBlock[]>>
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void
}

export function Canvas({ blocks, setBlocks, selectedBlockId, setSelectedBlockId }: CanvasProps) {
  return (
    <div className="w-full max-w-[600px] min-h-[800px] bg-white shadow-sm border border-border/50 rounded-md relative">
      <div className="absolute -top-10 left-0 right-0 flex justify-between text-sm text-muted-foreground font-medium">
        <span>Desktop Preview</span>
        <span>600px width</span>
      </div>
      
      <div className="flex flex-col w-full h-full p-0">
        {blocks.map((block) => (
          <div 
            key={block.id}
            onClick={() => setSelectedBlockId(block.id)}
            className={`relative group cursor-pointer border-2 transition-colors ${
              selectedBlockId === block.id 
                ? 'border-primary' 
                : 'border-transparent hover:border-border/80'
            }`}
          >
            {/* Block Hover Actions */}
            <div className="absolute -top-3 -right-3 hidden group-hover:flex items-center bg-primary text-primary-foreground rounded-md shadow-sm overflow-hidden text-xs z-10">
              <button className="px-2 py-1 hover:bg-primary-hover">Move</button>
              <button className="px-2 py-1 hover:bg-primary-hover">Clone</button>
              <button className="px-2 py-1 bg-destructive hover:bg-destructive/90">Del</button>
            </div>

            {/* Block Content Render */}
            <div className="w-full" style={block.type !== 'button' ? block.style : { textAlign: block.style.textAlign }}>
              {block.type === 'text' && (
                <div dangerouslySetInnerHTML={{ __html: block.content }} />
              )}
              {block.type === 'button' && (
                <a href="#" style={block.style} className="font-sans no-underline">
                  {block.content}
                </a>
              )}
              {block.type === 'image' && (
                <div className="w-full bg-muted flex items-center justify-center p-8 text-muted-foreground border-2 border-dashed border-border/50">
                  Image Placeholder
                </div>
              )}
              {block.type === 'spacer' && (
                <div style={{ height: block.style.height || '20px' }} />
              )}
              {block.type === 'divider' && (
                <hr style={{ borderTop: `1px solid ${block.style.borderColor || '#e5e7eb'}`, margin: block.style.margin || '20px 0' }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
