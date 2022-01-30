import {
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'

import { RemindersScreenNavigationProps, Reminder } from '../../types'
import { ErrorAlert } from '../utils'
import { numToDays } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '../../constants'
import { supabase } from '../../lib/supabase'
import tw from '../../lib/tailwind'

const ReminderItem = ({
  reminder: { text, notificationTime, notificationDays, emoji, color },
}: {
  reminder: Reminder
}) => {
  const reminderTime = new Date(notificationTime)
  return (
    <View style={tw`bg-brand-${color} p-4`}>
      <View style={tw`flex flex-row items-center`}>
        <Text style={tw`text-5xl py-2 mr-2`}>{emoji}</Text>
        <Text style={tw`text-2xl text-white font-bold uppercase`}>
          {text.slice(0, 18)}
          {text.length > 18 ? '...' : ''}
        </Text>
      </View>

      <Text style={tw`uppercase font-bold text-white`}>
        {`${reminderTime.getHours() % 12}:${
          reminderTime.getMinutes() === 0 ? '00' : reminderTime.getMinutes()
        }${reminderTime.getHours() > 12 ? 'pm' : 'am'}`}{' '}
        on{' '}
        {notificationDays
          .sort((dayA, dayB) => dayA - dayB)
          .map((num) => numToDays[num].slice(0, 3))
          .join(', ')}
      </Text>
    </View>
  )
}

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setLoading] = useState(false)
  const [buttonHeight, setButtonHeight] = useState(0)
  const { fetch } = useFetch()

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const getReminders = async () => {
        try {
          setLoading(true)
          const response = await fetch(`${POKE_URL}/reminders`)
          const reminders = await response.json()
          if (!Array.isArray(reminders)) {
            throw new Error('Check your network and retry!')
          }

          if (isActive) {
            setReminders(reminders)
          }
        } catch (error: any) {
          ErrorAlert({
            title: 'Unknown Error Fetching Pokes',
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

  const handleLayoutChange = (e: LayoutChangeEvent) => {
    setButtonHeight(e.nativeEvent.layout.height)
  }

  return (
    <ScrollView onLayout={handleLayoutChange}>
      <View
        style={[
          tw`h-full flex justify-center items-center`,
          { height: buttonHeight },
        ]}
      >
        <TouchableOpacity
          style={tw`h-full w-full flex justify-center items-center bg-white`}
          activeOpacity={1}
          onPress={() => navigation.navigate('CreateReminder')}
        >
          <Text style={tw`text-9xl font-bold uppercase p-2`}>📣</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="LOGOUT"
        onPress={async () => {
          await supabase.auth.signOut()
        }}
      ></Button>

      <View style={tw`h-full`}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          reminders.map((reminder: Reminder) => (
            <ReminderItem key={reminder.id} reminder={reminder} />
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default ReminderScreen
