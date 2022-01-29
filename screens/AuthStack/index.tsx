import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SignInScreen from './SignInScreen'
import VerifyAccountScreen from './VerifyAccountScreen'
import { getRandomBrandColor } from '../utils'

const AuthStack = createNativeStackNavigator()

const brandBackground = getRandomBrandColor()

export function AuthScreenStack() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        initialParams={{
          brandBackground: brandBackground,
        }}
      />

      <AuthStack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        initialParams={{
          brandBackground: brandBackground,
        }}
      />
    </AuthStack.Navigator>
  )
}
