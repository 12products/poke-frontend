import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect } from 'react'
import * as yup from 'yup'

import { styles } from '../styles'
import { supabase } from '../../lib/supabase'
import { ErrorAlert, ErrorText } from '../utils'
import {
  ChangeFieldVerifyInput,
  VerifyAccountScreenNavigationProps,
  SignUpFormVerifyInputs,
} from '../../types'
import tw from '../../lib/tailwind'
import useAuth from '../../hooks/useAuth'
import useFetch from '../../hooks/useFetch'
import { POKE_URL } from '@env'

const verifyOTPSchema = yup.object().shape({
  token: yup.string().required(),
})

function VerifyAccountScreen({ route }: VerifyAccountScreenNavigationProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormVerifyInputs>({
    resolver: yupResolver(verifyOTPSchema),
    defaultValues: { token: '' },
  })
  const { session, isAuthenticated, setSession } = useAuth()
  const { fetch } = useFetch()

  useEffect(() => {
    register('token')
  }, [register])

  const onChangeField = useCallback(
    (name: ChangeFieldVerifyInput) => (value: string) => {
      setValue(name, value)
    },
    []
  )

  const verifyOTP = async (data: SignUpFormVerifyInputs) => {
    const { token } = data
    const { phone } = route.params

    // Verify the OTP token from Twilio
    const { session, error } = await supabase.auth.verifyOTP({ phone, token })

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

export default VerifyAccountScreen
