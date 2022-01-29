import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import allSettled from 'promise.allsettled'
import { useFonts, Quicksand_300Light } from '@expo-google-fonts/quicksand'

import Navigation from './navigation'
import { supabase } from './lib/supabase'
import { useStore } from './store'
import useAuth from './hooks/useAuth'

// Create a shim for Promise.allSettled because
// it's not in React Native yet and Supabase uses it
allSettled.shim()

export default function App() {
  const [hasLoadedFonts] = useFonts({ Quicksand_300Light })
  const [hasLoadedAuth, setHasLoadedAuth] = useState(false)
  const hasHydrated = useStore((state) => state.hasHydrated)
  const { session, setSession, setHasOnboarded } = useAuth()

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
        setHasOnboarded(session?.user?.user_metadata.onboarded || false)
      })

      setHasLoadedAuth(true)
    }

    // Initialize the user session using the store
    // after we have hydrated it from storage
    if (hasHydrated) {
      getAuthSession()
    }
  }, [hasHydrated])

  if (!hasLoadedAuth || !hasLoadedFonts) {
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
