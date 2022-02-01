import { View, Text, Alert, AlertButton } from 'react-native'

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
  buttons = [{ text: 'OK' }],
}: {
  title: string
  message: string
  buttons?: AlertButton[]
}) => Alert.alert(title, message, buttons)
