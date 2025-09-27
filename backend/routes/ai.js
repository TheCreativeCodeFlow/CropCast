const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Agricultural context system prompt
const getSystemPrompt = (language, context = 'general') => {
  const languageNames = {
    'en': 'English',
    'hi': 'Hindi', 
    'pa': 'Punjabi'
  };

  const contextPrompts = {
    weather: 'You are an agricultural weather expert. Provide practical farming advice related to weather conditions.',
    market: 'You are an agricultural market analyst. Provide insights about crop prices and market trends.',
    pest: 'You are a pest management specialist. Focus on organic and sustainable pest control solutions.',
    soil: 'You are a soil scientist. Provide advice on soil health, fertilizer application, and nutrient management.',
    crop: 'You are a crop specialist. Provide advice on planting, growing, and harvesting techniques.',
    general: 'You are a knowledgeable agricultural assistant helping farmers with practical advice.'
  };

  return `${contextPrompts[context]}

IMPORTANT INSTRUCTIONS:
- Always respond in ${languageNames[language]} language
- Keep responses concise but informative (2-4 sentences)
- Focus on practical, actionable advice for farmers
- Use simple, clear language that farmers can understand
- Include specific recommendations when possible
- If asked about non-agricultural topics, politely redirect to farming
- Be encouraging and supportive in tone
- Prioritize sustainable and organic farming practices when relevant

Context: ${context}
Language: ${language}`;
};

// Chat endpoint for AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en', context = 'general', conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Build conversation context from history
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context
      conversationContext = recentHistory.map(msg => 
        `${msg.sender}: ${msg.content}`
      ).join('\n');
    }

    // Create the full prompt
    const systemPrompt = getSystemPrompt(language, context);
    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}

User: ${message}

AI Assistant:`;

    // Generate response using Gemini
    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text().trim();

    res.json({
      success: true,
      data: {
        message: aiResponse,
        language: language,
        context: context,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide fallback responses if Gemini fails
    const fallbackResponses = {
      en: "I apologize, but I'm having trouble accessing my knowledge base right now. Please try asking your question again, or contact our support team for immediate assistance with your farming needs.",
      hi: "मुझे खुशी है, लेकिन मुझे अभी अपने ज्ञान आधार तक पहुंचने में समस्या हो रही है। कृपया अपना प्रश्न फिर से पूछें, या अपनी कृषि आवश्यकताओं के लिए तत्काल सहायता के लिए हमारी सहायता टीम से संपर्क करें।",
      pa: "ਮੈਨੂੰ ਮੁਆਫੀ ਹੈ, ਪਰ ਮੈਨੂੰ ਹੁਣ ਆਪਣੇ ਗਿਆਨ ਅਧਾਰ ਤੱਕ ਪਹੁੰਚ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਦੁਬਾਰਾ ਪੁੱਛੋ, ਜਾਂ ਆਪਣੀਆਂ ਖੇਤਿਬਾੜੀ ਦੀਆਂ ਲੋੜਾਂ ਲਈ ਤੁਰੰਤ ਸਹਾਇਤਾ ਲਈ ਸਾਡੀ ਸਹਾਇਤਾ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ಕರੋ।"
    };

    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable',
      fallbackResponse: fallbackResponses[language] || fallbackResponses.en,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get AI capabilities and supported features
router.get('/capabilities', (req, res) => {
  res.json({
    success: true,
    data: {
      supportedLanguages: ['en', 'hi', 'pa'],
      contexts: ['general', 'weather', 'market', 'pest', 'soil', 'crop'],
      features: [
        'Natural language conversation',
        'Context-aware responses',
        'Multilingual support',
        'Agricultural expertise',
        'Practical recommendations',
        'Conversation history awareness'
      ],
      model: 'gemini-1.5-flash',
      maxContextLength: 6,
      responseFormat: 'concise and practical'
    }
  });
});

// Health check for AI service
router.get('/health', async (req, res) => {
  try {
    // Test a simple request to ensure Gemini is accessible
    const testResult = await model.generateContent('Say "AI service is working" in exactly those words.');
    const response = testResult.response.text().trim();
    
    res.json({
      success: true,
      status: 'healthy',
      message: 'AI service is operational',
      testResponse: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      message: 'AI service is not responding',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;