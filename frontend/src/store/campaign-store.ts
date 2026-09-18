import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

// Custom IndexedDB storage handler for Zustand
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return
    await del(name)
  },
}

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
  attachments?: { name: string, size: number, type: string, url: string }[]
  headerBgColor?: string
  bodyBgColor?: string
  logoUrl?: string
}

type CampaignStore = {
  campaigns: Campaign[]
  addCampaign: (name: string) => Campaign
  updateCampaign: (id: string, data: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set_) => ({
      campaigns: [],
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
        set_((state) => ({ campaigns: [newCampaign, ...state.campaigns] }))
        return newCampaign
      },
      updateCampaign: (id, data) => set_((state) => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...data, date: new Date().toISOString().split('T')[0] } : c)
      })),
      deleteCampaign: (id) => set_((state) => ({
        campaigns: state.campaigns.filter(c => c.id !== id)
      }))
    }),
    {
      name: 'freemail-campaigns-storage-v2', // Changed name to avoid conflict with old corrupted localstorage
      storage: createJSONStorage(() => idbStorage),
    }
  )
)
