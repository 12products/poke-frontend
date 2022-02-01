import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { FontAwesome5 } from '@expo/vector-icons'

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
    <SafeAreaView style={tw`bg-brand-${brandBackground}`}>
      <ScrollView
        contentContainerStyle={tw`h-full bg-brand-${brandBackground} my-10`}
      >
        <View>
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
            style={tw`text-3xl w-full bg-white p-4 mt-4 text-right`}
            onChangeText={onChangeField('token')}
            keyboardType="numeric"
          ></TextInput>

          {errorCount > 0 && (
            <View style={tw`bg-black py-2`}>
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
            style={tw`flex flex-row justify-end w-full mt-4`}
          >
            <FontAwesome5
              name="key"
              size={32}
              color="white"
              style={tw`mr-4 pt-2`}
            />
            <Text style={tw`text-5xl text-white font-bold uppercase`}>
              Let Me In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default VerifyAccountScreen
