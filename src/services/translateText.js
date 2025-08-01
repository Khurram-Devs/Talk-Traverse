const LINGVA_API = "https://lingva.ml";

async function lingvaTranslate(text, sourceLang, targetLang) {
  if (!text || typeof text !== 'string') {
    throw new Error("Text must be a non-empty string");
  }

  if (!sourceLang || !targetLang) {
    throw new Error("Source and target languages are required");
  }

  if (sourceLang === targetLang) {
    return text;
  }

  try {
    const url = `${LINGVA_API}/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text.trim())}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TalkTraverse-App/1.0',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.translation) {
      return data.translation;
    } else if (data.error) {
      throw new Error(data.error);
    } else {
      throw new Error("Translation failed - no translation received");
    }
  } catch (error) {
    console.error("Lingva Translate Error:", error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error - please check your internet connection");
    } else if (error.message.includes('timeout')) {
      throw new Error("Translation request timed out - please try again");
    } else {
      throw new Error(error.message || "Translation service unavailable");
    }
  }
}

export default lingvaTranslate;