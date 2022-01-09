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
  phone: string
}

const accountSchema = yup.object().shape({
  phone: yup.string(),
})

type ChangeFieldInput = 'phone'

type SignInScreenNavigationProp = NativeStackScreenProps<
  AuthStackParamList,
  'SignIn'
>

export function SignInScreen({ navigation }: SignInScreenNavigationProp) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(accountSchema),
    defaultValues: { phone: '' },
  })

  useEffect(() => {
    register('phone')
  }, [register])

  const onChangeField = useCallback(
    (name: ChangeFieldInput) => (text: string) => {
      setValue(name, text)
    },
    []
  )

  const createAccount = async (data: SignUpFormInputs) => {
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
          onChangeText={onChangeField('phone')}
        ></TextInput>

        <ErrorText name="phone" errors={errors} />
      </View>

      <TouchableOpacity
        style={tw`bg-brand-blue w-full p-10`}
        onPress={handleSubmit(createAccount)}
      >
        <Text style={styles.buttonTitle}>Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}
