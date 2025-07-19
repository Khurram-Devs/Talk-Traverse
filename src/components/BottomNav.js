import { View, Text, StyleSheet } from 'react-native';

const BottomNav = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Text>Settings</Text>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
