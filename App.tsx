import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import allSettled from 'promise.allsettled'
import { Subscription } from '@supabase/supabase-js'

import Navigation from './navigation'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store'
import useAuth from './hooks/useAuth'

// Create a shim for Promise.allSettled because
// it's not in React Native yet and Supabase uses it
allSettled.shim()

export default function App() {
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const { session, setSession } = useAuth()

  useEffect(() => {
    let authListener: Subscription | null

    async function getAuthSession() {
      // Try to refresh the user session
      // and set to null we the session has expired
      if (session?.refresh_token) {
        const { session: freshSession, error } = await supabase.auth.setSession(
          session?.refresh_token
        )

        if (error) {
          setSession(null)
        } else {
          setSession(freshSession)
        }
      }

      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setSession(session)
        }
      )

      setHasLoadedAuth(true)
      authListener = data
    }

    // Initialize the user session using the store
    // after we have hydrated it from storage
    if (hasHydrated) {
      getAuthSession()
    }

    return () => {
      authListener?.unsubscribe()
    }
  }, [hasHydrated])

  if (!hasLoadedAuth) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}
