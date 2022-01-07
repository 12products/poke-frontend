import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm, FieldError } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { styles } from "./styles";
import { supabase } from "../supabase-service";
type FormInputs = {
  email: string;
  password: string;
};

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Format")
    .required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
});

export const ErrorText = ({
  name,
  errors,
}: {
  name: string;
  errors: Record<string, any>;
}) => {
  return (
    <View>
      {errors[name] && (
        <Text style={{ color: "red" }}>{errors?.[name]?.message}</Text>
      )}
    </View>
  );
};

const ErrorAlert = ({ title, message }: { title: string; message: string }) =>
  Alert.alert(title, message, [
    { text: "OK", onPress: () => console.log("Ok pressed") },
  ]);

export function LoginScreen({ navigation }) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    register("email");
    register("password");
  }, [register]);

  const onChangeField = useCallback(
    (name: "email" | "password") => (text: string) => {
      setValue(name, text);
    },
    []
  );

  const login = async (data: FormInputs) => {
    const response = await supabase.auth.signIn(data);
    if (response.error) {
      ErrorAlert({
        title: "Error Logging in User",
        message: response?.error?.message,
      });
      return;
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 30 }}>This is the Login Screen</Text>
      <StatusBar style="auto" />

      <View style={{ width: "80%" }}>
        <Text style={styles.labelInput}>email address</Text>
        <TextInput
          style={styles.textInput}
          autoCompleteType="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          onChangeText={onChangeField("email")}
        ></TextInput>
        <ErrorText name="email" errors={errors} />
      </View>
      <View style={{ width: "80%" }}>
        <Text style={styles.labelInput}>password</Text>
        <TextInput
          textContentType="password"
          autoCompleteType="password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={onChangeField("password")}
        ></TextInput>
        <ErrorText name="password" errors={errors} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit(login)}>
        <Text style={styles.buttonTitle}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CreateAccount")}
      >
        <Text style={styles.buttonTitle}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CreateAccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is the Create Account Screen</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      ></Button>
    </View>
  );
}

const AuthStack = createNativeStackNavigator();
export function AuthScreenStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </AuthStack.Navigator>
  );
}
