import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect } from "react";
import { styles } from "./styles";
import * as yup from "yup";
import { supabase } from "../supabase-service";
import { FormInputs } from "./AuthStack";
import { ErrorAlert, ErrorText } from "./utils";

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const accountSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Format")
    .required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
  finamerst: yup.string().required("Name is a required field"),
  phone: yup.string().matches(phoneRegex, "Invalid phone number!"),
});

type changeFieldInput = "email" | "name" | "phone" | "password";

export function CreateAccountScreen({ navigation }) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(accountSchema),
    defaultValues: { email: "", password: "", name: "", phone: "" },
  });

  useEffect(() => {
    register("email");
    register("password");
    register("name");
    register("phone");
  }, [register]);

  const onChangeField = useCallback(
    (name: changeFieldInput) => (text: string) => {
      setValue(name, text);
    },
    []
  );

  const createAccount = async (data: FormInputs) => {
    const { email, password } = data;

    // sign up user
    const response = await supabase.auth.signUp({ email, password });
    if (response.error) {
      ErrorAlert({
        title: "Error creating new User",
        message: response?.error?.message,
      });
      
      return;
    }

    const id = response.user?.id;
  };
  
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 30 }}>
        This is the Create Account Screen
      </Text>
      <StatusBar style="auto" />

      <View style={{ width: "80%" }}>
        <Text style={styles.labelInput}>name</Text>
        <TextInput
          style={styles.textInput}
          textContentType="name"
          autoCapitalize="none"
          onChangeText={onChangeField("name")}
        ></TextInput>
        <ErrorText name="name" errors={errors} />
      </View>
      <View style={{ width: "80%" }}>
        <Text style={styles.labelInput}>phone number</Text>
        <TextInput
          textContentType="telephoneNumber"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={onChangeField("phone")}
        ></TextInput>
        <ErrorText name="last" errors={errors} />
      </View>

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(createAccount)}
      >
        <Text style={styles.buttonTitle}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonTitle}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
}
