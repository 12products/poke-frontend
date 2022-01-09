import { View, Text, Alert } from 'react-native'

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
