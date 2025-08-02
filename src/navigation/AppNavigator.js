import React from "react";
import { Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TextToSpeechScreen from "../screens/TextToSpeechScreen";
import ChatScreen from "../screens/ChatScreen";
import AppLayout from "../layout/AppLayout";
import SignupScreen from "../screens/SignupScreen";
import UserListScreen from "../screens/UserListScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const homeHeaderConfig = {
    showBackButton: false,
    showMenuButton: true,
    centerContent: <Text style={styles.appTitle}>TalkTraverse</Text>,
    onMenuPress: () => {
      console.log("Menu pressed from home");
    },
  };

  const signupHeaderConfig = {
    showBackButton: false,
    showMenuButton: false,
    centerContent: <Text style={styles.appTitle}>Sign Up</Text>,
    onMenuPress: () => {
      console.log("Menu pressed from home");
    },
  };

  const loginHeaderConfig = {
    showBackButton: false,
    showMenuButton: false,
    centerContent: <Text style={styles.appTitle}>Login</Text>,
    onMenuPress: () => {
      console.log("Menu pressed from home");
    },
  };

  const usersHeaderConfig = {
    showBackButton: true,
    showMenuButton: true,
    centerContent: <Text style={styles.appTitle}>Users</Text>,
    onMenuPress: () => {
      console.log("Menu pressed from home");
    },
  };

  const textToSpeechHeaderConfig = {
    showBackButton: true,
    showMenuButton: false,
    centerContent: <Text style={styles.appTitle}>Text to Speech</Text>,
    onBackPress: () => {
      console.log("Back pressed from TextToSpeech");
    },
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        children={() => (
          <AppLayout headerConfig={homeHeaderConfig}>
            <HomeScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen
        name="TextToSpeech"
        children={() => (
          <AppLayout headerConfig={textToSpeechHeaderConfig}>
            <TextToSpeechScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen
        name="Signup"
        children={() => (
          <AppLayout headerConfig={signupHeaderConfig}>
            <SignupScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen
        name="Login"
        children={() => (
          <AppLayout headerConfig={loginHeaderConfig}>
            <LoginScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen
        name="Users"
        children={() => (
          <AppLayout headerConfig={usersHeaderConfig}>
            <UserListScreen />
          </AppLayout>
        )}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  appTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
