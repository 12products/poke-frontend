import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'

import { AuthStack } from '../screens/AuthStack'
import { AppStack } from '../screens/AppStack'
import { OnboardStack } from '../screens/OnboardStack'
import useAuth from '../hooks/useAuth'

function Navigation() {
  const { isAuthenticated, hasOnboarded } = useAuth()

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    )
  }

  if (isAuthenticated && !hasOnboarded) {
    return (
      <NavigationContainer>
        <OnboardStack />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  )
}

export default Navigation
