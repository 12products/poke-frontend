import { View, Text, Alert } from 'react-native'

import { BRAND_COLORS } from '../constants'

export const ErrorText = ({
  name,
  errors,
}: {
  name: string
  errors: Record<string, any>
}) => {
  return (
    <View>
      {errors[name] && (
        <Text style={{ color: 'red' }}>{errors?.[name]?.message}</Text>
      )}
    </View>
  )
}

export const ErrorAlert = ({
  title,
  message,
}: {
  title: string
  message: string
}) => Alert.alert(title, message, [{ text: 'OK' }])

export const numToDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const getRandomBrandColor = () =>
  BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
