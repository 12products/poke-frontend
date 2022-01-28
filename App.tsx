import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import allSettled from 'promise.allsettled'
import shallow from 'zustand/shallow'

import Navigation from './navigation'
import { supabase } from './lib/supabase'
import { useStore } from './store'

// Create a shim for Promise.allSettled because
// it's not in React Native yet and Supabase uses it
allSettled.shim()

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const hasHydrated = useStore((state) => state.hasHydrated)
  const { session, setSession } = useStore(
    (state) => ({
      session: state.session,
      setSession: state.setSession,
    }),
    shallow
  )

  useEffect(() => {
    async function getAuthSession() {
      // Try to refresh the user session
      // and set to null we the session has expired
      if (session?.refresh_token) {
        await supabase.auth.setAuth(session?.access_token)
        const { session: freshSession, error } = await supabase.auth.setSession(
          session?.refresh_token
        )

        if (error) {
          setSession(null)
        } else {
          setSession(freshSession)
        }
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
      })

      setIsLoaded(true)
    }

    // Initialize the user session using the store
    // after we have hydrated it from storage
    if (hasHydrated) {
      getAuthSession()
    }
  }, [hasHydrated])

  if (!isLoaded) {
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
