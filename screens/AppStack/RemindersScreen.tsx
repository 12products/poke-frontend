import { StyleSheet, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { AppStackParamList } from '../../types'

type RemindersScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Reminders'
>

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOLZ</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})

export default ReminderScreen
