import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.headerBackground }]}>
      <Text style={[styles.title, { color: theme.headerText }]}>TalkTraverse</Text>
      <Pressable onPress={toggleTheme}>
        <Text style={[styles.toggle, { color: theme.headerText }]}>
          {theme.mode === 'light' ? '🌙' : '☀️'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  toggle: {
    fontSize: 20,
  },
});
