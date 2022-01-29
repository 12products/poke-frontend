import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RemindersScreen from './RemindersScreen'
import CreateReminderScreen from './CreateReminderScreen'
import SettingsScreen from './SettingsScreen'

const Stack = createNativeStackNavigator()

export function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Reminders"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="CreateReminder" component={CreateReminderScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}
