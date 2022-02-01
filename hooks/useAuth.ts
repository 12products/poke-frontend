import shallow from 'zustand/shallow'

import { useAuthStore } from '../store'
import { useReminderStore } from '../store'
import { supabase } from '../lib/supabase'

function useAuth() {
  const {
    session,
    isAuthenticated,
    setSession,
    hasOnboarded,
    setHasOnboarded,
    user,
    setUser,
    activeSubscription,
    setActiveSubscription,
  } = useAuthStore(
    (state) => ({
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      setSession: state.setSession,
      hasOnboarded: state.hasOnboarded,
      setHasOnboarded: state.setHasOnboarded,
      user: state.user,
      setUser: state.setUser,
      activeSubscription: state.activeSubscription,
      setActiveSubscription: state.setActiveSubscription,
    }),
    shallow
  )
  const setReminders = useReminderStore(
    (state) => state.updateReminders,
    shallow
  )

  async function refreshSession() {
    if (!session?.access_token || !session?.refresh_token) return

    await supabase.auth.setAuth(session?.access_token)
    await supabase.auth.setSession(session?.refresh_token)

    const { data } = await supabase.auth.refreshSession()

    setSession(data)
  }

  async function logOut() {
    // Clears out the store
    setSession(null)
    setActiveSubscription(null)
    setReminders([])

    await supabase.auth.signOut()
  }

  return {
    session,
    isAuthenticated,
    setSession,
    refreshSession,
    hasOnboarded,
    setHasOnboarded,
    user,
    setUser,
    activeSubscription,
    logOut,
  }
}

export default useAuth
