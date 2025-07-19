import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

const TextToSpeechScreen = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');

  const handleSpeak = () => {
    if (text.trim() === '') return;
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>
        Enter text to speak:
      </Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.text }]}
        placeholder="Type something..."
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Speak" onPress={handleSpeak} color={theme.primary} />
    </View>
  );
};

export default TextToSpeechScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});
