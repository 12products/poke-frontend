import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCallback, useState, useEffect } from 'react'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'

import { POKE_URL } from '@env'
import { AppStackParamList } from '../../types'
import { styles } from '../styles'
import { ErrorAlert, ErrorText } from '../utils'

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

const days = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
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

  const onSelectedDayChange = (selectedDays: number[]) => {
    setSelectedDays(selectedDays)
    setValue('notificationDays', selectedDays)
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
      <TextInput
        onChangeText={onChangeField('notificationTime')}
        style={styles.textInput}
      ></TextInput>
      <ErrorText name="notificationTime" errors={errors} />
      <Text style={styles.labelInput}>Notification Days</Text>
      <SectionedMultiSelect
        IconRenderer={() => null}
        items={days}
        uniqueKey="id"
        showDropDowns={true}
        onSelectedItemsChange={onSelectedDayChange}
        selectedItems={selectedDays}
      />
      <TouchableOpacity onPress={handleSubmit(createReminder)}>
        <Text>Confirm</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CreateReminderScreen
