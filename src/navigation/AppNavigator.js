import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TextToSpeechScreen from "../screens/TextToSpeechScreen";
import ChatScreen from "../screens/ChatScreen";
import AppLayout from "../layout/AppLayout";

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
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
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