import { StatusBar } from 'expo-status-bar'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRef, useState } from 'react'
import PhoneInput from 'react-native-phone-number-input'

import { supabase } from '../../lib/supabase'
import { ErrorAlert } from '../utils'
import { SignInScreenNavigationProp, SignUpFormAuthInputs } from '../../types'
import tw from '../../lib/tailwind'

function SignInScreen({ navigation, route }: SignInScreenNavigationProp) {
  const { brandBackground } = route.params
  const phoneInput = useRef<PhoneInput>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('')
  const [validPhoneNumber, setValidPhoneNumber] = useState(true)

  const logIn = async () => {
    const isValidPhoneNumber = phoneInput.current?.isValidNumber(phoneNumber)
    if (!isValidPhoneNumber) {
      setValidPhoneNumber(false)
      return
    }

    // Request a verification code to sign the user in
    const { error } = await supabase.auth.signIn({
      phone: formattedPhoneNumber,
    })

    if (error) {
      ErrorAlert({
        title: 'Error signing in',
        message: error?.message,
      })

      return
    }

    navigation.navigate('VerifyAccount', {
      brandBackground,
      phone: formattedPhoneNumber,
    })
  }

  return (
    <View style={tw`bg-brand-${brandBackground}`}>
      <StatusBar style="auto" />

      <View style={tw`bg-brand-${brandBackground} h-full flex justify-center`}>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Enter
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Your
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Digits
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Digits
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Digits
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          Digits
        </Text>

        <PhoneInput
          ref={phoneInput}
          defaultCode="US"
          layout="first"
          onChangeText={(phone) => {
            setPhoneNumber(phone)
          }}
          onChangeFormattedText={(text) => {
            setFormattedPhoneNumber(text)
          }}
          autoFocus
          placeholder="(XXX) XXX-XXXX"
          containerStyle={tw`w-full bg-white my-4`}
          textInputStyle={tw`text-3xl text-right`}
          codeTextStyle={tw`text-xl`}
        />

        {!validPhoneNumber && (
          <View style={tw`mb-4`}>
            <Text
              style={tw`text-3xl text-white font-bold uppercase text-right`}
            >
              No funny business.
            </Text>
            <Text
              style={tw`text-2xl text-white font-bold uppercase text-right`}
            >
              Give us your actual digits.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={tw`flex flex-row justify-end w-full`}
          onPress={logIn}
        >
          <Text style={tw`text-4xl`}>👉</Text>
          <Text style={tw`text-5xl text-white font-bold uppercase`}>
            Onward
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignInScreen
