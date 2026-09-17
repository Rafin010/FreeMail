'use client'

import { useState } from 'react'
import { Canvas } from './canvas'
import { BuilderSidebar } from './sidebar'

export type BlockType = 'text' | 'button' | 'image' | 'spacer' | 'divider'

export interface EmailBlock {
  id: string
  type: BlockType
  content: any
  style: React.CSSProperties
}

export function EmailBuilder() {
  const [blocks, setBlocks] = useState<EmailBlock[]>([
    {
      id: 'header-1',
      type: 'text',
      content: '<h1>Welcome to FreeMail!</h1>',
      style: { padding: '20px', textAlign: 'center' }
    },
    {
      id: 'text-1',
      type: 'text',
      content: '<p>This is your new email campaign. Drag and drop blocks from the sidebar to start designing.</p>',
      style: { padding: '0 20px', color: '#4b5563' }
    },
    {
      id: 'button-1',
      type: 'button',
      content: 'Get Started',
      style: { 
        backgroundColor: '#4F46E5', 
        color: 'white', 
        padding: '12px 24px', 
        borderRadius: '6px',
        textAlign: 'center',
        display: 'inline-block',
        margin: '20px'
      }
    }
  ])

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden border-t border-border bg-muted/30">
      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <Canvas 
          blocks={blocks} 
          setBlocks={setBlocks}
          selectedBlockId={selectedBlockId}
          setSelectedBlockId={setSelectedBlockId}
        />
      </div>

      {/* Configuration Sidebar */}
      <div className="w-80 bg-card border-l border-border flex flex-col flex-shrink-0 shadow-xl z-10">
        <BuilderSidebar 
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          setBlocks={setBlocks}
        />
      </div>
    </div>
  )
}
