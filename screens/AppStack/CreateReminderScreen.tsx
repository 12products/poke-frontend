import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCallback, useState, useEffect, useRef } from 'react'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'

import { POKE_URL } from '@env'
import { AppStackParamList } from '../../types'
import { styles } from '../styles'
import { ErrorAlert, ErrorText } from '../utils'
import useFetch from '../../hooks/useFetch'

type CreateReminderScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'CreateReminder'
>
type ChangeFieldInput = 'text' | 'notificationDays' | 'notificationTime'

type CreateReminderInput = {
  text: string
  notificationDays: number[]
  notificationTime: string
}

type Day = {
  id: Number
  name: string
}

const days: Day[] = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

type Time = {
  id: Number
  value: string
}

const times: Time[] = [
  { id: 0, value: '05:00 am' },
  { id: 1, value: '06:00 am' },
  { id: 2, value: '07:00 am' },
  { id: 3, value: '08:00 am' },
  { id: 4, value: '09:00 am' },
  { id: 5, value: '10:00 am' },
  { id: 6, value: '11:00 am' },
  { id: 7, value: '12:00 pm' },
  { id: 8, value: '01:00 pm' },
  { id: 9, value: '02:00 pm' },
  { id: 10, value: '03:00 pm' },
  { id: 11, value: '04:00 pm' },
  { id: 12, value: '05:00 pm' },
  { id: 13, value: '06:00 pm' },
  { id: 14, value: '07:00 pm' },
  { id: 15, value: '08:00 pm' },
  { id: 16, value: '09:00 pm' },
  { id: 17, value: '10:00 pm' },
  { id: 18, value: '11:00 pm' },
  { id: 19, value: '12:00 am' },
]

const createReminderSchema = yup.object().shape({
  text: yup.string(),
  notificationDays: yup.array().of(yup.number()),
  notificationTime: yup.string(),
})

function CreateReminderScreen({
  navigation,
}: CreateReminderScreenNavigationProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReminderInput>({
    resolver: yupResolver(createReminderSchema),
    defaultValues: { text: '', notificationTime: '', notificationDays: [] },
  })
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedTime, setSelectedTime] = useState<Time[]>([])
  const { fetch } = useFetch()
  const refDay = useRef<SectionedMultiSelect<Day>>(null)
  const refTime = useRef<SectionedMultiSelect<Time>>(null)

  const onSelectedDayChange = (selectedDays: number[]) => {
    setSelectedDays(selectedDays)
    setValue('notificationDays', selectedDays)
  }

  const onSelectedTimeChange = (selectedTime: Time[]) => {
    setSelectedTime(selectedTime)

    if (!selectedTime.length) {
      setValue('notificationTime', '')
      return
    }

    const [timePrefix, timeSuffix] = selectedTime[0].value.split(' ')
    const formatedTime =
      timeSuffix === 'pm' ? parseInt(timePrefix.split(':')[0]) + 12 : timePrefix
    const dateTime = new Date(`01/01/2000 ${formatedTime}`)
    setValue('notificationTime', dateTime.toISOString())
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
        body: JSON.stringify(data),
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

  return (
    <View>
      <Text style={styles.labelInput}>Message</Text>
      <TextInput
        onChangeText={onChangeField('text')}
        style={styles.textInput}
      ></TextInput>
      <ErrorText name="text" errors={errors} />

      <Text style={styles.labelInput}>Notification Time</Text>
      <SectionedMultiSelect
        IconRenderer={() => null}
        displayKey="value"
        items={times}
        uniqueKey="id"
        single={true}
        onSelectedItemObjectsChange={onSelectedTimeChange}
        onSelectedItemsChange={() => null}
        selectedItems={selectedTime}
        showChips={false}
        hideSearch={true}
        hideSelect={true}
        ref={refTime}
      />
      <View style={styles.containerButton}>
        {!!selectedTime.length ? (
          <>
            <Text style={styles.textInput}>{selectedTime[0].value}</Text>
            <TouchableOpacity
              onPress={() => refTime?.current?._removeAllItems()}
              style={styles.button}
            >
              <Text style={styles.buttonTitle}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => refTime?.current?._toggleSelector()}
            style={styles.button}
          >
            <Text style={styles.buttonTitle}>Select Time</Text>
          </TouchableOpacity>
        )}
      </View>

      <ErrorText name="notificationTime" errors={errors} />

      <Text style={styles.labelInput}>Notification Days</Text>
      <SectionedMultiSelect
        IconRenderer={() => null}
        items={days}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedDayChange}
        selectedItems={selectedDays}
        ref={refDay}
        showCancelButton={true}
        hideSearch={true}
        hideSelect={true}
        showDropDowns={true}
      />

      <View style={styles.containerButton}>
        <TouchableOpacity
          onPress={() => refDay?.current?._toggleSelector()}
          style={styles.button}
        >
          <Text style={styles.buttonTitle}>Select Days</Text>
        </TouchableOpacity>

        {!!selectedDays.length && (
          <TouchableOpacity
            onPress={() => refDay?.current?._removeAllItems()}
            style={styles.button}
          >
            <Text style={styles.buttonTitle}>Remove All</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
        <Button title={'Confirm'} onPress={handleSubmit(createReminder)} />
      </View>
    </View>
  )
}

export default CreateReminderScreen
