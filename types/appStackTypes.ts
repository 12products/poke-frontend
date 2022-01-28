import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { AppStackParamList } from '.'

export type CreateReminderScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'CreateReminder'
>
export type ChangeFieldInput = 'text' | 'notificationDays' | 'notificationTime'

export type CreateReminderInput = {
  text: string
  notificationDays: number[]
  notificationTime: string
}

export type Day = {
  id: Number
  name: string
}

export type RemindersScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Reminders'
>

export interface Reminder {
  id: string
  text: string
  notificationTime: string
  notificationDays: Number[]
  userId: string
  emoji: string
  createdAt: string
  updatedAt: string
}
