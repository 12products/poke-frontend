import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCallback, useState, useEffect, useRef } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  Day,
  CreateReminderScreenNavigationProps,
  CreateReminderInput,
  ChangeFieldInput,
} from '../../types'
import { ErrorAlert } from '../utils'
import { getRandomBrandColor } from '../../lib/utils'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '../../constants'
import tw from '../../lib/tailwind'

const days: Day[] = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

const createReminderSchema = yup.object().shape({
  text: yup.string().required(),
  notificationDays: yup.array().of(yup.number()),
  notificationTime: yup.string(),
})

const reminderColor = getRandomBrandColor()

function CreateReminderScreen({
  navigation,
}: CreateReminderScreenNavigationProps) {
  const defaultNotificationTime = new Date()

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

  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const { fetch } = useFetch()

  // @ts-ignore
  const onSelectedTimeChange = (_, selectedTime: Date | undefined) => {
    setValue('notificationTime', selectedTime?.toISOString() || '')
  }

  const onChangeField = useCallback(
    (name: ChangeFieldInput) => (text: string) => {
      setValue(name, text)
    },
    []
  )

  const createReminder = async (data: CreateReminderInput) => {
    try {
      await fetch(`${POKE_URL}/reminders`, {
        method: 'POST',
        body: JSON.stringify({ ...data, color: reminderColor }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      navigation.navigate('Reminders')
    } catch (error: any) {
      ErrorAlert({ title: 'Error Creating Reminder', message: error?.message })
    }
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

  return (
    <ScrollView
      contentContainerStyle={tw`bg-brand-${reminderColor} pt-10 pb-10`}
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
        <Text style={tw`text-2xl text-white font-bold uppercase text-center`}>
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
        value={defaultNotificationTime}
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

      <TouchableOpacity onPress={handleSubmit(createReminder)}>
        <Text style={tw`text-6xl text-center p-4 mt-8`}>✅</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default CreateReminderScreen
