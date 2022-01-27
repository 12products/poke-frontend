import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'

import { AuthScreenStack } from '../screens/AuthStack'
import { HomeScreenStack } from '../screens/AppStack'
import useAuth from '../hooks/useAuth'

function Navigation() {
  const { isAuthenticated } = useAuth()

  return (
    <NavigationContainer>
      {isAuthenticated ? <HomeScreenStack /> : <AuthScreenStack />}
    </NavigationContainer>
  )
}

export default Navigation
