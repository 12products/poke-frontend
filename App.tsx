import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import allSettled from 'promise.allsettled'
import { StripeProvider as _StripeProvider } from '@stripe/stripe-react-native'
import type { Props as StripeProviderProps } from '@stripe/stripe-react-native/lib/typescript/src/components/StripeProvider'

import Navigation from './navigation'
import { supabase } from './lib/supabase'
import { useStore } from './store'
import useAuth from './hooks/useAuth'
import { STRIPE_PUBLIC_KEY } from './constants'

// Create a shim for Promise.allSettled because
// it's not in React Native yet and Supabase uses it
allSettled.shim()

// Fixes TS issue due to typing of children
const StripeProvider = _StripeProvider as React.FC<StripeProviderProps>

export default function App() {
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

  if (!hasLoadedAuth) {
    return null
  } else {
    return (
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        urlScheme=""
        merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}"
      >
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </StripeProvider>
    )
  }
}
