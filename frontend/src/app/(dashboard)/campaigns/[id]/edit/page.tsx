'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, Mail, Upload, X, Trash2, ShieldAlert, ShieldCheck, FileText, Image as ImageIcon, FileArchive, FileSpreadsheet, File as FileIcon, Palette, Link2 } from 'lucide-react'
import RichTextEditor from '@/components/shared/rich-text-editor'
import { useCampaignStore } from '@/store/campaign-store'

const TEMPLATES = [
  { id: 'blank', name: 'Blank', html: '<p></p>' },
  { id: 'newsletter', name: 'Newsletter', html: '<h1 style="text-align: center">Your Monthly Digest</h1><p>Hi {{first_name}},</p><p>Here is what happened this month...</p>' },
  { id: 'promo', name: 'Promo/Sale', html: '<h1 style="text-align: center; color: #e11d48">50% OFF FLASH SALE</h1><p style="text-align: center">Hurry up! Grab your favorite items before they run out.</p>' },
  { id: 'personal', name: 'Personal', html: '<p>Hey {{first_name}},</p><p>Just wanted to quickly check in and see how things are going with your recent project.</p><p>Best,<br>Your Name</p>' }
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getFileIcon = (filename: string, type: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon className="w-5 h-5 text-blue-500" />;
  if (['pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />;
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) return <FileArchive className="w-5 h-5 text-yellow-600" />;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
  if (['doc', 'docx', 'txt'].includes(ext)) return <FileText className="w-5 h-5 text-blue-600" />;
  return <FileIcon className="w-5 h-5 text-zinc-500" />;
}

export default function CampaignEditWizard() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const campaign = useCampaignStore(state => state.campaigns.find(c => c.id === id))
  const updateCampaign = useCampaignStore(state => state.updateCampaign)

  const [step, setStep] = useState(1)
  
  // Local State mapped to Store
  const [subjectLine, setSubjectLine] = useState(campaign?.subjectLine || '')
  const [messageBody, setMessageBody] = useState(campaign?.messageBody || '<p>Write your email here...</p>')
  const [buttonText, setButtonText] = useState(campaign?.buttonText || '')
  const [buttonUrl, setButtonUrl] = useState(campaign?.buttonUrl || '')
  const [theme, setTheme] = useState(campaign?.theme || 'professional')
  const [companyName, setCompanyName] = useState(campaign?.companyName || 'FreeMail Co.')
  const [companyAddress, setCompanyAddress] = useState(campaign?.companyAddress || '123 Business Avenue, Tech City, 10001')
  const [copyrightText, setCopyrightText] = useState(campaign?.copyrightText || '© 2026 FreeMail Inc. All rights reserved.')
  const [unsubscribeText, setUnsubscribeText] = useState(campaign?.unsubscribeText || 'Unsubscribe from this list')
  
  // New Styling Fields
  const [headerBgColor, setHeaderBgColor] = useState(campaign?.headerBgColor || '#ffffff')
  const [bodyBgColor, setBodyBgColor] = useState(campaign?.bodyBgColor || '#f4f4f5')
  const [paperBgColor, setPaperBgColor] = useState('#ffffff')
  const [buttonBgColor, setButtonBgColor] = useState('#000000')
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff')
  const [logoUrl, setLogoUrl] = useState(campaign?.logoUrl || '')

  // Audience State
  const [emails, setEmails] = useState<string[]>((campaign?.rawEmails || '').split('\n').filter(Boolean))
  const [emailInput, setEmailInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [errorToast, setErrorToast] = useState<string | null>(null)
  
  // Connected Accounts State (BYOE)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('default')

  // Attachments State
  const [attachments, setAttachments] = useState<{name: string, size: number, type: string, url: string}[]>(campaign?.attachments || [])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('freemail_connected_accounts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConnectedAccounts(parsed)
        if (parsed.length > 0) setSelectedAccountId(parsed[0].id)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Auto-save on unmount or step change
  useEffect(() => {
    return () => {
      updateCampaign(id, {
        subjectLine, messageBody, buttonText, buttonUrl, theme,
        companyName, companyAddress, copyrightText, unsubscribeText,
        rawEmails: emails.join('\n'),
        attachments, headerBgColor, bodyBgColor, logoUrl,
        paperBgColor, buttonBgColor, buttonTextColor
      })
    }
  }, [id, subjectLine, messageBody, buttonText, buttonUrl, theme, companyName, companyAddress, copyrightText, unsubscribeText, emails, attachments, headerBgColor, bodyBgColor, logoUrl, paperBgColor, buttonBgColor, buttonTextColor, updateCampaign])

  const [isSending, setIsSending] = useState(false)

  const handleLaunchCampaign = async () => {
    if (emails.length === 0) {
      showError('Please add at least one recipient.')
      return
    }
    
    setIsSending(true)
    
    try {
      const finalHtml = `
        <div style="background-color: ${bodyBgColor}; padding: 40px 20px; font-family: sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: ${headerBgColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="display: inline-block; vertical-align: middle;">
              ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="max-height: 60px; max-width: 250px; object-fit: contain; display: inline-block; vertical-align: middle;" />` : ''}
              ${(!logoUrl || companyName) ? `<h2 style="margin: 0 0 0 ${logoUrl ? '12px' : '0'}; display: inline-block; vertical-align: middle; color: ${headerBgColor === '#ffffff' ? '#000' : '#fff'}; font-size: 24px;">${companyName}</h2>` : ''}
            </div>
          </div>
          <div style="max-width: 600px; margin: 0 auto; background-color: ${paperBgColor}; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            ${messageBody}
            ${buttonText && buttonUrl ? `
              <div style="text-align: center; margin-top: 30px;">
                <a href="${buttonUrl}" style="display: inline-block; padding: 12px 24px; background-color: ${buttonBgColor}; color: ${buttonTextColor}; text-decoration: none; border-radius: 6px; font-weight: bold;">${buttonText}</a>
              </div>
            ` : ''}
          </div>
          <div style="max-width: 600px; margin: 20px auto 0; text-align: center; font-size: 12px; color: #888;">
            <p>${companyName}<br>${companyAddress}</p>
            <p>${copyrightText}</p>
            <p><a href="#" style="color: #888; text-decoration: underline;">${unsubscribeText}</a></p>
          </div>
        </div>
      `;

      let customSmtp = undefined;
      if (selectedAccountId !== 'default') {
        const acc = connectedAccounts.find(a => a.id === selectedAccountId);
        if (acc) customSmtp = acc;
      }

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emails,
          subject: subjectLine || 'FreeMail Campaign',
          html: finalHtml,
          fromName: companyName || campaign?.name || 'FreeMail',
          customSmtp
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        updateCampaign(id, { 
          status: 'Sent',
          sent: emails.length,
          subjectLine, messageBody, buttonText, buttonUrl, theme,
          companyName, companyAddress, copyrightText, unsubscribeText,
          rawEmails: emails.join('\n'),
          attachments, headerBgColor, bodyBgColor, logoUrl
        })
        router.push(`/campaigns/${id}/monitor`)
      } else {
        showError(data.error || 'Failed to send emails. Please check your SMTP settings in .env.')
      }
    } catch (error) {
      showError('Failed to send emails. Make sure your internet connection is working.')
    } finally {
      setIsSending(false)
    }
  }

  const showError = (msg: string) => {
    setErrorToast(msg)
    setTimeout(() => setErrorToast(null), 3000)
  }

  const handleAddEmails = (newEmails: string[]) => {
    let added = 0
    let duplicates = 0
    
    setEmails(prev => {
      const currentSet = new Set(prev)
      const nextList = [...prev]
      
      newEmails.forEach(e => {
        const cleanEmail = e.trim().toLowerCase()
        if (!cleanEmail) return
        
        if (currentSet.has(cleanEmail)) {
          duplicates++
        } else {
          currentSet.add(cleanEmail)
          nextList.push(cleanEmail)
          added++
        }
      })
      
      if (duplicates > 0 && added === 0) {
        showError(`${duplicates} duplicate emails ignored!`)
      } else if (duplicates > 0) {
        showError(`Added ${added} emails. Ignored ${duplicates} duplicates.`)
      }
      
      return nextList
    })
  }

  const handleEmailInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmails(emailInput.split(/[\s,]+/))
      setEmailInput('')
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(prev => prev.filter(e => e !== emailToRemove))
  }

  const removeInvalid = () => {
    setEmails(prev => prev.filter(e => EMAIL_REGEX.test(e)))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      // Extract only valid emails using Regex
      const extracted = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
      if (extracted.length === 0) {
        showError('No valid emails found in the file.')
      } else {
        handleAddEmails(extracted)
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const extracted = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
      if (extracted.length === 0) {
        showError('No valid emails found in the file.')
      } else {
        handleAddEmails(extracted)
      }
    }
    reader.readAsText(file)
  }

  if (!mounted) return null
  if (!campaign) return <div className="p-8 text-center text-muted-foreground">Campaign not found</div>

  const validCount = emails.filter(e => EMAIL_REGEX.test(e)).length
  const invalidCount = emails.length - validCount

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col relative">
      
      {errorToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm animate-in slide-in-from-top-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          {errorToast}
        </div>
      )}

      {/* Glassmorphism Stepper Header */}
      <div className="sticky top-0 bg-card/60 backdrop-blur-xl border-b border-border p-4 sm:p-5 shrink-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar mask-edges">
          {[
            { num: 1, label: 'Content & Design' },
            { num: 2, label: 'Target Audience' },
            { num: 3, label: 'Review & Run' }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center gap-3 transition-opacity ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > s.num ? 'bg-primary text-primary-foreground' :
                  step === s.num ? 'bg-foreground text-background shadow-md' : 
                  'bg-background border border-border'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30" />}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg">
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleLaunchCampaign}
              disabled={isSending}
              className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary-hover transition-opacity shadow-lg animate-pulse disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Launch Campaign'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-background">
        {step === 1 && (
          <div className="absolute inset-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            {/* Left Panel: Editor & Settings */}
            <div className="w-full lg:w-1/2 lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 space-y-8 pb-12 lg:pb-32 lg:overflow-y-auto custom-scrollbar">
              
              <div className="bg-muted/30 p-5 rounded-xl border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">Campaign Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Campaign Name</label>
                    <input 
                      type="text" 
                      disabled
                      value={campaign.name}
                      className="w-full h-10 px-3 bg-muted text-muted-foreground border border-input rounded-md text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Theme Base</label>
                    <div className="flex bg-muted p-1 rounded-md border border-input">
                      {['minimal', 'professional', 'dark'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTheme(t as any)}
                          className={`flex-1 text-xs font-bold py-1.5 rounded ${theme === t ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Header & Colors */}
              <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Header & Colors
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">Header Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={headerBgColor} onChange={e => setHeaderBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      <input type="text" value={headerBgColor} onChange={e => setHeaderBgColor(e.target.value)} className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-input rounded uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">App Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={bodyBgColor} onChange={e => setBodyBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      <input type="text" value={bodyBgColor} onChange={e => setBodyBgColor(e.target.value)} className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-input rounded uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">Email Paper Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={paperBgColor} onChange={e => setPaperBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      <input type="text" value={paperBgColor} onChange={e => setPaperBgColor(e.target.value)} className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-input rounded uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">Button Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={buttonBgColor} onChange={e => setButtonBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      <input type="text" value={buttonBgColor} onChange={e => setButtonBgColor(e.target.value)} className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-input rounded uppercase font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground">Button Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={buttonTextColor} onChange={e => setButtonTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                      <input type="text" value={buttonTextColor} onChange={e => setButtonTextColor(e.target.value)} className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-input rounded uppercase font-mono" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Logo (URL or Upload)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full h-9 pl-9 pr-3 text-sm bg-background border border-input rounded-md focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">OR</span>
                    <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="sr-only" />
                    <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="h-9 px-4 bg-secondary hover:bg-muted text-foreground text-xs font-bold rounded-md border border-border flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    {logoUrl && (
                      <button 
                        onClick={() => setLogoUrl('')}
                        className="h-9 px-3 text-destructive hover:bg-destructive/10 rounded-md border border-transparent hover:border-destructive/20"
                        title="Clear Logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Sender Profile (From Email)</label>
                <select 
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full h-11 px-4 mb-6 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm font-medium disabled:opacity-50"
                  disabled={connectedAccounts.length === 0}
                >
                  {connectedAccounts.length === 0 ? (
                    <option value="">⚠️ No email accounts connected</option>
                  ) : (
                    connectedAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        📧 {acc.user} ({acc.host === 'smtp.gmail.com' ? '500/day' : 'Custom Limit'})
                      </option>
                    ))
                  )}
                </select>
                {connectedAccounts.length === 0 && (
                  <p className="text-xs text-destructive mt-1 mb-6 -translate-y-4">You must connect an email in Settings to send campaigns.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Subject Line</label>
                <input 
                  type="text" 
                  placeholder="Huge discounts inside!"
                  className="w-full h-11 px-4 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm font-medium"
                  value={subjectLine}
                  onChange={e => setSubjectLine(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold">Message Body</label>
                  <div className="flex gap-2">
                    {TEMPLATES.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setMessageBody(t.html)}
                        className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 bg-secondary hover:bg-secondary-hover text-foreground rounded-md shadow-sm border border-border"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <RichTextEditor 
                  content={messageBody}
                  onChange={setMessageBody}
                  onAttachment={(file) => setAttachments(prev => [...prev, file])}
                />
                
                {/* Professional Attachment Box Render */}
                {attachments.length > 0 && (
                  <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">Attachments ({attachments.length})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-background hover:bg-muted/30 border border-border rounded-lg relative group transition-colors">
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                            {getFileIcon(file.name, file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground pr-6" title={file.name}>{file.name}</p>
                            <p className="text-xs text-muted-foreground font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button 
                            onClick={() => setAttachments(prev => prev.filter((_, index) => index !== i))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-border"
                            title="Remove attachment"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Button Text</label>
                  <input 
                    type="text" 
                    placeholder="Visit Website"
                    className="w-full h-10 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    value={buttonText}
                    onChange={e => setButtonText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Button URL</label>
                  <input 
                    type="text" 
                    placeholder="https://"
                    className="w-full h-10 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    value={buttonUrl}
                    onChange={e => setButtonUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-border space-y-4">
                <h3 className="text-sm font-bold">Email Footer Elements</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Company Address</label>
                    <input 
                      type="text" 
                      className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm"
                      value={companyAddress}
                      onChange={e => setCompanyAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Copyright Text</label>
                    <input 
                      type="text" 
                      className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm"
                      value={copyrightText}
                      onChange={e => setCopyrightText(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Unsubscribe Text</label>
                    <input 
                      type="text" 
                      className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm"
                      value={unsubscribeText}
                      onChange={e => setUnsubscribeText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>

              {/* Right Panel: Live Preview */}
              <div className="w-full lg:w-1/2 lg:h-full bg-zinc-950 p-4 sm:p-8 flex items-start lg:items-center justify-center lg:overflow-y-auto min-h-[500px] lg:min-h-0 shrink-0">
               <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-full">
                 
                 {/* Browser Mockup Top Bar */}
                 <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 gap-2 shrink-0">
                   <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
                   <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
                   <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm"></div>
                   <div className="ml-4 text-xs font-medium text-zinc-500 flex-1 text-center pr-10">Live Preview</div>
                 </div>

                   {/* Simulated Email Client Viewport */}
                   <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar" style={{ backgroundColor: bodyBgColor }}>
                     <div className={`w-full max-w-lg mx-auto rounded-lg shadow-sm overflow-hidden border ${
                       theme==='dark' ? 'border-zinc-800 text-white' : 
                       theme==='minimal' ? 'border-gray-100 text-gray-900' : 
                       'border-gray-200 text-gray-900'}
                     `} style={{ backgroundColor: paperBgColor }}>
                        {/* Email Header */}
                        <div className={`py-4 px-6 flex items-center justify-center`} style={{ backgroundColor: headerBgColor }}>
                          <div className="flex items-center gap-3">
                            {logoUrl && (
                              <img src={logoUrl} alt="Logo" className="max-h-12 max-w-[200px] object-contain" />
                            )}
                            {(!logoUrl || companyName) && (
                              <span className="font-bold text-xl mix-blend-difference" style={{ color: headerBgColor === '#ffffff' ? '#000' : '#fff' }}>
                                {companyName || (logoUrl ? '' : 'FreeMail Co.')}
                              </span>
                            )}
                          </div>
                        </div>
  
                        {/* Email Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                          <h1 className="text-2xl font-extrabold tracking-tight opacity-90">
                            {subjectLine || 'Your Subject Line Will Appear Here'}
                          </h1>
  
                          <div 
                            className="prose prose-sm max-w-none opacity-90"
                            dangerouslySetInnerHTML={{ __html: messageBody || 'Write your email here...' }}
                          />
                          
                          {/* Live Preview Attachment Boxes */}
                          {attachments.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
                              <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-50">Attachments</p>
                              <div className="flex flex-wrap gap-3">
                                {attachments.map((file, i) => (
                                  <a key={i} href={file.url} download={file.name} className={`flex items-center gap-3 p-3 rounded-lg border ${theme==='dark'?'border-zinc-800 bg-zinc-900 hover:bg-zinc-800':'border-gray-200 bg-gray-50 hover:bg-gray-100'} shadow-sm max-w-xs transition-colors cursor-pointer group`}>
                                    <div className={`w-10 h-10 ${theme==='dark'?'bg-zinc-950':'bg-white'} rounded-md flex items-center justify-center shrink-0 border ${theme==='dark'?'border-zinc-800':'border-gray-200'}`}>
                                      {getFileIcon(file.name, file.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                      <p className={`text-sm font-semibold truncate ${theme==='dark'?'text-white':'text-gray-900'} group-hover:underline`}>{file.name}</p>
                                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* CTA Button */}
                          {buttonText && (
                            <div className="mt-8">
                              <a href={buttonUrl || "#"} className={`inline-block px-6 py-2.5 font-medium text-sm rounded-md shadow-sm`} style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
                                {buttonText}
                              </a>
                          </div>
                        )}
                      </div>

                      {/* Email Footer */}
                      <div className={`p-6 text-center ${theme==='dark' ? 'bg-zinc-950 border-t border-zinc-900' : 'bg-zinc-50 border-t border-gray-100'}`}>
                         {theme === 'professional' && <div className="mt-4" />}
                         <p className="text-[10px] text-zinc-500 mb-1" dangerouslySetInnerHTML={{ __html: copyrightText }}></p>
                         <p className="text-[10px] text-zinc-500">{companyAddress}</p>
                         <a href="#" className="text-[10px] text-zinc-500 mt-4 inline-block underline hover:text-zinc-400">{unsubscribeText}</a>
                      </div>

                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 flex p-4 sm:p-6 bg-background overflow-y-auto pb-32">
             <div className="w-full max-w-5xl mx-auto space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Drag and Drop Box */}
                  <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-foreground mb-4">Upload Recipient List (CSV/TXT)</h2>
                    <div 
                      className={`flex-1 border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/40'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className={`w-10 h-10 mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-base font-semibold text-foreground">Drag and drop your file here</p>
                      <p className="text-sm text-muted-foreground mt-2">Supports .csv and .txt files</p>
                    </div>
                    <input type="file" accept=".txt,.csv" ref={fileInputRef} onChange={handleFileUpload} className="sr-only" />
                  </div>

                  {/* 2. Manual Text Area */}
                  <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-foreground mb-4">Manually Enter Emails</h2>
                    <textarea 
                      className="flex-1 w-full p-4 bg-muted/20 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm font-mono placeholder:text-muted-foreground/50 resize-none"
                      placeholder="Paste emails here (separated by commas or newlines)..."
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailInputKeyDown}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => {
                          handleAddEmails(emailInput.split(/[\s,]+/));
                          setEmailInput('');
                        }}
                        className="px-6 py-2.5 bg-foreground text-background text-sm font-bold rounded-md hover:opacity-90 transition-opacity w-full sm:w-auto shadow-sm"
                      >
                        Add to List
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. The Email List / Chips */}
                <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4 text-sm font-medium">
                      <span className="text-emerald-500 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> {validCount} Valid</span>
                      <span className="text-destructive flex items-center gap-1.5"><ShieldAlert className="w-4 h-4"/> {invalidCount} Invalid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={removeInvalid} className="text-xs px-4 py-1.5 rounded-md bg-secondary text-foreground hover:bg-muted font-medium flex items-center gap-1">
                        Clean Invalid
                      </button>
                      <button onClick={() => setEmails([])} className="text-xs px-4 py-1.5 rounded-md text-destructive hover:bg-destructive/10 font-medium flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-muted/20 border border-border rounded-lg p-4 overflow-y-auto custom-scrollbar">
                    {emails.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                        No emails added yet. Upload a file or paste emails above.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 items-start content-start">
                        {emails.map((e, i) => {
                          const isValid = EMAIL_REGEX.test(e)
                          return (
                            <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border font-medium shadow-sm transition-colors ${isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400'}`}>
                              {e}
                              <button onClick={() => removeEmail(e)} className="opacity-60 hover:opacity-100 p-0.5 rounded-full hover:bg-foreground/10 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

             </div>
          </div>
        )}

        {step === 3 && (
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 bg-background overflow-y-auto pb-32">
             <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg text-center p-6 sm:p-10 my-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-background">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Launch!</h2>
                <p className="text-muted-foreground mb-8">Your campaign <strong>"{campaign.name}"</strong> is ready to be sent to <strong>{validCount}</strong> valid recipients.</p>
                
                <div className="p-4 bg-muted/30 rounded-lg text-left mb-8 space-y-3 border border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Theme</span>
                    <span className="font-bold capitalize text-foreground">{theme}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Subject</span>
                    <span className="font-bold text-foreground truncate max-w-[200px]">{subjectLine || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Valid Audience</span>
                    <span className="font-bold text-emerald-500">{validCount} Contacts</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Invalid Omitted</span>
                      <span className="font-bold text-destructive">{invalidCount} Skipped</span>
                    </div>
                  )}
                  {attachments.length > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Attachments</span>
                      <span className="font-bold text-blue-500">{attachments.length} Files</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLaunchCampaign}
                  disabled={isSending}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary-hover shadow-md transition-all disabled:opacity-50"
                >
                  {isSending ? 'Sending emails...' : 'Launch Campaign Now'}
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
