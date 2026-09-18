# -*- coding: utf-8 -*-
import os

wizard_content = r''''use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, Mail, Upload, X, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react'
import RichTextEditor from '@/components/shared/rich-text-editor'
import { useCampaignStore } from '@/store/campaign-store'

const TEMPLATES = [
  { id: 'blank', name: 'Blank', html: '<p></p>' },
  { id: 'newsletter', name: 'Newsletter', html: '<h1 style="text-align: center">Your Monthly Digest</h1><p>Hi {{first_name}},</p><p>Here is what happened this month...</p>' },
  { id: 'promo', name: 'Promo/Sale', html: '<h1 style="text-align: center; color: #e11d48">50% OFF FLASH SALE</h1><p style="text-align: center">Hurry up! Grab your favorite items before they run out.</p>' },
  { id: 'personal', name: 'Personal', html: '<p>Hey {{first_name}},</p><p>Just wanted to quickly check in and see how things are going with your recent project.</p><p>Best,<br>Your Name</p>' }
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const [copyrightText, setCopyrightText] = useState(campaign?.copyrightText || '&copy; 2026 FreeMail Inc. All rights reserved.')
  const [unsubscribeText, setUnsubscribeText] = useState(campaign?.unsubscribeText || 'Unsubscribe from this list')
  
  // New Layout Fields
  const [headerBgColor, setHeaderBgColor] = useState('#ffffff')
  const [logoUrl, setLogoUrl] = useState('')

  // Audience State
  const [emails, setEmails] = useState<string[]>((campaign?.rawEmails || '').split('\n').filter(Boolean))
  const [emailInput, setEmailInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [errorToast, setErrorToast] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save on unmount or step change
  useEffect(() => {
    return () => {
      updateCampaign(id, {
        subjectLine, messageBody, buttonText, buttonUrl, theme,
        companyName, companyAddress, copyrightText, unsubscribeText,
        rawEmails: emails.join('\n')
      })
    }
  }, [id, subjectLine, messageBody, buttonText, buttonUrl, theme, companyName, companyAddress, copyrightText, unsubscribeText, emails, updateCampaign])

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
        showError(${duplicates} duplicate emails ignored!)
      } else if (duplicates > 0) {
        showError(Added  emails. Ignored  duplicates.)
      }
      
      return nextList
    })
  }

  const handleEmailInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
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
      const extracted = text.split(/[\n\r,;]+/)
      handleAddEmails(extracted)
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (!campaign) {
    return <div className="p-8 text-center">Campaign not found!</div>
  }

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
              <div className={lex items-center gap-3 transition-opacity }>
                <div className={w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold }>
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
            <button className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary-hover transition-opacity shadow-lg animate-pulse">
              Launch Campaign
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {step === 1 && (
          <div className="absolute inset-0 flex flex-col lg:flex-row">
            {/* Left Panel: Editor & Settings */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto border-r border-border p-6 space-y-8 custom-scrollbar pb-32">
              
              <div className="bg-muted/30 p-5 rounded-xl border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">Campaign Details</h2>
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-semibold mb-2">Theme</label>
                    <div className="flex bg-muted p-1 rounded-md border border-input">
                      {['minimal', 'professional', 'dark'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setTheme(t as any)}
                          className={lex-1 text-xs font-bold py-1.5 rounded }
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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
              
              <div>
                <div className="flex items-center justify-between mb-3">
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
                />
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

              {/* Custom Header Configuration */}
              <div className="border-t border-border pt-8">
                <h2 className="text-lg font-bold text-foreground mb-4">Header Customization</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">Logo URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://yourdomain.com/logo.png"
                      className="w-full h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">Header Background Color</label>
                    <div className="flex gap-2">
                       <input 
                         type="color" 
                         className="h-9 w-9 p-0 border border-input rounded-md cursor-pointer"
                         value={headerBgColor}
                         onChange={e => setHeaderBgColor(e.target.value)}
                       />
                       <input 
                         type="text" 
                         className="flex-1 h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm uppercase font-mono"
                         value={headerBgColor}
                         onChange={e => setHeaderBgColor(e.target.value)}
                       />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Footer Configuration */}
              <div className="border-t border-border pt-8 pb-10">
                <h2 className="text-lg font-bold text-foreground mb-4">Footer Branding</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Company Name</label>
                      <input 
                        type="text" 
                        className="w-full h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Company Address</label>
                      <input 
                        type="text" 
                        className="w-full h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={companyAddress}
                        onChange={e => setCompanyAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Copyright Text</label>
                      <input 
                        type="text" 
                        className="w-full h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={copyrightText}
                        onChange={e => setCopyrightText(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Unsubscribe Link Text</label>
                      <input 
                        type="text" 
                        className="w-full h-9 px-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        value={unsubscribeText}
                        onChange={e => setUnsubscribeText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Panel: Live Preview */}
            <div className="w-full lg:w-1/2 h-full bg-zinc-950 p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
               <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-full">
                 
                 <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 gap-2 shrink-0">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   <div className="ml-4 text-xs font-medium text-zinc-500 flex-1 text-center pr-10">Live Preview</div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                   <div className={w-full max-w-lg mx-auto rounded-lg shadow-sm overflow-hidden border 
                   }>
                      <div className={h-16 flex items-center px-6} style={{ backgroundColor: headerBgColor }}>
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="max-h-8 object-contain" />
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {companyName ? companyName.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <span className="ml-3 font-bold text-lg mix-blend-difference" style={{ color: headerBgColor === '#ffffff' ? '#000' : '#fff' }}>
                              {companyName || 'FreeMail Co.'}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="p-8">
                        {subjectLine && <h1 className="text-2xl font-bold mb-6 opacity-90">{subjectLine}</h1>}
                        {!subjectLine && <h1 className="text-2xl font-bold mb-6 opacity-20">Your Subject Line Will Appear Here</h1>}
                        
                        <div 
                          className="prose prose-sm max-w-none opacity-90"
                          dangerouslySetInnerHTML={{ __html: messageBody }}
                        />
                        
                        {buttonText && (
                          <div className="mt-8">
                            <a href="#" className={inline-block px-6 py-2.5  font-medium text-sm rounded-md transition-transform hover:-translate-y-0.5 shadow-sm}>
                              {buttonText}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className={p-6 text-center }>
                         {theme === 'professional' && <div className="mt-4" />}
                         <p className="text-[10px] text-zinc-500 mb-1" dangerouslySetInnerHTML={{ __html: copyrightText }}></p>
                         <p className="text-[10px] text-zinc-500">{companyAddress}</p>
                         <p className="text-[10px] text-zinc-500 mt-4 cursor-pointer underline hover:text-zinc-400">{unsubscribeText}</p>
                      </div>

                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-zinc-50/50 overflow-y-auto">
             <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
               
               <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                 <div>
                   <h2 className="text-lg font-bold text-foreground">Target Audience</h2>
                   <p className="text-sm text-muted-foreground mt-1">Upload a file or type email addresses below. Hit Enter to add.</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-semibold rounded-md text-sm transition-colors border border-primary/20">
                      <Upload className="w-4 h-4" /> Upload CSV/TXT
                    </button>
                    <input type="file" accept=".txt,.csv" ref={fileInputRef} onChange={handleFileUpload} className="sr-only" />
                 </div>
               </div>
               
               <div className="p-6 flex-1 flex flex-col gap-4">
                 
                 <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-border">
                   <div className="flex gap-4 text-sm font-medium">
                     <span className="text-emerald-600 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> {validCount} Valid</span>
                     <span className="text-destructive flex items-center gap-1.5"><ShieldAlert className="w-4 h-4"/> {invalidCount} Invalid</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <button onClick={removeInvalid} className="text-xs px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-muted font-medium flex items-center gap-1">
                       Clean Invalid
                     </button>
                     <button onClick={() => setEmails([])} className="text-xs px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium flex items-center gap-1">
                       <Trash2 className="w-3 h-3" /> Clear All
                     </button>
                   </div>
                 </div>

                 {/* Massive Box (Old UI Look + Smart Chips) */}
                 <div 
                   className="flex-1 w-full p-4 rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary outline-none overflow-y-auto cursor-text shadow-sm"
                   onClick={() => document.getElementById('email-input')?.focus()}
                 >
                   <div className="flex flex-wrap gap-2 items-center">
                     {emails.map((e, i) => {
                       const isValid = EMAIL_REGEX.test(e)
                       return (
                         <div key={i} className={lex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border font-medium }>
                           {e}
                           <button onClick={(ev) => { ev.stopPropagation(); removeEmail(e); }} className="opacity-50 hover:opacity-100 p-0.5 rounded-full hover:bg-black/10 transition-colors">
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       )
                     })}
                     
                     <input 
                       id="email-input"
                       type="text"
                       value={emailInput}
                       onChange={e => setEmailInput(e.target.value)}
                       onKeyDown={handleEmailInputKeyDown}
                       placeholder={emails.length === 0 ? "Type emails and hit Enter... (e.g. user@example.com)" : ""}
                       className="flex-1 min-w-[250px] bg-transparent outline-none py-1.5 text-sm font-mono placeholder:text-muted-foreground/50"
                     />
                   </div>
                 </div>
                 
               </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-zinc-50/50">
             <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm text-center p-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-background">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Launch!</h2>
                <p className="text-muted-foreground mb-8">Your campaign <strong>"{campaign.name}"</strong> is ready to be sent to <strong>{validCount}</strong> valid recipients.</p>
                
                <div className="p-4 bg-muted/50 rounded-lg text-left mb-8 space-y-3 border border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Theme</span>
                    <span className="font-bold capitalize">{theme}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Subject</span>
                    <span className="font-bold text-foreground truncate max-w-[200px]">{subjectLine || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Valid Audience</span>
                    <span className="font-bold text-emerald-600">{validCount} Contacts</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Invalid Omitted</span>
                      <span className="font-bold text-destructive">{invalidCount} Skipped</span>
                    </div>
                  )}
                </div>
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary-hover shadow-md transition-all">
                  Launch Campaign Now
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
'''

with open(r'e:\_FreeMail\frontend\src\app\(dashboard)\campaigns\[id]\edit\page.tsx', 'w', encoding='utf-8') as f:
    f.write(wizard_content)

print('Updated Wizard')
