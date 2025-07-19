import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AppLayout from '../layout/AppLayout';

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
    </Stack.Navigator>
  );
};

export default AppNavigator;
