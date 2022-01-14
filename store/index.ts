import create from 'zustand'

export type AppState = {
  session: any
  isAuthenticated: boolean
  setSession: (session: any) => void
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  session: null,
  setSession: (session: any) => set({ session, isAuthenticated: !!session }),
}))
