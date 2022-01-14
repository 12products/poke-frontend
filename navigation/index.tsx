import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import * as React from 'react'
import { useEffect } from 'react'
import { ColorSchemeName } from 'react-native'
import shallow from 'zustand/shallow'
import AsyncStorageLib from '@react-native-async-storage/async-storage'

import { AuthScreenStack } from '../screens/AuthStack'
import { HomeScreenStack } from '../screens/AppStack'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'

function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [isAuthenticated, setSession] = useStore(
    (state) => [state.isAuthenticated, state.setSession],
    shallow
  )

  useEffect(() => {
    async function getAuthSession() {
      console.log('eyyy', await AsyncStorageLib.getItem('supabase.auth.token'))
      setSession(await supabase.auth.session())

      supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session)
        console.log(
          'heyyy',
          await AsyncStorageLib.getItem('supabase.auth.token')
        )
      })
    }

    getAuthSession()
  }, [])
  console.log(isAuthenticated)
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {isAuthenticated ? <HomeScreenStack /> : <AuthScreenStack />}
    </NavigationContainer>
  )
}

export default Navigation
