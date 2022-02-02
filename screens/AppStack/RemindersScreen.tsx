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
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

import { RemindersScreenNavigationProps, Reminder } from '../../types'
import { ErrorAlert } from '../utils'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '../../constants'
import tw from '../../lib/tailwind'
import { useReminderStore } from '../../store'
import { ReminderItem } from '../../components'
import useAuth from '../../hooks/useAuth'

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  const [reminders, setReminders] = useReminderStore(
    (state) => [state.reminders, state.updateReminders],
    shallow
  )
  const [buttonHeight, setButtonHeight] = useState(0)
  const { fetch } = useFetch()
  const { activeSubscription } = useAuth()

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
            title: 'Whoops!',
            message: 'We failed to get your reminders. Try again later.',
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

  const handleCreateReminder = () => {
    if (!activeSubscription && reminders.length >= 1) {
      ErrorAlert({
        title: 'Help Us Build This',
        message:
          "Building this thing costs us money. If you subscribe, you can make as many reminders as you'd like.",
        buttons: [
          { text: 'No Thanks' },
          { text: 'Subscribe', onPress: () => navigation.navigate('Settings') },
        ],
      })

      return
    }

    navigation.navigate('CreateReminder')
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
          onPress={handleCreateReminder}
        >
          <FontAwesome name="hand-pointer-o" size={160} color="black" />
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

      {reminders.length > 0 && (
        <View style={tw`bg-white`}>
          {reminders.map((reminder: Reminder) => (
            <View style={tw`bg-red-600 relative`} key={reminder.id}>
              <FontAwesome5
                name="trash-alt"
                size={48}
                color="white"
                style={tw`absolute top-8 right-10 z-0`}
              />
              <ReminderItem reminder={reminder} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default ReminderScreen
