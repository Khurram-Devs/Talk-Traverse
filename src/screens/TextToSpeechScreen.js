import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { speakText, getAvailableVoices } from "../services/speechService";
import { translateAndSpeak, SUPPORTED_LANGUAGES } from "../services";

const TextToSpeechScreen = () => {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAvailableVoices().then((voices) => {
      console.log("Available voices:", voices.length);
    });
  }, []);

  const handlePreview = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter some text to preview");
      return;
    }

    speakText(text, {
      language: "en",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const handleTranslateAndSpeak = async () => {
    try {
      const translated = await translateAndSpeak(text, "en", targetLang);
      setTranslatedText(translated);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleClear = () => {
    setText("");
    setTranslatedText("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Enter Text</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type something to speak or translate..."
            placeholderTextColor="#B0C4DE"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.sectionTitle}>Target Language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={targetLang}
            onValueChange={(itemValue) => setTargetLang(itemValue)}
            style={styles.picker}
            dropdownIconColor="#2E5C99"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <Picker.Item
                key={code}
                label={name}
                value={code}
                color="#2E5C99"
              />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.previewButton]}
            onPress={handlePreview}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>🔊 Preview Original</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.translateButton]}
            onPress={handleTranslateAndSpeak}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "⏳ Translating..." : "🌐 Translate & Speak"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>🗑️ Clear</Text>
          </TouchableOpacity>
        </View>

        {translatedText ? (
          <View style={styles.translationContainer}>
            <Text style={styles.sectionTitle}>Translated Text</Text>
            <View style={styles.translationBox}>
              <Text style={styles.translatedText}>{translatedText}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Tip: Use the preview button to hear the original text, or
            translate & speak to hear it in the selected language.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8C5E8",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E5C99",
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: "#B8D2F0",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#2E5C99",
    minHeight: 100,
    maxHeight: 150,
  },
  pickerContainer: {
    backgroundColor: "#B8D2F0",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "white",
    color: "#2E5C99",
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewButton: {
    backgroundColor: "#4A73A8",
  },
  translateButton: {
    backgroundColor: "#2E5C99",
  },
  clearButton: {
    backgroundColor: "#6B94CA",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  translationContainer: {
    marginBottom: 20,
  },
  translationBox: {
    backgroundColor: "#B8D2F0",
    borderRadius: 15,
    padding: 15,
  },
  translatedText: {
    fontSize: 16,
    color: "#2E5C99",
    lineHeight: 22,
  },
  infoContainer: {
    backgroundColor: "#B8D2F0",
    borderRadius: 10,
    padding: 15,
  },
  infoText: {
    color: "#2E5C99",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default TextToSpeechScreen;
