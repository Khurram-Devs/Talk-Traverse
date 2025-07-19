import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";
import { useState, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";
import lingvaTranslate from "../services/translateText";

const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ur: "Urdu",
};

const TextToSpeechScreen = () => {
  useEffect(() => {
    (async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log("Available voices:", voices);
    })();
  }, []);
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translatedText, setTranslatedText] = useState("");

  const handlePreview = () => {
    if (!text.trim()) return;
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const handleTranslateAndSpeak = async () => {
    if (!targetLang) {
      alert("Please select a language to translate to.");
      return;
    }

    try {
      const translated = await lingvaTranslate(text, "en", targetLang);
      setTranslatedText(translated);
      Speech.speak(translated, { language: targetLang });
    } catch (error) {
      console.error("Translation failed:", error);
      Alert.alert("Translation failed", error.message);
    }
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

      <Text style={[styles.label, { color: theme.text }]}>
        Choose target language:
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={targetLang}
          onValueChange={(itemValue) => setTargetLang(itemValue)}
          style={{ color: theme.text }}
          dropdownIconColor={theme.text}
        >
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <Picker.Item key={code} label={name} value={code} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="🔊 Preview"
          onPress={handlePreview}
          color={theme.primary}
        />
        <Button
          title="🌐 Translate & Speak"
          onPress={handleTranslateAndSpeak}
          color={theme.primary}
        />
      </View>
    </View>
  );
};

export default TextToSpeechScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "column",
    gap: 10,
  },
});
