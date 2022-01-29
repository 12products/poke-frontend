import { NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<AuthStackParamList> | undefined
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>

export type AuthStackParamList = {
  SignIn: { brandBackground: string }
  VerifyAccount: { brandBackground: string; phone: string }
}

export type OnboardStackParamList = {
  Onboard: { brandBackground: string }
}

export type AppStackParamList = {
  Onboard: undefined
  Reminders: undefined
  CreateReminder: undefined
}
