import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { ColorSchemeName } from 'react-native'

import { AuthScreenStack } from '../screens/AuthStack'
import { HomeScreenStack } from '../screens/AppStack/AppStack'
import { supabase } from '../supabase-service'

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })
  }, [])

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {isAuthenticated ? <HomeScreenStack /> : <AuthScreenStack />}
    </NavigationContainer>
  )
}
