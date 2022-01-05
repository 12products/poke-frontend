import { Button, StyleSheet, Text, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text> This is the HOME page</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text> This is the PROFILE page</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <>
      <DrawerContentScrollView {...props}>
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ marginBottom: 30 }}>
        <Button
          title="LOGOUT"
          onPress={() => {
            props.navigation.closeDrawer();
            // Todo: log out code
          }}
        ></Button>
      </View>
    </>
  );
}
const DrawerStack = createDrawerNavigator();
export function HomeScreenStack() {
  return (
    <DrawerStack.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <DrawerStack.Screen name="Home" component={HomeScreen} />
      <DrawerStack.Screen name="Profile" component={ProfileScreen} />
    </DrawerStack.Navigator>
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
