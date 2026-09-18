'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'
import { FontSize } from './extensions/font-size'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Image as ImageIcon, 
  Palette, ChevronDown, Paperclip
} from 'lucide-react'

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
]

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
]

type RichTextEditorProps = {
  content: string
  onChange: (val: string) => void
  onAttachment?: (file: { name: string; size: number; type: string; url: string }) => void
}

export default function RichTextEditor({ content, onChange, onAttachment }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      })
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4 bg-white',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editor) {
      const isImage = file.type.startsWith('image/')
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        if (isImage) {
          // Add image inline
          editor.chain().focus().setImage({ src: base64 }).run()
        } else {
          // Pass non-images to parent as an attachment box
          if (onAttachment) {
             onAttachment({
               name: file.name,
               size: file.size,
               type: file.type || 'unknown',
               url: base64
             })
          }
        }
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) {
       fileInputRef.current.value = ''
    }
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !editor) {
    return <div className="border border-input rounded-xl bg-white overflow-hidden shadow-sm flex flex-col min-h-[400px]"></div>
  }

  const ToolbarButton = ({ isActive, onClick, children, title }: any) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-input rounded-xl bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Upper Professional Toolbar */}
      <div className="border-b border-input bg-zinc-50/90 px-3 py-2 flex items-center gap-3 flex-wrap">
          
        {/* Font Family */}
        <div className="relative">
          <select
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontFamily || ''}
            className="appearance-none bg-white border border-input text-sm text-zinc-700 hover:bg-zinc-50 py-1.5 pl-3 pr-8 rounded-md outline-none cursor-pointer shadow-sm"
          >
            <option value="" disabled>Font Family</option>
            {FONT_FAMILIES.map(f => (
              <option key={f.name} value={f.value}>{f.name}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
        </div>

        {/* Font Size */}
        <div className="relative">
          <select
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontSize || ''}
            className="appearance-none bg-white border border-input text-sm text-zinc-700 hover:bg-zinc-50 py-1.5 pl-2 pr-7 rounded-md outline-none cursor-pointer shadow-sm"
          >
            <option value="" disabled>Size</option>
            {FONT_SIZES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
        </div>

        <div className="w-px h-5 bg-input mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="relative flex items-center justify-center w-7 h-7 hover:bg-zinc-100 rounded-md transition-colors" title="Text Color">
            <input 
              type="color" 
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Palette className="w-4 h-4 text-zinc-600" />
            <div 
              className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
            />
          </div>
        </div>

        <div className="w-px h-5 bg-input mx-1" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-input mx-1" />

        {/* Uploads */}
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            className="sr-only" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-md transition-colors border border-zinc-200 shadow-sm"
          >
            <Paperclip className="w-3.5 h-3.5" /> Attach File
          </button>
        </div>
        
        <div className="w-px h-5 bg-input mx-1" />

        {/* Variables */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vars:</span>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('{{first_name}}').run()}
            className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors"
          >
            &#123;&#123;First Name&#125;&#125;
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().insertContent('{{last_name}}').run()}
            className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors"
          >
            &#123;&#123;Last Name&#125;&#125;
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-zinc-50/30 p-2">
        <div className="bg-white rounded-lg border border-zinc-100 shadow-sm overflow-hidden min-h-[400px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
