import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  Bot,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingIndicator from './LoadingIndicator';

interface EnhancedAIAssistantProps {
  language: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  confidence?: number;
}

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const quickActions = [
    {
      text: 'Weather forecast',
      textHi: 'मौसम पूर्वानुमान',
      query: 'What is the weather forecast for this week?',
      icon: '🌤️'
    },
    {
      text: 'Fertilizer advice',
      textHi: 'उर्वरक सलाह',
      query: 'What fertilizer should I use for wheat crop?',
      icon: '🌱'
    },
    {
      text: 'Pest control',
      textHi: 'कीट नियंत्रण',
      query: 'How to control aphids on my crops?',
      icon: '🐛'
    },
    {
      text: 'Market prices',
      textHi: 'बाजार मूल्य',
      query: 'Show me current market prices for rice',
      icon: '💰'
    },
    {
      text: 'Soil health',
      textHi: 'मिट्टी स्वास्थ्य',
      query: 'How to improve soil health naturally?',
      icon: '🌾'
    }
  ];

  const sampleResponses = {
    'What is the weather forecast for this week?': {
      en: 'Based on current data, this week will have partly cloudy conditions with temperatures ranging from 22°C to 28°C. There\'s a 30% chance of rain on Wednesday. This is favorable for most crops, but monitor for increased pest activity due to humidity.',
      hi: 'वर्तमान आंकड़ों के आधार पर, इस सप्ताह आंशिक रूप से बादल छाए रहेंगे और तापमान 22°C से 28°C तक रहेगा। बुधवार को 30% बारिश की संभावना है। यह अधिकांश फसलों के लिए अनुकूल है, लेकिन नमी के कारण कीटों की गतिविधि की निगरानी करें।',
      confidence: 92
    },
    'What fertilizer should I use for wheat crop?': {
      en: 'For wheat crops, I recommend using NPK fertilizer with a 4:2:1 ratio. Apply 120 kg/acre of Urea in split doses - half at sowing and half 30 days after sowing. Also use 50 kg/acre of DAP at sowing time. Monitor soil pH which should be between 6.0-7.5 for optimal growth.',
      hi: 'गेहूं की फसल के लिए, मैं 4:2:1 अनुपात के साथ NPK उर्वरक की सिफारिश करता हूं। यूरिया 120 किग्रा/एकड़ को दो भागों में दें - आधा बुआई के समय और आधा बुआई के 30 दिन बाद। बुआई के समय 50 किग्रा/एकड़ DAP का भी उपयोग करें। मिट्टी का pH 6.0-7.5 के बीच होना चाहिए।',
      confidence: 95
    },
    'How to control aphids on my crops?': {
      en: 'For aphid control, spray neem oil solution (3-5ml per liter water) in the evening. You can also use ladybird beetles as biological control. Remove weeds regularly and avoid over-fertilization with nitrogen. If infestation is severe, use approved insecticides like imidacloprid, but always follow label instructions.',
      hi: 'एफिड्स के नियंत्रण के लिए, शाम को नीम तेल का घोल (3-5ml प्रति लीटर पानी) का छिड़काव करें। जैविक नियंत्रण के लिए लेडीबर्ड बीटल का भी उपयोग कर सकते हैं। नियमित रूप से खरपतवार हटाएं और नाइट्रोजन से अधिक उर्वरीकरण से बचें। यदि संक्रमण गंभीर है, तो अनुमोदित कीटनाशक जैसे इमिडाक्लोप्रिड का उपयोग करें।',
      confidence: 89
    },
    'Show me current market prices for rice': {
      en: 'Current rice prices: Grade A rice is trading at ₹3,200 per quintal in Delhi Mandi (down 2.3% from yesterday). FAQ rice is at ₹2,850 per quintal in Mumbai APMC. Prices are expected to stabilize next week due to increased supply from new harvest. Would you like price alerts for specific varieties?',
      hi: 'वर्तमान चावल मूल्य: ग्रेड ए चावल दिल्ली मंडी में ₹3,200 प्रति क्विंटल पर कारोबार कर रहा है (कल से 2.3% नीचे)। FAQ चावल मुंबई APMC में ₹2,850 प्रति क्विंटल पर है। नई फसल से बढ़ी आपूर्ति के कारण अगले सप्ताह कीमतें स्थिर होने की उम्मीद है। क्या आप विशिष्ट किस्मों के लिए मूल्य अलर्ट चाहते हैं?',
      confidence: 97
    },
    'How to improve soil health naturally?': {
      en: 'To improve soil health naturally: 1) Add organic compost regularly (2-3 tons per acre annually). 2) Practice crop rotation with legumes to fix nitrogen. 3) Use cover crops during off-season. 4) Apply vermicompost and green manure. 5) Minimize tillage to preserve soil structure. 6) Maintain proper drainage and avoid waterlogging.',
      hi: 'मिट्टी की सेहत प्राकृतिक रूप से सुधारने के लिए: 1) नियमित रूप से जैविक खाद मिलाएं (सालाना 2-3 टन प्रति एकड़)। 2) नाइट्रोजन स्थिरीकरण के लिए दलहन के साथ फसल चक्र अपनाएं। 3) बंद मौसम में कवर क्रॉप्स का उपयोग करें। 4) वर्मीकम्पोस्ट और हरी खाद लगाएं। 5) मिट्टी की संरचना बनाए रखने के लिए जुताई कम करें। 6) उचित जल निकासी बनाए रखें।',
      confidence: 91
    }
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: language === 'hi' 
          ? 'नमस्ते! मैं आपका स्मार्ट कृषि सहायक हूं। मैं आवाज़ और टेक्स्ट दोनों में मदद कर सकता हूं। आप कैसे सहायता चाहते हैं?'
          : 'Hello! I\'m your smart farming assistant. I can help you with both voice and text. How can I assist you today?',
        timestamp: new Date(),
        confidence: 100
      };
      setMessages([welcomeMessage]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing with loading
    setTimeout(() => {
      const response = sampleResponses[content] || {
        en: 'I understand your question about farming. Let me help you with that. For specific agricultural advice, I recommend consulting with local agricultural experts or extension officers who can provide guidance based on your specific location and conditions.',
        hi: 'मैं कृषि के बारे में आपके प्रश्न को समझता हूं। मैं इसमें आपकी मदद करता हूं। विशिष्ट कृषि सलाह के लिए, मैं स्थानीय कृषि विशेषज्ञों या विस्तार अधिकारियों से परामर्श करने की सिफारिश करता हूं जो आपके विशिष्ट स्थान और स्थितियों के आधार पर मार्गदर्शन प्रदान कर सकते हैं।',
        confidence: 85
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: language === 'hi' ? response.hi : response.en,
        timestamp: new Date(),
        confidence: response.confidence || 85
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Auto-play response if voice is enabled
      if (voiceEnabled && assistantMessage.content) {
        speakText(assistantMessage.content);
      }
    }, 2000);
  }, [language, voiceEnabled]);

  const handleQuickAction = (action: any) => {
    sendMessage(action.query);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current || !voiceEnabled || isPlaying) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synthRef.current.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full btn-primary-glow animate-float shadow-glow-primary group relative overflow-hidden"
            size="lg"
          >
            <MessageCircle className="w-7 h-7 animate-wave group-hover:scale-110 transition-transform" />
            
            {/* AI pulse indicator */}
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow" />
            
            {/* Active indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center animate-bounce-subtle">
              <Zap className="w-3 h-3 text-warning-foreground" />
            </div>
          </Button>
          
          {/* Voice indicator */}
          {isListening && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full animate-pulse">
              {language === 'hi' ? 'सुन रहा है...' : 'Listening...'}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 shadow-strong z-50 transition-all duration-500 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        } animate-scale-in glass-card border-border/20`}>
          <CardHeader className="pb-3 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
                    <Bot className="w-4 h-4 text-primary-foreground animate-wave" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse-slow" />
                </div>
                <div>
                  <CardTitle className="text-sm">
                    {language === 'hi' ? 'स्मार्ट कृषि सहायक' : 'Smart Farming Assistant'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs animate-pulse-slow">
                      {language === 'hi' ? 'AI सक्रिय' : 'AI Active'}
                    </Badge>
                    {voiceEnabled && (
                      <Badge variant="outline" className="text-xs text-primary border-primary/20">
                        🎙️ {language === 'hi' ? 'आवाज़' : 'Voice'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoice}
                  className="h-8 w-8 p-0"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? 
                    <Volume2 className="w-3 h-3 text-primary" /> : 
                    <VolumeX className="w-3 h-3 text-muted-foreground" />
                  }
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 scrollbar-hide">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 animate-fade-in ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-soft ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gradient-primary text-primary-foreground'
                      }`}>
                        {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>
                      <div className={`rounded-xl p-3 text-sm shadow-soft transition-all duration-300 hover:shadow-medium ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border/20'
                      }`}>
                        <p className="leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 text-xs opacity-70`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.confidence && message.type === 'assistant' && (
                            <Badge variant="outline" className="text-xs ml-2">
                              {message.confidence}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start animate-fade-in">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="bg-card border border-border/20 rounded-xl p-3">
                      <LoadingIndicator type="leaf" size="sm" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Enhanced Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="text-xs text-muted-foreground mb-2 font-medium">
                    {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick questions:'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.slice(0, 4).map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto p-2 flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                        onClick={() => handleQuickAction(action)}
                      >
                        <span>{action.icon}</span>
                        <span className="truncate">{language === 'hi' ? action.textHi : action.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-border/20 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isListening 
                        ? (language === 'hi' ? 'सुन रहा है...' : 'Listening...') 
                        : (language === 'hi' ? 'अपना प्रश्न बोलें या लिखें...' : 'Speak or type your question...')
                    }
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    className="text-sm transition-all duration-300 focus:shadow-soft"
                    disabled={isListening}
                  />
                  
                  {recognitionRef.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleListening}
                      disabled={isTyping}
                      className={`h-10 w-10 p-0 transition-all duration-300 ${
                        isListening 
                          ? 'bg-destructive text-destructive-foreground animate-pulse-slow shadow-glow-primary' 
                          : 'hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isListening || isTyping}
                    size="sm"
                    className="h-10 w-10 p-0 btn-primary-glow disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                  {recognitionRef.current && (
                    <>
                      <span>🎙️ {language === 'hi' ? 'बोलें' : 'Speak'}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>📝 {language === 'hi' ? 'लिखें' : 'Type'}</span>
                  {voiceEnabled && (
                    <>
                      <span>•</span>
                      <span>🔊 {language === 'hi' ? 'सुनें' : 'Listen'}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default EnhancedAIAssistant;