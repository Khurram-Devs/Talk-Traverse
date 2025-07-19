import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Text>Home</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("TextToSpeech")}>
        <Text>🔊 Speak</Text>
      </Pressable>
    </View>
  );
};

export default BottomNav;
    
const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
