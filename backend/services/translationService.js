const { GoogleGenerativeAI } = require('@google/generative-ai');

class TranslationService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Supported languages
    this.supportedLanguages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'ar': 'Arabic',
      'tr': 'Turkish',
      'pl': 'Polish',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
      'ms': 'Malay',
      'tl': 'Filipino',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'mr': 'Marathi',
      'or': 'Odia',
      'as': 'Assamese'
    };
  }

  /**
   * Translate text from one language to another
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
   * @returns {Promise<Object>} Translation result
   */
  async translateText(text, targetLanguage, sourceLanguage = null) {
    try {
      if (!this.supportedLanguages[targetLanguage]) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      const targetLangName = this.supportedLanguages[targetLanguage];
      const sourceLangName = sourceLanguage ? this.supportedLanguages[sourceLanguage] : 'auto-detect';

      const prompt = sourceLanguage 
        ? `Translate the following text from ${sourceLangName} to ${targetLangName}. Only provide the translation, no explanations:\n\n${text}`
        : `Translate the following text to ${targetLangName}. Only provide the translation, no explanations:\n\n${text}`;

      const result = await this.model.generateContent(prompt);
      const translatedText = result.response.text().trim();

      return {
        success: true,
        originalText: text,
        translatedText,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
        detectedLanguage: null // Gemini doesn't provide this directly
      };

    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Detect the language of given text
   * @param {string} text - Text to detect language for
   * @returns {Promise<Object>} Language detection result
   */
  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of the following text and respond with only the ISO 639-1 language code (e.g., 'en' for English, 'es' for Spanish). If uncertain, respond with 'unknown':\n\n${text}`;

      const result = await this.model.generateContent(prompt);
      const detectedCode = result.response.text().trim().toLowerCase();

      const languageName = this.supportedLanguages[detectedCode] || 'Unknown';

      return {
        success: true,
        text,
        detectedLanguage: detectedCode,
        languageName,
        confidence: detectedCode !== 'unknown' ? 0.8 : 0.1 // Simulated confidence
      };

    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(`Language detection failed: ${error.message}`);
    }
  }

  /**
   * Translate agricultural content with context awareness
   * @param {string} text - Agricultural text to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} context - Context type (weather, market, pest, soil, yield)
   * @returns {Promise<Object>} Context-aware translation result
   */
  async translateAgriculturalContent(text, targetLanguage, context = 'general') {
    try {
      if (!this.supportedLanguages[targetLanguage]) {
        throw new Error(`Unsupported target language: ${targetLanguage}`);
      }

      const targetLangName = this.supportedLanguages[targetLanguage];
      const contextPrompts = {
        weather: 'This is weather-related agricultural content. Use appropriate meteorological and farming terminology.',
        market: 'This is market/pricing-related agricultural content. Use appropriate economic and trading terminology.',
        pest: 'This is pest detection and management content. Use appropriate entomological and plant pathology terminology.',
        soil: 'This is soil analysis and management content. Use appropriate soil science and agronomy terminology.',
        yield: 'This is crop yield prediction content. Use appropriate agricultural statistics and forecasting terminology.',
        general: 'This is general agricultural content. Use appropriate farming and agricultural terminology.'
      };

      const contextHint = contextPrompts[context] || contextPrompts.general;

      const prompt = `${contextHint} Translate the following agricultural text to ${targetLangName}. Maintain technical accuracy and use appropriate agricultural terminology. Only provide the translation:\n\n${text}`;

      const result = await this.model.generateContent(prompt);
      const translatedText = result.response.text().trim();

      return {
        success: true,
        originalText: text,
        translatedText,
        targetLanguage,
        context,
        isAgriculturalContent: true
      };

    } catch (error) {
      console.error('Agricultural translation error:', error);
      throw new Error(`Agricultural translation failed: ${error.message}`);
    }
  }

  /**
   * Get all supported languages
   * @returns {Object} Supported languages object
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Get supported language codes
   * @returns {Array} Array of language codes
   */
  getSupportedLanguageCodes() {
    return Object.keys(this.supportedLanguages);
  }

  /**
   * Batch translate multiple texts
   * @param {Array} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<Array>} Array of translation results
   */
  async batchTranslate(texts, targetLanguage, sourceLanguage = null) {
    try {
      const results = [];
      
      // Process in batches to avoid rate limiting
      const batchSize = 5;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchPromises = batch.map(text => 
          this.translateText(text, targetLanguage, sourceLanguage)
        );
        
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(result => 
          result.status === 'fulfilled' ? result.value : { 
            success: false, 
            error: result.reason.message 
          }
        ));
        
        // Small delay between batches
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return {
        success: true,
        results,
        totalTranslated: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      };

    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error(`Batch translation failed: ${error.message}`);
    }
  }
}

module.exports = new TranslationService();