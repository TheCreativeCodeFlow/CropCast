import apiClient from './apiClient';

// Translation service for multilingual features
export const translationService = {
  // Get all supported languages
  async getSupportedLanguages() {
    return apiClient.get('/translation/languages');
  },

  // Translate text
  async translateText(text, targetLanguage, sourceLanguage = null) {
    const data = {
      text,
      targetLanguage,
      ...(sourceLanguage && { sourceLanguage })
    };
    return apiClient.post('/translation/translate', data);
  },

  // Detect language of text
  async detectLanguage(text) {
    return apiClient.post('/translation/detect', { text });
  },

  // Translate agricultural content with context
  async translateAgriculturalContent(text, targetLanguage, context = 'general') {
    const data = {
      text,
      targetLanguage,
      context
    };
    return apiClient.post('/translation/translate/agricultural', data);
  },

  // Batch translate multiple texts
  async batchTranslate(texts, targetLanguage, sourceLanguage = null) {
    const data = {
      texts,
      targetLanguage,
      ...(sourceLanguage && { sourceLanguage })
    };
    return apiClient.post('/translation/translate/batch', data);
  },

  // Get translation history
  async getTranslationHistory() {
    return apiClient.get('/translation/history');
  },

  // Helper methods for common translation scenarios
  
  // Translate weather data
  async translateWeatherData(weatherData, targetLanguage) {
    const textsToTranslate = [];
    const keys = [];

    // Extract translatable text from weather data
    if (weatherData.current?.description) {
      textsToTranslate.push(weatherData.current.description);
      keys.push('current.description');
    }

    if (weatherData.farmingRecommendations) {
      weatherData.farmingRecommendations.forEach((rec, index) => {
        if (rec.title) {
          textsToTranslate.push(rec.title);
          keys.push(`farmingRecommendations.${index}.title`);
        }
        if (rec.description) {
          textsToTranslate.push(rec.description);
          keys.push(`farmingRecommendations.${index}.description`);
        }
      });
    }

    if (textsToTranslate.length === 0) return weatherData;

    const batchResult = await this.batchTranslate(textsToTranslate, targetLanguage);
    
    if (batchResult.success) {
      const translatedData = { ...weatherData };
      
      batchResult.data.results.forEach((result, index) => {
        if (result.success) {
          const key = keys[index];
          const keyParts = key.split('.');
          
          if (keyParts.length === 2) {
            translatedData[keyParts[0]][keyParts[1]] = result.translatedText;
          } else if (keyParts.length === 3) {
            const arrayIndex = parseInt(keyParts[1]);
            translatedData[keyParts[0]][arrayIndex][keyParts[2]] = result.translatedText;
          }
        }
      });
      
      return translatedData;
    }
    
    return weatherData;
  },

  // Translate market data
  async translateMarketData(marketData, targetLanguage) {
    const textsToTranslate = [];
    const keys = [];

    if (Array.isArray(marketData.prices)) {
      marketData.prices.forEach((price, index) => {
        if (price.commodity?.name) {
          textsToTranslate.push(price.commodity.name);
          keys.push(`prices.${index}.commodity.name`);
        }
        if (price.market?.name) {
          textsToTranslate.push(price.market.name);
          keys.push(`prices.${index}.market.name`);
        }
      });
    }

    if (textsToTranslate.length === 0) return marketData;

    const batchResult = await this.batchTranslate(textsToTranslate, targetLanguage);
    
    if (batchResult.success) {
      const translatedData = { ...marketData };
      
      batchResult.data.results.forEach((result, index) => {
        if (result.success) {
          const key = keys[index];
          const keyParts = key.split('.');
          const arrayIndex = parseInt(keyParts[1]);
          
          if (keyParts[2] === 'commodity' && keyParts[3] === 'name') {
            translatedData.prices[arrayIndex].commodity.name = result.translatedText;
          } else if (keyParts[2] === 'market' && keyParts[3] === 'name') {
            translatedData.prices[arrayIndex].market.name = result.translatedText;
          }
        }
      });
      
      return translatedData;
    }
    
    return marketData;
  },

  // Translate pest detection results
  async translatePestDetectionData(pestData, targetLanguage) {
    const textsToTranslate = [];
    const keys = [];

    if (pestData.detectedPests) {
      pestData.detectedPests.forEach((pest, index) => {
        if (pest.name) {
          textsToTranslate.push(pest.name);
          keys.push(`detectedPests.${index}.name`);
        }
        if (pest.description) {
          textsToTranslate.push(pest.description);
          keys.push(`detectedPests.${index}.description`);
        }
      });
    }

    if (pestData.recommendations) {
      pestData.recommendations.forEach((rec, index) => {
        if (rec.title) {
          textsToTranslate.push(rec.title);
          keys.push(`recommendations.${index}.title`);
        }
        if (rec.description) {
          textsToTranslate.push(rec.description);
          keys.push(`recommendations.${index}.description`);
        }
      });
    }

    if (textsToTranslate.length === 0) return pestData;

    const batchResult = await this.batchTranslate(textsToTranslate, targetLanguage);
    
    if (batchResult.success) {
      const translatedData = { ...pestData };
      
      batchResult.data.results.forEach((result, index) => {
        if (result.success) {
          const key = keys[index];
          const keyParts = key.split('.');
          const arrayIndex = parseInt(keyParts[1]);
          const field = keyParts[2];
          
          if (keyParts[0] === 'detectedPests') {
            translatedData.detectedPests[arrayIndex][field] = result.translatedText;
          } else if (keyParts[0] === 'recommendations') {
            translatedData.recommendations[arrayIndex][field] = result.translatedText;
          }
        }
      });
      
      return translatedData;
    }
    
    return pestData;
  },

  // Translate soil analysis data
  async translateSoilAnalysisData(soilData, targetLanguage) {
    const textsToTranslate = [];
    const keys = [];

    if (soilData.recommendations) {
      soilData.recommendations.forEach((rec, index) => {
        if (rec.title) {
          textsToTranslate.push(rec.title);
          keys.push(`recommendations.${index}.title`);
        }
        if (rec.description) {
          textsToTranslate.push(rec.description);
          keys.push(`recommendations.${index}.description`);
        }
      });
    }

    if (soilData.analysis?.description) {
      textsToTranslate.push(soilData.analysis.description);
      keys.push('analysis.description');
    }

    if (textsToTranslate.length === 0) return soilData;

    const batchResult = await this.batchTranslate(textsToTranslate, targetLanguage);
    
    if (batchResult.success) {
      const translatedData = { ...soilData };
      
      batchResult.data.results.forEach((result, index) => {
        if (result.success) {
          const key = keys[index];
          const keyParts = key.split('.');
          
          if (keyParts.length === 2) {
            translatedData[keyParts[0]][keyParts[1]] = result.translatedText;
          } else if (keyParts.length === 3) {
            const arrayIndex = parseInt(keyParts[1]);
            translatedData[keyParts[0]][arrayIndex][keyParts[2]] = result.translatedText;
          }
        }
      });
      
      return translatedData;
    }
    
    return soilData;
  },

  // Common language codes for quick access
  getCommonLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
    ];
  }
};