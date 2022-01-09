import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect } from 'react'
import * as yup from 'yup'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { styles } from './styles'
import { supabase } from '../supabase-service'
import { SignInFormInputs } from './AuthStack'
import { ErrorAlert, ErrorText } from './utils'
import { AuthStackParamList } from '../types'

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid Email Format')
    .required('Email is a required field'),
  password: yup.string().required('Password is a required field'),
})

type CreateAccountScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>

export function LoginScreen({
  navigation,
}: {
  navigation: CreateAccountScreenNavigationProp
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    register('email')
    register('password')
  }, [register])

  const onChangeField = useCallback(
    (name: 'email' | 'password') => (text: string) => {
      setValue(name, text)
    },
    []
  )

  const login = async (data: SignInFormInputs) => {
    const response = await supabase.auth.signIn(data)

    if (response.error) {
      ErrorAlert({
        title: 'Error Logging in User',
        message: response?.error?.message,
      })
      return
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 30 }}>This is the Login Screen</Text>

      <StatusBar style="auto" />

      <View style={{ width: '80%' }}>
        <Text style={styles.labelInput}>email address</Text>
        <TextInput
          style={styles.textInput}
          autoCompleteType="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          onChangeText={onChangeField('email')}
        ></TextInput>
        <ErrorText name="email" errors={errors} />
      </View>

      <View style={{ width: '80%' }}>
        <Text style={styles.labelInput}>password</Text>
        <TextInput
          textContentType="password"
          autoCompleteType="password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={onChangeField('password')}
        ></TextInput>
        <ErrorText name="password" errors={errors} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(login)}>
        <Text style={styles.buttonTitle}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.buttonTitle}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  )
}
