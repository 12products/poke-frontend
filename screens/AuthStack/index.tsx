import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignInScreen } from './SignInScreen'
import { VerifyAccountScreen } from './VerifyAccountScreen'

const AuthStack = createNativeStackNavigator()

export function AuthScreenStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
    </AuthStack.Navigator>
  )
}
