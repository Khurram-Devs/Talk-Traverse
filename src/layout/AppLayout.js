import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/ThemeContext';

const AppLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <Header /> */}
      <View style={styles.content}>
        {children}
      </View>
      <BottomNav />
    </View>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
