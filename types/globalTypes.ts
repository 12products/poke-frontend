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
  Login: undefined
  SignIn: undefined
  VerifyAccount: { phone: string }
}

export type AppStackParamList = {
  Onboard: undefined
  Reminders: undefined
  CreateReminder: undefined
}
