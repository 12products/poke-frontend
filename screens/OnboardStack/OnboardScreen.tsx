import { StatusBar } from 'expo-status-bar'
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { POKE_URL } from '../../constants'
import { OnboardStackParamList } from '../../types'
import useFetch from '../../hooks/useFetch'
import useAuth from '../../hooks/useAuth'
import { ErrorText } from '../utils'
import tw from '../../lib/tailwind'

type OnboardScreenNavigationProps = NativeStackScreenProps<
  OnboardStackParamList,
  'Onboard'
>

export type OnboardFormInputs = {
  name: string
}

const onboardSchema = yup.object().shape({
  name: yup.string(),
})

function OnboardScreen({ route }: OnboardScreenNavigationProps) {
  const { brandBackground } = route.params
  const { fetch } = useFetch()
  const { user, setHasOnboarded } = useAuth()

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

  const updateUser = async (data: OnboardFormInputs) => {
    const { name } = data

    try {
      await fetch(`${POKE_URL}/users/${user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, onboarded: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setHasOnboarded(true)
    } catch (error: any) {
      console.error('Failed to update user', error)
    }
  }

  return (
    <ScrollView contentContainerStyle={tw`h-full bg-brand-${brandBackground}`}>
      <StatusBar style="auto" />

      <View style={tw`bg-brand-${brandBackground} h-full  flex justify-center`}>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          What's
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          your
        </Text>
        <Text style={tw`text-6xl text-white font-bold uppercase text-right`}>
          name?
        </Text>

        <TextInput
          onChangeText={(name) => setValue('name', name)}
          style={tw`text-3xl w-full bg-white p-4 my-4 text-right`}
        ></TextInput>
        <ErrorText name="text" errors={errors} />

        <TouchableOpacity
          style={tw`flex flex-row justify-end w-full`}
          onPress={handleSubmit(updateUser)}
        >
          <Text style={tw`text-5xl text-white font-bold uppercase`}>
            I'm Ready
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default OnboardScreen
