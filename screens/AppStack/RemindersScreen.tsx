import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import shallow from 'zustand/shallow'
import { Feather } from '@expo/vector-icons'

import { RemindersScreenNavigationProps, Reminder } from '../../types'
import { ErrorAlert } from '../utils'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '../../constants'
import tw from '../../lib/tailwind'
import { useReminderStore } from '../../store'
import { ReminderItem } from '../../components'

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  const [reminders, setReminders] = useReminderStore(
    (state) => [state.reminders, state.updateReminders],
    shallow
  )
  const [buttonHeight, setButtonHeight] = useState(0)
  const { fetch } = useFetch()

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const getReminders = async () => {
        try {
          const response = await fetch(`${POKE_URL}/reminders`)
          const updatedReminders = await response.json()
          if (!Array.isArray(updatedReminders)) {
            throw new Error('Check your network and retry!')
          }

          if (isActive) {
            setReminders(updatedReminders)
          }
        } catch (error: any) {
          ErrorAlert({
            title: 'Unknown Error Fetching Pokes',
            message: error?.message,
          })
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

      <TouchableOpacity
        style={tw`w-full bg-black`}
        activeOpacity={1}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text
          style={tw`text-4xl text-center font-bold uppercase p-2 text-white`}
        >
          Settings
        </Text>
      </TouchableOpacity>

      <View style={tw`bg-white`}>
        {reminders.map((reminder: Reminder) => (
          <View style={tw`bg-black`}>
            <ReminderItem key={reminder.id} reminder={reminder} />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default ReminderScreen
