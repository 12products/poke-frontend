import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button, StyleSheet } from "react-native";

export function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the Login Screen</Text>
      <Button title="Create Account" onPress={() => null}></Button>
    </View>
  );
}

export function CreateAccountScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the Create Account Screen</Text>
      <Button title="Create Account" onPress={() => null}></Button>
    </View>
  );
}

const AuthStack = createNativeStackNavigator();
export function AuthScreenStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Create Account" component={CreateAccountScreen} />
    </AuthStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
