import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const HomeScreen = () => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Welcome to TalkTraverse 👋
      </Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
