import shallow from 'zustand/shallow'

import { useStore } from '../store'
import { supabase } from '../lib/supabase'

function useAuth() {
  const {
    session,
    isAuthenticated,
    setSession,
    hasOnboarded,
    setHasOnboarded,
  } = useStore(
    (state) => ({
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      setSession: state.setSession,
      hasOnboarded: state.hasOnboarded,
      setHasOnboarded: state.setHasOnboarded,
    }),
    shallow
  )

  async function refreshSession() {
    if (!session?.access_token || !session?.refresh_token) return

    await supabase.auth.setAuth(session?.access_token)
    await supabase.auth.setSession(session?.refresh_token)

    const { data } = await supabase.auth.refreshSession()

    setSession(data)
  }

  return {
    session,
    isAuthenticated,
    setSession,
    refreshSession,
    hasOnboarded,
    setHasOnboarded,
  }
}

export default useAuth
