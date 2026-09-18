import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

// Safe IndexedDB storage for Next.js SSR
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

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loginWithGoogle: async () => {
        // Simulate a network delay for the smooth loading animation
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock Google User Data
        const mockUser: User = {
          id: 'google-uid-12345',
          name: 'Alex Developer',
          email: 'alex@freemail.com',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        }
        
        set({ user: mockUser })
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'freemail-auth-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
)
