import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'

import { supabase } from '../../lib/supabase'
import {
  ChangeFieldVerifyInput,
  VerifyAccountScreenNavigationProps,
  SignUpFormVerifyInputs,
} from '../../types'
import tw from '../../lib/tailwind'

const verifyOTPSchema = yup.object().shape({
  token: yup.string().required(),
})

function VerifyAccountScreen({
  navigation,
  route,
}: VerifyAccountScreenNavigationProps) {
  const { brandBackground } = route.params
  const [errorCount, setErrorCount] = useState(0)
  const { register, setValue, handleSubmit } = useForm<SignUpFormVerifyInputs>({
    resolver: yupResolver(verifyOTPSchema),
    defaultValues: { token: '' },
  })

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
    const { error } = await supabase.auth.verifyOTP({ phone, token })

    if (error) {
      if (errorCount === 2) {
        navigation.navigate('SignIn', {
          brandBackground,
        })
      }

      setErrorCount(errorCount + 1)
    }
  }

  return (
    <View style={tw`bg-brand-${brandBackground}`}>
      <StatusBar style="auto" />

      <View style={tw`bg-brand-${brandBackground} h-full flex justify-center`}>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Check
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Your
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Texts
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Texts
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Texts
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Texts
        </Text>

        <TextInput
          textContentType="oneTimeCode"
          style={tw`text-3xl w-full bg-white p-4 my-4 text-right`}
          onChangeText={onChangeField('token')}
          autoFocus
        ></TextInput>

        {errorCount > 0 && (
          <View style={tw`mb-4`}>
            <Text
              style={tw`text-2xl text-white font-bold uppercase text-right`}
            >
              Hmmm...
            </Text>
            <Text
              style={tw`text-2xl text-white font-bold uppercase text-right`}
            >
              Something went wrong.
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmit(verifyOTP)}
          style={tw`flex flex-row justify-end w-full`}
        >
          <Text style={tw`text-4xl`}>🔑 </Text>
          <Text style={tw`text-5xl text-white font-bold uppercase`}>
            Let Me In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default VerifyAccountScreen
