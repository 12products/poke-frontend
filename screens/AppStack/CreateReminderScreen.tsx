import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCallback, useState, useEffect, useRef } from 'react'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import DateTimePicker from '@react-native-community/datetimepicker'

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
  const [isTimePickerVisible, setTimePickerVisible] = useState(false)
  const [date, setDate] = useState(new Date())
  const { fetch } = useFetch()
  const refDay = useRef<SectionedMultiSelect<Day>>(null)

  const onSelectedDayChange = (selectedDays: number[]) => {
    setSelectedDays(selectedDays)
    setValue('notificationDays', selectedDays)
  }
  // @ts-ignore
  const onSelectedTimeChange = (_, selectedTime: Date | undefined) => {
    setValue('notificationTime', selectedTime?.toISOString() || '')
  }

  const notificationTimeTitle = isTimePickerVisible
    ? 'Confirm date'
    : 'Show Time Picker'

  const onChangeField = useCallback(
    (name: ChangeFieldInput) => (text: string) => {
      setValue(name, text)
    },
    []
  )

  const createReminder = async (data: CreateReminderInput) => {
    try {
      console.log(POKE_URL)
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

      <View>
        <Button
          title={notificationTimeTitle}
          onPress={() => setTimePickerVisible(!isTimePickerVisible)}
        />
      </View>
      <View>
        {isTimePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'time'}
            display="spinner"
            onChange={onSelectedTimeChange}
            minuteInterval={5}
            textColor="green"
          />
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

      <View>
        <Button
          onPress={() => refDay?.current?._toggleSelector()}
          title="Select Days"
        />

        {!!selectedDays.length && (
          <TouchableOpacity onPress={() => refDay?.current?._removeAllItems()}>
            <Text>Remove All</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ margin: 10 }}>
        <Button title={'Confirm'} onPress={handleSubmit(createReminder)} />
      </View>
    </View>
  )
}

export default CreateReminderScreen
