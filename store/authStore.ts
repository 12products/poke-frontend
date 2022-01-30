import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '@supabase/supabase-js'

import { POKE_URL } from '../constants'

export type AppState = {
  session: Session | null
  isAuthenticated: boolean
  setSession: (session: any) => void
  hasHydrated: boolean
  hasOnboarded: boolean
  setHasOnboarded: (hasOnboarded: boolean) => void
  user: any
  setUser: (user: any) => void
}

export const useAuthStore = create<AppState>(
  persist(
    (set, _get) => ({
      session: null,
      isAuthenticated: false,
      setSession: async (session: any) => {
        let user = null

        if (session) {
          try {
            const response = await fetch(`${POKE_URL}/users/onboard`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            })
            const userData = await response.json()
            user = userData
          } catch (error: any) {
            console.error('Failed to get or create user', error)
          }
        }

        set({
          session,
          isAuthenticated: !!session,
          user,
          hasOnboarded: user?.onboarded,
        })
      },
      hasHydrated: false,
      hasOnboarded: false,
      setHasOnboarded: (hasOnboarded: boolean) => set({ hasOnboarded }),
      user: null,
      setUser: (user: any) => set({ user, hasOnboarded: user?.hasOnboarded }),
    }),
    {
      name: 'PokeStore',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)
