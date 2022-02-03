import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useState, useEffect, useRef } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as yup from 'yup'

import {
  Day,
  CreateReminderScreenNavigationProps,
  CreateReminderInput,
  ChangeFieldInput,
} from '../../types'
import { ErrorAlert } from '../utils'
import { BRAND_COLORS } from '../../constants'
import useFetch from '../../hooks/useFetch'
import { useReminderStore } from '../../store'
import { POKE_URL } from '../../constants'
import tw from '../../lib/tailwind'

export const createReminderSchema = yup.object().shape({
  text: yup.string().required(),
  notificationDays: yup.array().of(yup.number()).min(1).required(),
  notificationTime: yup.string(),
})

export const days: Day[] = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

function CreateReminderScreen({
  navigation,
}: CreateReminderScreenNavigationProps) {
  const defaultNotificationTime = new Date()
  const scrollRef = useRef<ScrollView>()
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [time, setTime] = useState<Date>(defaultNotificationTime)
  const { fetch } = useFetch()
  const reminders = useReminderStore((state) => state.reminders)
  const reminderColor = BRAND_COLORS[reminders.length % BRAND_COLORS.length]
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReminderInput>({
    resolver: yupResolver(createReminderSchema),
    defaultValues: {
      text: '',
      notificationTime: defaultNotificationTime.toISOString(),
      notificationDays: [],
    },
  })

  // @ts-ignore
  const onSelectedTimeChange = (_, selectedTime: Date | undefined) => {
    setTime(selectedTime || defaultNotificationTime)
    setValue('notificationTime', selectedTime?.toISOString() || '')
  }

  const onChangeField = useCallback(
    (name: ChangeFieldInput) => (text: string) => {
      setValue(name, text)
    },
    []
  )

  const addReminder = useReminderStore((state) => state.addReminder)

  const createReminder = async (data: CreateReminderInput) => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(`${POKE_URL}/reminders`, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          color: reminderColor,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status !== 201) {
        throw new Error('Failed to create reminder!')
      }

      const createdReminder = await response.json()
      addReminder(createdReminder)
      navigation.navigate('Reminders')
    } catch (error: any) {
      ErrorAlert({
        title: 'Uh oh!',
        message: 'We failed to create your reminder. Try again later.',
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    register('notificationDays')
    register('notificationTime')
    register('text')
  }, [register])

  const toggleSelectedDay = (day: number, isSelected: boolean) => {
    let newSelectedDays = [...selectedDays]

    if (isSelected) {
      newSelectedDays = newSelectedDays.filter(
        (selectedDay) => selectedDay !== day
      )
    } else {
      newSelectedDays.push(day)
    }

    setSelectedDays(newSelectedDays)
    setValue('notificationDays', newSelectedDays)
  }

  const handleCreateReminder = () => {
    handleSubmit(createReminder, (e) => {
      // Scroll to the top of the form
      // if the user has a text error
      if (e.text) {
        scrollRef?.current?.scrollTo({ y: 0 })
      }
    })()
  }

  return (
    <SafeAreaView style={tw`bg-brand-${reminderColor}`}>
      <ScrollView
        // @ts-ignore
        ref={scrollRef}
        contentContainerStyle={tw`bg-brand-${reminderColor}`}
      >
        <Text
          style={tw`text-6xl text-white font-bold uppercase text-center w-full px-4 mt-8 mb-4`}
        >
          What?
        </Text>
        <View style={tw`bg-white min-h-12`}>
          <TextInput
            onChangeText={onChangeField('text')}
            style={tw`text-4xl w-full bg-white p-4 my-4 text-center`}
            multiline
          ></TextInput>
        </View>
        {errors?.text && (
          <Text
            style={tw`text-2xl bg-black py-2 text-white font-bold uppercase text-center`}
          >
            ☝️ we totally need this.
          </Text>
        )}

        <Text
          style={tw`text-6xl text-white font-bold uppercase text-center w-full px-4 mt-6`}
        >
          When?
        </Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          display="spinner"
          onChange={onSelectedTimeChange}
          minuteInterval={5}
          style={tw`w-full bg-white my-4`}
        />

        {days.map(({ id, name }) => {
          const isSelected = selectedDays.includes(id)
          return (
            <View
              key={id}
              style={tw`flex flex-row items-center justify-between w-full px-4 m-auto my-2`}
            >
              <Text style={tw`text-3xl uppercase font-bold text-white`}>
                {name}
              </Text>
              <Switch
                value={isSelected}
                onValueChange={() => toggleSelectedDay(id, isSelected)}
                trackColor={{ true: '#fff', false: '#000' }}
                thumbColor={isSelected ? '#000' : '#fff'}
                ios_backgroundColor="#000"
              />
            </View>
          )
        })}
        {errors?.notificationDays && (
          <Text
            style={tw`text-2xl bg-black py-2 text-white font-bold uppercase text-center`}
          >
            ☝️ Please pick a day.
          </Text>
        )}

        <TouchableOpacity
          onPress={handleCreateReminder}
          style={tw`w-full bg-black my-8 flex justify-center min-h-14`}
          activeOpacity={1}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={tw`text-4xl text-center font-bold uppercase p-2 text-white`}
            >
              Create
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateReminderScreen
