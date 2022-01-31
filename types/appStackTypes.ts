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
  id: number
  name: string
}

export type RemindersScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Reminders'
>

export type SettingsScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Settings'
>

export interface Reminder {
  id: string
  text: string
  notificationTime: string
  notificationDays: number[]
  userId: string
  emoji: string
  color: string
  createdAt: string
  updatedAt: string
}
