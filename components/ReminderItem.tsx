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
  const removeReminder = useReminderStore((state) => state.removeReminder)

  const handleOnSnap = async (id: string, snapId: string) => {
    if (snapId === 'noAction') {
      return
    }

    // Animate list to close gap when item is deleted
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)

    try {
      await fetch(`${POKE_URL}/reminders/${id}`, {
        method: 'DELETE',
      })
      removeReminder(id)
    } catch (e) {
      ErrorAlert({
        title: 'Yikes!',
        message: "We couldn't delete your reminder. Try again later",
      })
    }
  }

  // Get the hours but make sure 0 --> 12
  const rawHours = reminderTime.getHours()
  const hours = rawHours % 12 || 12
  const minutes = `${reminderTime.getMinutes()}`.padStart(2, '0')
  const period = rawHours > 12 ? 'pm' : 'am'

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
      <View style={tw`bg-brand-${color} p-4 z-20 relative`}>
        <View style={tw`flex flex-row items-center`}>
          <Text style={tw`text-5xl py-2 mr-2`}>{emoji}</Text>
          <Text style={tw`text-2xl text-white font-bold uppercase`}>
            {text?.slice(0, 18)}
            {text?.length > 18 ? '...' : ''}
          </Text>
        </View>

        <Text style={tw`uppercase font-bold text-white`}>
          {`${hours}:${minutes}${period}`}{' '}
          {`ON ${notificationDays
            .sort((dayA, dayB) => dayA - dayB)
            .map((num) => numToDays[num].slice(0, 3))
            .join(', ')}`}
        </Text>
      </View>
    </Interactable.View>
  )
}
