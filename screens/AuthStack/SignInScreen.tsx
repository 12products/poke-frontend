import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import * as yup from 'yup'

import { styles } from '../styles'
import { supabase } from '../../lib/supabase'
import { ErrorAlert, ErrorText } from '../utils'
import { SignInScreenNavigationProp, SignUpFormAuthInputs } from '../../types'
import tw from '../../lib/tailwind'

const accountSchema = yup.object().shape({
  phone: yup.string(),
})

function SignInScreen({ navigation }: SignInScreenNavigationProp) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormAuthInputs>({
    resolver: yupResolver(accountSchema),
    defaultValues: { phone: '' },
  })

  useEffect(() => {
    register('phone')
  }, [register])

  const logIn = async (data: SignUpFormAuthInputs) => {
    const { phone } = data

    // Request a verification code to sign the user in
    const { error } = await supabase.auth.signIn({ phone })

    if (error) {
      ErrorAlert({
        title: 'Error signing in',
        message: error?.message,
      })

      return
    }

    navigation.navigate('VerifyAccount', { phone })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={{ width: '80%' }}>
        <Text style={styles.labelInput}>phone number</Text>

        <TextInput
          textContentType="telephoneNumber"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(phone) => setValue('phone', phone)}
        ></TextInput>
        <ErrorText name="phone" errors={errors} />
      </View>

      <TouchableOpacity
        style={tw`bg-brand-blue w-full p-10`}
        onPress={handleSubmit(logIn)}
      >
        <Text style={styles.buttonTitle}>Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SignInScreen
