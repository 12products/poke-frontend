import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'

import { AuthScreenStack } from '../screens/AuthStack'
import { HomeScreenStack } from '../screens/AppStack'
import useAuth from '../hooks/useAuth'

function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { isAuthenticated } = useAuth()

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {isAuthenticated ? <HomeScreenStack /> : <AuthScreenStack />}
    </NavigationContainer>
  )
}

export default Navigation
