import Interactable from 'react-native-interactable'
import { View, Text, LayoutAnimation } from 'react-native'

import { useReminderStore } from '../store'
import tw from '../lib/tailwind'
import { numToDays } from '../lib/utils'
import useFetch from '../hooks/useFetch'
import { POKE_URL } from '../constants'
import { Reminder } from '../types'
import { ErrorAlert } from '../screens/utils'

export const ReminderItem = ({
  reminder: { id, text, notificationTime, notificationDays, emoji, color },
}: {
  reminder: Reminder
}) => {
  const reminderTime = new Date(notificationTime)
  const { fetch } = useFetch()
  // Animate list to close gap when item is deleted
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  const removeReminder = useReminderStore((state) => state.removeReminder)
  const handleOnSnap = async (id: string, snapId: string) => {
    if (snapId === 'noAction') {
      return
    }

    try {
      await fetch(`${POKE_URL}/reminders/${id}`, {
        method: 'DELETE',
      })
      removeReminder(id)
    } catch (e) {
      ErrorAlert({ title: 'Error deleting', message: 'Try again!' })
    }
  }

  return (
    <Interactable.View
      horizontalOnly={true}
      snapPoints={[
        { x: 100, id: 'noAction' },
        { x: -500, id: 'delete' },
      ]}
      onSnapStart={({ nativeEvent }) => handleOnSnap(id, nativeEvent.id)}
      boundaries={{ right: 0 }}
    >
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
    </Interactable.View>
  )
}
