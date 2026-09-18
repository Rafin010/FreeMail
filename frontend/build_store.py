import os

content = r'''import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Campaign = {
  id: string
  name: string
  status: 'Draft' | 'Sent'
  date: string
  sent: number
  opens: number
  clicks: number
  // Form Draft Data
  subjectLine?: string
  messageBody?: string
  buttonText?: string
  buttonUrl?: string
  theme?: 'minimal' | 'professional' | 'dark'
  companyName?: string
  companyAddress?: string
  copyrightText?: string
  unsubscribeText?: string
  rawEmails?: string
}

type CampaignStore = {
  campaigns: Campaign[]
  addCampaign: (name: string) => Campaign
  updateCampaign: (id: string, data: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      campaigns: [
        {
          id: '1',
          name: 'Black Friday Super Sale',
          status: 'Draft',
          date: new Date().toISOString().split('T')[0],
          sent: 0,
          opens: 0,
          clicks: 0
        }
      ],
      addCampaign: (name) => {
        const newCampaign: Campaign = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          status: 'Draft',
          date: new Date().toISOString().split('T')[0],
          sent: 0,
          opens: 0,
          clicks: 0
        }
        set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }))
        return newCampaign
      },
      updateCampaign: (id, data) => set((state) => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...data, date: new Date().toISOString().split('T')[0] } : c)
      })),
      deleteCampaign: (id) => set((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== id)
      }))
    }),
    {
      name: 'freemail-campaigns-storage'
    }
  )
)
'''

os.makedirs(r'e:\_FreeMail\frontend\src\store', exist_ok=True)
with open(r'e:\_FreeMail\frontend\src\store\campaign-store.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success Store')
