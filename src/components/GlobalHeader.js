import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GlobalHeader = ({ 
  showBackButton = false, 
  showMenuButton = false, 
  centerContent,
  onBackPress,
  onMenuPress 
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      console.log('Menu pressed');
    }
  };

  return (
    <View style={styles.header}>
      {/* Left Button (Back or Empty) */}
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Content */}
      <View style={styles.centerSection}>
        {centerContent}
      </View>

      {/* Right Button (Menu or Empty) */}
      <View style={styles.rightSection}>
        {showMenuButton && (
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Text style={styles.menuButtonText}>≡</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GlobalHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#8BB6E8',
    borderRadius: 25,
    marginHorizontal: 10,
    marginTop: 10,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7BA4D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7BA4D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});