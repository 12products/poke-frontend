import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import allSettled from 'promise.allsettled'
import shallow from 'zustand/shallow'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { supabase } from './lib/supabase'
import { useStore } from './store'

// Create a shim for Promise.allSettled because
// it's not in React Native yet and Supabase uses it
allSettled.shim()

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const { session, setSession } = useStore(
    (state) => ({
      session: state.session,
      setSession: state.setSession,
    }),
    shallow
  )

  useEffect(() => {
    async function getAuthSession() {
      if (session?.refresh_token) {
        supabase.auth.setSession(session.refresh_token)
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
      })
    }

    // Initialize the user session using the store
    // after we have hydrated it from storage
    if (isLoadingComplete) {
      getAuthSession()
    }
  }, [isLoadingComplete])

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}
