import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CreateAccountScreen } from './CreateAccountScreen'
import { LoginScreen } from './LoginScreen'

export type SignUpFormInputs = {
  email: string
  password: string
  name: string
  phone: string
}

export type SignInFormInputs = {
  email: string
  password: string
}

const AuthStack = createNativeStackNavigator()

export function AuthScreenStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </AuthStack.Navigator>
  )
}
