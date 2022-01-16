import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '@supabase/supabase-js'

export type AppState = {
  session: Session | null
  isAuthenticated: boolean
  setSession: (session: any) => void
  hasHydrated: boolean
}

export const useStore = create<AppState>(
  persist(
    (set, get) => ({
      session: null,
      isAuthenticated: false,
      setSession: (session: any) =>
        set({ session, isAuthenticated: !!session }),
      hasHydrated: false,
    }),
    {
      name: 'PokeStore',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => () => {
        useStore.setState({ hasHydrated: true })
      },
    }
  )
)
