import { View, StyleSheet } from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import BottomNav from '../components/BottomNav';

const AppLayout = ({ children, headerConfig }) => {
  return (
    <View style={styles.container}>
      <GlobalHeader {...headerConfig} />
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
    backgroundColor: '#A8C5E8',
  },
  content: {
    flex: 1,
  },
});