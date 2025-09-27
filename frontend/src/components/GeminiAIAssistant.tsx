import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import LoadingIndicator from './LoadingIndicator';
import { useToast } from '../hooks/use-toast';
import { translationService } from '../services';
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  Languages,
  Wheat,
  CloudRain,
  TrendingUp,
  Bug,
  Sprout
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language?: string;
  context?: string;
}

interface AIAssistantProps {
  className?: string;
  defaultLanguage?: string;
}

const GeminiAIAssistant: React.FC<AIAssistantProps> = ({ 
  className = '', 
  defaultLanguage = 'en' 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Available languages for the chatbot
  const supportedLanguages = translationService.getCommonLanguages();

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: currentLanguage === 'hi' 
        ? 'नमस्कार! मैं आपका कृषि सहायक हूँ। मैं मौसम, फसल, बाजार की कीमतें, कीट प्रबंधन और मिट्टी के बारे में आपकी मदद कर सकता हूँ। आप मुझसे कुछ भी पूछ सकते हैं!'
        : currentLanguage === 'pa'
        ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤਿਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਮੌਸਮ, ਫਸਲਾਂ, ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ, ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੇ ਪ੍ਰਬੰਧਨ ਅਤੇ ਮਿੱਟੀ ਬਾਰੇ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ!'
        : 'Hello! I\'m your agricultural assistant powered by Gemini AI. I can help you with weather, crops, market prices, pest management, and soil health. Ask me anything about farming!',
      sender: 'ai',
      timestamp: new Date(),
      language: currentLanguage
    };
    
    setMessages([welcomeMessage]);
  }, [currentLanguage]);

  // Sample agricultural contexts for better responses
  const getContextualPrompt = (userMessage: string, language: string) => {
    const contexts = {
      weather: ['weather', 'rain', 'temperature', 'climate', 'season', 'मौसम', 'बारिश', 'तापमान', 'ਮੌਸਮ', 'ਮੀਂਹ'],
      market: ['price', 'market', 'sell', 'buy', 'cost', 'कीमत', 'बाजार', 'बेचना', 'ਕੀਮਤ', 'ਬਾਜ਼ਾਰ'],
      pest: ['pest', 'insect', 'disease', 'spray', 'कीट', 'रोग', 'छिड़काव', 'ਕੀੜੇ', 'ਰੋਗ'],
      soil: ['soil', 'fertilizer', 'nutrients', 'pH', 'मिट्टी', 'खाद', 'पोषक', 'ਮਿੱਟੀ', 'ਖਾਦ'],
      crop: ['crop', 'plant', 'grow', 'harvest', 'फसल', 'पौधा', 'उगाना', 'ਫਸਲ', 'ਪੌਦਾ']
    };

    let detectedContext = 'general';
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
        detectedContext = context;
        break;
      }
    }

    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'pa': 'Punjabi'
    };

    const contextualInstructions = {
      weather: `You are an agricultural weather expert. Provide practical farming advice related to weather conditions. Always mention specific actions farmers can take.`,
      market: `You are an agricultural market analyst. Provide insights about crop prices, market trends, and trading advice for farmers.`,
      pest: `You are a pest management specialist. Provide organic and chemical solutions for pest control, focusing on sustainable farming practices.`,
      soil: `You are a soil scientist. Provide advice on soil health, fertilizer application, pH management, and nutrient deficiency solutions.`,
      crop: `You are a crop specialist. Provide advice on planting, growing, harvesting, and crop management techniques.`,
      general: `You are a knowledgeable agricultural assistant. Provide helpful, practical advice for farmers.`
    };

    return `${contextualInstructions[detectedContext as keyof typeof contextualInstructions]} 
    
User's question: "${userMessage}"

Instructions:
- Respond in ${languageNames[language as keyof typeof languageNames]} language
- Keep responses concise but informative (2-3 sentences)
- Focus on practical, actionable advice
- Use agricultural terminology appropriate for farmers
- If the question is not agriculture-related, gently redirect to farming topics
- Be encouraging and supportive in tone

Context detected: ${detectedContext}`;
  };

  // Call Gemini AI through backend
  const callGeminiAPI = async (message: string, language: string) => {
    try {
      // Detect context from message
      const context = detectContext(message);
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          context,
          conversationHistory: messages.slice(-6) // Send recent conversation history
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data.message;
      } else {
        // Use fallback response if provided
        return data.fallbackResponse || generateFallbackResponse(language);
      }
      
    } catch (error) {
      console.error('Gemini API error:', error);
      return generateFallbackResponse(language);
    }
  };

  // Helper function to detect context from message
  const detectContext = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    const contexts = {
      weather: ['weather', 'rain', 'temperature', 'climate', 'season', 'मौसम', 'बारिश', 'तापमान', 'ਮੌਸਮ', 'ਮੀਂਹ'],
      market: ['price', 'market', 'sell', 'buy', 'cost', 'कीमत', 'बाजार', 'बेचना', 'ਕੀਮਤ', 'ਬਾਜ਼ਾਰ'],
      pest: ['pest', 'insect', 'disease', 'spray', 'कीट', 'रोग', 'छिड़काव', 'ਕੀੜੇ', 'ਰੋਗ'],
      soil: ['soil', 'fertilizer', 'nutrients', 'pH', 'मिट्टी', 'खाद', 'पोषक', 'ਮਿੱਟੀ', 'ਖਾਦ'],
      crop: ['crop', 'plant', 'grow', 'harvest', 'फसल', 'पौधा', 'उगाना', 'ਫਸਲ', 'ਪੌਦਾ']
    };

    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
        return context;
      }
    }
    
    return 'general';
  };

  // Generate intelligent responses based on context (fallback for demo)
  const generateIntelligentResponse = (userMessage: string, language: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Weather-related responses
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('मौसम') || lowerMessage.includes('ਮੌਸਮ')) {
      const responses = {
        en: "Based on current weather patterns, I recommend checking soil moisture before planting. If rain is expected in 2-3 days, delay irrigation. For monsoon season, ensure proper drainage to prevent waterlogging.",
        hi: "वर्तमान मौसम के अनुसार, बुआई से पहले मिट्टी की नमी जांच लें। यदि 2-3 दिन में बारिश की संभावना है, तो सिंचाई में देरी करें। मानसून के दौरान जल भराव से बचने के लिए उचित जल निकासी सुनिश्चित करें।",
        pa: "ਮੌਜੂਦਾ ਮੌਸਮ ਦੇ ਅਨੁਸਾਰ, ਬੀਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਮਿੱਟੀ ਦੀ ਨਮੀ ਦੀ ਜਾਂਚ ਕਰੋ। ਜੇ 2-3 ਦਿਨਾਂ ਵਿੱਚ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ, ਤਾਂ ਸਿੰਚਾਈ ਵਿੱਚ ਦੇਰੀ ਕਰੋ। ਮਾਨਸੂਨ ਦੌਰਾਨ ਪਾਣੀ ਭਰਨ ਤੋਂ ਬਚਣ ਲਈ ਸਹੀ ਡਰੇਨੇਜ ਯਕੀਨੀ ਬਣਾਓ।"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Market-related responses
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('कीमत') || lowerMessage.includes('ਕੀਮਤ')) {
      const responses = {
        en: "Current market trends show good demand for organic produce. Consider direct marketing to consumers or joining farmer producer organizations for better prices. Monitor daily price fluctuations through mandi apps.",
        hi: "वर्तमान बाजार रुझान जैविक उत्पादों की अच्छी मांग दिखाते हैं। बेहतर कीमत के लिए सीधे उपभोक्ताओं को बेचने या किसान उत्पादक संगठनों में शामिल होने पर विचार करें। मंडी ऐप के माध्यम से दैनिक मूल्य में उतार-चढ़ाव पर नजर रखें।",
        pa: "ਮੌਜੂਦਾ ਬਾਜ਼ਾਰ ਰੁਝਾਨ ਜੈਵਿਕ ਉਤਪਾਦਾਂ ਦੀ ਚੰਗੀ ਮੰਗ ਦਿਖਾਉਂਦੇ ਹਨ। ਬਿਹਤਰ ਕੀਮਤ ਲਈ ਸਿੱਧੇ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਵੇਚਣ ਜਾਂ ਕਿਸਾਨ ਉਤਪਾਦਕ ਸੰਸਥਾਵਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ ਬਾਰੇ ਸੋਚੋ। ਮੰਡੀ ਐਪਸ ਰਾਹੀਂ ਰੋਜ਼ਾਨਾ ਕੀਮਤਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Pest-related responses
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('कीट') || lowerMessage.includes('ਕੀੜੇ')) {
      const responses = {
        en: "For integrated pest management, use neem oil spray early morning or evening. Install yellow sticky traps and maintain field hygiene. Encourage beneficial insects by planting marigold and mustard as border crops.",
        hi: "एकीकृत कीट प्रबंधन के लिए, सुबह जल्दी या शाम को नीम तेल का छिड़काव करें। पीले चिपचिपे जाल लगाएं और खेत की सफाई बनाए रखें। सीमा पर गेंदा और सरसों लगाकर लाभकारी कीटों को प्रोत्साहित करें।",
        pa: "ਏਕੀਕ੍ਰਿਤ ਕੀੜੇ ਪ੍ਰਬੰਧਨ ਲਈ, ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਨਿੰਮ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ। ਪੀਲੇ ਚਿਪਕਣ ਵਾਲੇ ਜਾਲ ਲਗਾਓ ਅਤੇ ਖੇਤ ਦੀ ਸਫਾਈ ਬਣਾਈ ਰੱਖੋ। ਸਰਹੱਦ ਉੱਤੇ ਗੇਂਦਾ ਅਤੇ ਸਰ੍ਹੋਂ ਲਗਾ ਕੇ ਲਾਭਕਾਰੀ ਕੀੜਿਆਂ ਨੂੰ ਪ੍ਰੋਤਸਾਹਿਤ ਕਰੋ।"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Soil-related responses
    if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('मिट्टी') || lowerMessage.includes('ਮਿੱਟੀ')) {
      const responses = {
        en: "Test your soil pH regularly - ideal range is 6.0-7.5 for most crops. Add organic compost to improve soil structure and water retention. For nutrient deficiency, use targeted fertilizers based on soil test results.",
        hi: "नियमित रूप से मिट्टी का pH जांचें - अधिकांश फसलों के लिए आदर्श सीमा 6.0-7.5 है। मिट्टी की संरचना और जल धारण में सुधार के लिए जैविक खाद मिलाएं। पोषक तत्वों की कमी के लिए, मिट्टी परीक्षण के परिणामों के आधार पर लक्षित उर्वरकों का उपयोग करें।",
        pa: "ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਆਪਣੀ ਮਿੱਟੀ ਦਾ pH ਜਾਂਚੋ - ਜ਼ਿਆਦਾਤਰ ਫਸਲਾਂ ਲਈ ਆਦਰਸ਼ ਰੇਂਜ 6.0-7.5 ਹੈ। ਮਿੱਟੀ ਦੀ ਬਣਤਰ ਅਤੇ ਪਾਣੀ ਰੱਖਣ ਦੀ ਸਮਰੱਥਾ ਸੁਧਾਰਨ ਲਈ ਜੈਵਿਕ ਖਾਦ ਮਿਲਾਓ। ਪੋਸ਼ਣ ਤੱਤਾਂ ਦੀ ਕਮੀ ਲਈ, ਮਿੱਟੀ ਟੈਸਟ ਦੇ ਨਤੀਜਿਆਂ ਦੇ ਆਧਾਰ 'ਤੇ ਟਾਰਗੇਟ ਖਾਦ ਵਰਤੋ।"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // General farming responses
    const generalResponses = {
      en: "I'd be happy to help with your farming question! For the best advice, could you tell me more about your specific crop, location, or the particular challenge you're facing? This will help me provide more targeted guidance.",
      hi: "मुझे आपके खेती के सवाल में मदद करने में खुशी होगी! सबसे अच्छी सलाह के लिए, क्या आप मुझे अपनी विशिष्ट फसल, स्थान, या आपके सामने आने वाली विशेष चुनौती के बारे में और बता सकते हैं? इससे मुझे अधिक लक्षित मार्गदर्शन प्रदान करने में मदद मिलेगी।",
      pa: "ਮੈਨੂੰ ਤੁਹਾਡੇ ਖੇਤਿਬਾੜੀ ਦੇ ਸਵਾਲ ਵਿੱਚ ਮਦਦ ਕਰਨ ਵਿੱਚ ਖੁਸ਼ੀ ਹੋਵੇਗੀ! ਸਭ ਤੋਂ ਵਧੀਆ ਸਲਾਹ ਲਈ, ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਆਪਣੀ ਖਾਸ ਫਸਲ, ਸਥਾਨ, ਜਾਂ ਤੁਹਾਡੇ ਸਾਹਮਣੇ ਆਉਣ ਵਾਲੀ ਖਾਸ ਚੁਣੌਤੀ ਬਾਰੇ ਹੋਰ ਦੱਸ ਸਕਦੇ ਹੋ? ਇਹ ਮੈਨੂੰ ਹੋਰ ਨਿਸ਼ਾਨਾ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੇਗਾ।"
    };
    
    return generalResponses[language as keyof typeof generalResponses] || generalResponses.en;
  };

  // Fallback response if API fails
  const generateFallbackResponse = (language: string) => {
    const fallbackResponses = {
      en: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try asking your question again, or contact our support team for immediate assistance.",
      hi: "मुझे खुशी है, लेकिन मुझे अभी अपने ज्ञान आधार से जुड़ने में समस्या हो रही है। कृपया अपना प्रश्न फिर से पूछें, या तत्काल सहायता के लिए हमारी सहायता टीम से संपर्क करें।",
      pa: "ਮੈਨੂੰ ਮੁਆਫੀ ਹੈ, ਪਰ ਮੈਨੂੰ ਹੁਣ ਆਪਣੇ ਗਿਆਨ ਅਧਾਰ ਨਾਲ ਜੁੜਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਦੁਬਾਰਾ ਪੁੱਛੋ, ਜਾਂ ਤੁਰੰਤ ਸਹਾਇਤਾ ਲਈ ਸਾਡੀ ਸਹਾਇਤਾ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।"
    };
    return fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en;
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await callGeminiAPI(inputMessage, currentLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick suggestion buttons
  const getQuickSuggestions = () => {
    const suggestions = {
      en: [
        { text: "What's the best time to plant wheat?", icon: Wheat },
        { text: "How to manage crop diseases?", icon: Bug },
        { text: "Soil health improvement tips", icon: Sprout },
        { text: "Current market prices", icon: TrendingUp }
      ],
      hi: [
        { text: "गेहूं बोने का सबसे अच्छा समय क्या है?", icon: Wheat },
        { text: "फसल के रोगों का प्रबंधन कैसे करें?", icon: Bug },
        { text: "मिट्टी के स्वास्थ्य में सुधार के तरीके", icon: Sprout },
        { text: "वर्तमान बाजार मूल्य", icon: TrendingUp }
      ],
      pa: [
        { text: "ਕਣਕ ਬੀਜਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕੀ ਹੈ?", icon: Wheat },
        { text: "ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਿਵੇਂ ਕਰੀਏ?", icon: Bug },
        { text: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਸੁਧਾਰਨ ਦੇ ਤਰੀਕੇ", icon: Sprout },
        { text: "ਮੌਜੂਦਾ ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ", icon: TrendingUp }
      ]
    };
    
    return suggestions[currentLanguage as keyof typeof suggestions] || suggestions.en;
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Agricultural Assistant</span>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Gemini AI
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {supportedLanguages.slice(0, 3).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg mr-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <LoadingIndicator size="sm" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {getQuickSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion.text)}
                  className="text-left justify-start h-auto p-2"
                >
                  <suggestion.icon className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="text-xs truncate">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentLanguage === 'hi' 
                  ? 'अपना कृषि प्रश्न यहाँ लिखें...'
                  : currentLanguage === 'pa'
                  ? 'ਆਪਣਾ ਖੇਤਿਬਾੜੀ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...'
                  : 'Type your farming question here...'
              }
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiAIAssistant;