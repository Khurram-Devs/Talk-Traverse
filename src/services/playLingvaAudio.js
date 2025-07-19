import { Audio } from "expo-av";

const LINGVA_API = "https://lingva.ml";

export default async function playLingvaAudio(lang, text) {
  try {
    const response = await fetch(`${LINGVA_API}/api/v1/audio/${lang}/${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.audio || !Array.isArray(data.audio)) {
      throw new Error("No audio received from Lingva.");
    }

    const byteArray = new Uint8Array(data.audio);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);

    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  } catch (error) {
    console.error("Lingva audio playback error:", error);
    throw error;
  }
}
