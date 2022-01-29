import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { POKE_URL } from '../../constants'
import { AppStackParamList } from '../../types'
import useFetch from '../../hooks/useFetch'
import useAuth from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { ErrorText } from '../utils'
import tw from '../../lib/tailwind'

type OnboardScreenNavigationProps = NativeStackScreenProps<
  AppStackParamList,
  'Onboard'
>

export type OnboardFormInputs = {
  name: string
}

const onboardSchema = yup.object().shape({
  name: yup.string(),
})

function OnboardScreen({ navigation }: OnboardScreenNavigationProps) {
  const { fetch } = useFetch()
  const { session, hasOnboarded, setHasOnboarded } = useAuth()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardFormInputs>({
    resolver: yupResolver(onboardSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    register('name')
  }, [register])

  useEffect(() => {
    const onboardUser = async () => {
      try {
        await fetch(`${POKE_URL}/users/onboard`)
      } catch (error: any) {
        console.error('Failed to get or create user', error)
      }
    }

    if (!hasOnboarded) {
      onboardUser()
    }
  }, [])

  const updateUser = async (data: OnboardFormInputs) => {
    const { name } = data

    try {
      await fetch(`${POKE_URL}/users/${session?.user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, onboarded: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setHasOnboarded(true)
      // Save the onboarding in Supabase's metadata
      await supabase.auth.update({ data: { onboarded: true } })

      navigation.navigate('Reminders')
    } catch (error: any) {
      console.error('Failed to update user', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to POKE. 👈</Text>

      <Text>What should we call you?</Text>
      <TextInput onChangeText={(name) => setValue('name', name)}></TextInput>
      <ErrorText name="text" errors={errors} />

      <TouchableOpacity
        style={tw`bg-brand-blue w-full p-10`}
        onPress={handleSubmit(updateUser)}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#ebfafe',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})

export default OnboardScreen
