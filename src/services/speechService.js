import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.warn("Audio configuration failed:", error);
  }
};

configureAudio();

export const speakText = (text, options = {}) => {
  if (!text || typeof text !== 'string') {
    throw new Error("Text must be a non-empty string");
  }

  const defaultOptions = {
    language: "en",
    pitch: 1.0,
    rate: 0.9,
    quality: Speech.VoiceQuality.Default,
    ...options
  };
  
  return Speech.speak(text.trim(), defaultOptions);
};

export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices || [];
  } catch (error) {
    console.error("Error getting voices:", error);
    return [];
  }
};

export const stopSpeaking = () => {
  try {
    Speech.stop();
  } catch (error) {
    console.error("Error stopping speech:", error);
  }
};

export const pauseSpeaking = () => {
  try {
    Speech.pause();
  } catch (error) {
    console.error("Error pausing speech:", error);
  }
};

export const resumeSpeaking = () => {
  try {
    Speech.resume();
  } catch (error) {
    console.error("Error resuming speech:", error);
  }
};

export const isSpeaking = () => {
  try {
    return Speech.isSpeakingAsync();
  } catch (error) {
    console.error("Error checking speech status:", error);
    return Promise.resolve(false);
  }
};

export const getVoicesForLanguage = async (languageCode) => {
  try {
    const allVoices = await getAvailableVoices();
    return allVoices.filter(voice => 
      voice.language.toLowerCase().startsWith(languageCode.toLowerCase())
    );
  } catch (error) {
    console.error("Error getting voices for language:", error);
    return [];
  }
};