import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TextToSpeechScreen from "../screens/TextToSpeechScreen";
import AppLayout from "../layout/AppLayout";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        children={() => (
          <AppLayout>
            <HomeScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen
        name="TextToSpeech"
        children={() => (
          <AppLayout>
            <TextToSpeechScreen />
          </AppLayout>
        )}
      />
      <Stack.Screen
        name="Chat"
        children={() => (
          <AppLayout>
            <ChatScreen />
          </AppLayout>
        )}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
