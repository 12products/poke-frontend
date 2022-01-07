/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreenStack } from "../screens/AuthStack";
import { HomeScreenStack } from "../screens/HomeStack";
import * as React from "react";
import { useState, useEffect } from "react";
import { ColorSchemeName, Pressable } from "react-native";
import NotFoundScreen from "../screens/NotFoundScreen";
import { supabase } from "../supabase-service";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isAuthenticated ? <HomeScreenStack /> : <AuthScreenStack />}
    </NavigationContainer>
  );
}
