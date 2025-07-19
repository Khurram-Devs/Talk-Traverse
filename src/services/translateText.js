async function lingvaTranslate(text, sourceLang, targetLang) {
    try {
      const response = await fetch(
        `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`
      );
  
      const data = await response.json();
  
      if (data.translation) {
        return data.translation;
      } else {
        throw new Error(data.error || "Translation failed.");
      }
    } catch (error) {
      console.error("Lingva Translate Error:", error);
      throw error;
    }
  }
export default lingvaTranslate;