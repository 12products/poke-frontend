import { AuthStackParamList } from '.'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type ChangeFieldAuthInput = 'phone'

export type SignInScreenNavigationProp = NativeStackScreenProps<
  AuthStackParamList,
  'SignIn'
>

export type SignUpFormAuthInputs = {
  phone: string
}

export type ChangeFieldVerifyInput = 'token'

export type VerifyAccountScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'VerifyAccount'
>

export type SignUpFormVerifyInputs = {
  token: string
}
