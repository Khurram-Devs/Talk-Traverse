import { Audio } from "expo-av";

const LINGVA_API = "https://lingva.ml";

const setupAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  } catch (error) {
    console.warn("Audio setup failed:", error);
  }
};

setupAudio();

export default async function playLingvaAudio(lang, text) {
  if (!lang || !text) {
    throw new Error("Language and text are required");
  }

  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error("Text must be a non-empty string");
  }

  let sound = null;

  try {
    const url = `${LINGVA_API}/api/v1/audio/${lang}/${encodeURIComponent(text.trim())}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TalkTraverse-App/1.0',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch audio`);
    }

    const data = await response.json();

    if (!data.audio || !Array.isArray(data.audio)) {
      throw new Error("Invalid audio data received from server");
    }

    const byteArray = new Uint8Array(data.audio);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);

    const { sound: audioSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      {
        shouldPlay: false,
        isLooping: false,
        volume: 1.0,
      }
    );

    sound = audioSound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync().catch(console.warn);
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {
          console.warn("Error revoking audio URL:", e);
        }
      }
    });

    await sound.playAsync();
    
    return sound;

  } catch (error) {
    console.error("Lingva audio playback error:", error);
    
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (cleanupError) {
        console.warn("Error cleaning up sound:", cleanupError);
      }
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error - please check your internet connection");
    } else if (error.message.includes('timeout')) {
      throw new Error("Audio request timed out - please try again");
    } else if (error.message.includes('Invalid audio data')) {
      throw new Error("Audio service temporarily unavailable");
    } else {
      throw new Error(error.message || "Audio playback failed");
    }
  }
}

export const stopLingvaAudio = async (soundObject) => {
  if (soundObject) {
    try {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    } catch (error) {
      console.warn("Error stopping Lingva audio:", error);
    }
  }
};
