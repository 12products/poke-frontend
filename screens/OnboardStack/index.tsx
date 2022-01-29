import { createNativeStackNavigator } from '@react-navigation/native-stack'

import OnboardScreen from './OnboardScreen'
import { getRandomBrandColor } from '../utils'

const Stack = createNativeStackNavigator()

const brandBackground = getRandomBrandColor()

export function OnboardStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboard"
        component={OnboardScreen}
        initialParams={{
          brandBackground: brandBackground,
        }}
      />
    </Stack.Navigator>
  )
}
