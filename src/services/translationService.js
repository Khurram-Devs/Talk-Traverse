import lingvaTranslate from './translateText';
import playLingvaAudio from './playLingvaAudio';

export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Spanish", 
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
  ur: "Urdu",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  pl: "Polish",
  tr: "Turkish",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  he: "Hebrew",
  fa: "Persian",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

export const translateText = async (text, sourceLang = "en", targetLang = "es") => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  if (!sourceLang || !targetLang) {
    throw new Error("Source and target languages are required");
  }

  if (!SUPPORTED_LANGUAGES[sourceLang]) {
    throw new Error(`Unsupported source language: ${sourceLang}`);
  }

  if (!SUPPORTED_LANGUAGES[targetLang]) {
    throw new Error(`Unsupported target language: ${targetLang}`);
  }
  
  try {
    const translatedText = await lingvaTranslate(text, sourceLang, targetLang);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export const translateAndSpeak = async (text, sourceLang = "en", targetLang = "es") => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  try {
    const translatedText = await translateText(text, sourceLang, targetLang);
    
    await playLingvaAudio(targetLang, translatedText);
    
    return translatedText;
  } catch (error) {
    console.error("Translate and speak error:", error);
    throw error;
  }
};

export const getTranslationOnly = async (text, sourceLang = "en", targetLang = "es") => {
  try {
    return await translateText(text, sourceLang, targetLang);
  } catch (error) {
    console.error("Translation only error:", error);
    throw error;
  }
};

export const speakTranslatedText = async (translatedText, targetLang) => {
  if (!translatedText || !targetLang) {
    throw new Error("Translated text and target language are required");
  }

  try {
    await playLingvaAudio(targetLang, translatedText);
  } catch (error) {
    console.error("Speak translated text error:", error);
    throw error;
  }
};

export const isLanguageSupported = (languageCode) => {
  return languageCode && SUPPORTED_LANGUAGES.hasOwnProperty(languageCode);
};

export const getLanguageName = (languageCode) => {
  return SUPPORTED_LANGUAGES[languageCode] || "Unknown Language";
};

export const getSupportedLanguageCodes = () => {
  return Object.keys(SUPPORTED_LANGUAGES);
};

export const needsTranslation = (sourceLang, targetLang) => {
  return sourceLang !== targetLang;
};