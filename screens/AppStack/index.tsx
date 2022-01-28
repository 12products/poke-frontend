import { Button, StyleSheet, Text, View } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { StatusBar } from 'expo-status-bar'

import { supabase } from '../../lib/supabase'
import OnboardScreen from './OnboardScreen'
import RemindersScreen from './RemindersScreen'
import CreateReminderScreen from './CreateReminderScreen'

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text> This is the PROFILE page</Text>
      <StatusBar style="auto" />
    </View>
  )
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <>
      <DrawerContentScrollView {...props}>
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={{ marginBottom: 30 }}>
        <Button
          title="LOGOUT"
          onPress={async () => {
            await supabase.auth.signOut()
            props.navigation.closeDrawer()
          }}
        ></Button>
      </View>
    </>
  )
}

const DrawerStack = createDrawerNavigator()

export function HomeScreenStack() {
  return (
    <DrawerStack.Navigator
      initialRouteName="Onboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <DrawerStack.Screen name="Onboard" component={OnboardScreen} />
      <DrawerStack.Screen name="Reminders" component={RemindersScreen} />
      <DrawerStack.Screen
        name="CreateReminder"
        component={CreateReminderScreen}
      />
      <DrawerStack.Screen name="Profile" component={ProfileScreen} />
    </DrawerStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
