import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to TalkTraverse 👋</Text>
      
      <Text style={styles.subtitle}>
        Your AI-powered translation and communication companion
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('TextToSpeech')}
        >
          <Text style={styles.buttonIcon}>🔊</Text>
          <Text style={styles.buttonText}>Text to Speech</Text>
          <Text style={styles.buttonSubtext}>Convert text to speech with translation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.buttonIcon}>💬</Text>
          <Text style={styles.buttonText}>Chat</Text>
          <Text style={styles.buttonSubtext}>Real-time chat with translation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          🌍 Supports multiple languages{'\n'}
          🎙️ Voice synthesis{'\n'}
          ⚡ Real-time translation
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8C5E8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E5C99',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A73A8',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: '#6B94CA',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonSubtext: {
    color: '#E8F4FD',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#B8D2F0',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#2E5C99',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;