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
import shallow from 'zustand/shallow'

import { RemindersScreenNavigationProps, Reminder } from '../../types'
import { ErrorAlert } from '../utils'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '../../constants'
import { supabase } from '../../lib/supabase'
import tw from '../../lib/tailwind'
import { useReminderStore } from '../../store'
import { ReminderItem } from '../../components'

function ReminderScreen({ navigation }: RemindersScreenNavigationProps) {
  const [reminders, setReminders] = useReminderStore(
    (state) => [state.reminders, state.updateReminders],
    shallow
  )
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

      <View style={tw`bg-white`}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          reminders.map((reminder: Reminder) => (
            <View style={tw`bg-black`}>
              <ReminderItem key={reminder.id} reminder={reminder} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default ReminderScreen
