import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'

import { POKE_URL } from '@env'
import { AppStackParamList } from '../../types'
import { numToDays, ErrorAlert } from '../utils'
import useFetch from '../../hooks/useFetch'

type RemindersScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Reminders'
>

interface Reminder {
  id: string
  text: string
  notificationTime: string
  notificationDays: Number[]
  userId: string
  emoji: string
  createdAt: string
  updatedAt: string
}

const Item = ({ reminder }: { reminder: Reminder }) => {
  const { text, notificationTime, notificationDays, emoji } = reminder
  const reminderTime = new Date(notificationTime)
  return (
    <View style={styles.item}>
      <Text>
        {text} {emoji},{' '}
        {`${reminderTime.getHours() % 12}:${reminderTime.getMinutes()} ${
          reminderTime.getHours() > 12 ? 'pm' : 'am'
        }`}{' '}
        on {notificationDays.map((num) => `${numToDays[num as number]}, `)}{' '}
      </Text>
    </View>
  )
}

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  const [reminders, setReminders] = useState([])
  const [isLoading, setLoading] = useState(false)
  const { fetch } = useFetch()

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const getReminders = async () => {
        try {
          setLoading(true)
          const response = await fetch(`${POKE_URL}/reminders`)
          const reminders = await response.json()
          if (isActive) {
            setReminders(reminders)
          }
        } catch (error: any) {
          ErrorAlert({
            title: 'Error on Fetching Pokes',
            message: error?.message,
          })
        } finally {
          setLoading(false)
        }
      }
      getReminders()
      return () => {
        isActive = false
      }
    }, [])
  )

  const renderReminder: ListRenderItem<Reminder> = (
    info: ListRenderItemInfo<Reminder>
  ) => <Item reminder={info.item} />

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            {reminders.length && (
              <Text style={styles.title}>Current Reminders</Text>
            )}
            <FlatList<Reminder>
              data={reminders}
              keyExtractor={({ id }) => id}
              renderItem={renderReminder}
            />
          </>
        )}
      </View>
      <View style={styles.container}>
        <Button
          title="Create a Poke"
          onPress={() => navigation.navigate('CreateReminder')}
        ></Button>
      </View>
    </>
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
  item: {
    backgroundColor: '#ebfafe',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
