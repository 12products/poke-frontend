import { createNativeStackNavigator } from '@react-navigation/native-stack'

import OnboardScreen from './OnboardScreen'

const Stack = createNativeStackNavigator()

export function OnboardStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboard" component={OnboardScreen} />
    </Stack.Navigator>
  )
}
