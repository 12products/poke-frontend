import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect } from 'react'
import * as yup from 'yup'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { styles } from '../styles'
import { supabase } from '../../supabase-service'
import { ErrorAlert, ErrorText } from '../utils'
import { AuthStackParamList } from '../../types'
import tw from '../../lib/tailwind'

export type SignUpFormInputs = {
  token: string
}

const verifyOTPSchema = yup.object().shape({
  token: yup.string().required(),
})

type ChangeFieldInput = 'token'

type VerifyAccountScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'VerifyAccount'
>

export function VerifyAccountScreen({
  route,
  navigation,
}: VerifyAccountScreenNavigationProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(verifyOTPSchema),
    defaultValues: { token: '' },
  })

  useEffect(() => {
    register('token')
  }, [register])

  const onChangeField = useCallback(
    (name: ChangeFieldInput) => (value: string) => {
      setValue(name, value)
    },
    []
  )

  const verifyOTP = async (data: SignUpFormInputs) => {
    const { token } = data
    const { phone } = route.params

    // Verify the OTP token from Twilio
    const { error } = await supabase.auth.verifyOTP({ phone, token })

    if (error) {
      ErrorAlert({
        title: 'Error verifying phone number',
        message: error?.message,
      })

      return
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={{ width: '80%' }}>
        <Text style={styles.labelInput}>phone number</Text>

        <TextInput
          textContentType="oneTimeCode"
          style={styles.textInput}
          onChangeText={onChangeField('token')}
        ></TextInput>

        <ErrorText name="token" errors={errors} />
      </View>

      <TouchableOpacity
        style={tw`bg-brand-blue`}
        onPress={handleSubmit(verifyOTP)}
      >
        <Text style={styles.buttonTitle}>Verify Phone Number</Text>
      </TouchableOpacity>
    </View>
  )
}
