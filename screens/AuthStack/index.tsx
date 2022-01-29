import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SignInScreen from './SignInScreen'
import VerifyAccountScreen from './VerifyAccountScreen'
import { getRandomBrandColor } from '../../lib/utils'

const Stack = createNativeStackNavigator()

const brandBackground = getRandomBrandColor()

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        initialParams={{
          brandBackground: brandBackground,
        }}
      />

      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        initialParams={{
          brandBackground: brandBackground,
        }}
      />
    </Stack.Navigator>
  )
}
