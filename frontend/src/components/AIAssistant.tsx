import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Mic,
  MicOff,
  Volume2,
  User,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AIAssistantProps {
  language: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      text: 'Weather forecast',
      textHi: 'मौसम पूर्वानुमान',
      query: 'What is the weather forecast for this week?'
    },
    {
      text: 'Fertilizer advice',
      textHi: 'उर्वरक सलाह',
      query: 'What fertilizer should I use for wheat crop?'
    },
    {
      text: 'Pest control',
      textHi: 'कीट नियंत्रण',
      query: 'How to control aphids on my crops?'
    },
    {
      text: 'Market prices',
      textHi: 'बाजार मूल्य',
      query: 'Show me current market prices for rice'
    }
  ];

  const sampleResponses = {
    'What is the weather forecast for this week?': {
      en: 'Based on current data, this week will have partly cloudy conditions with temperatures ranging from 22°C to 28°C. There\'s a 30% chance of rain on Wednesday. This is favorable for most crops, but monitor for increased pest activity due to humidity.',
      hi: 'वर्तमान आंकड़ों के आधार पर, इस सप्ताह आंशिक रूप से बादल छाए रहेंगे और तापमान 22°C से 28°C तक रहेगा। बुधवार को 30% बारिश की संभावना है। यह अधिकांश फसलों के लिए अनुकूल है, लेकिन नमी के कारण कीटों की गतिविधि की निगरानी करें।'
    },
    'What fertilizer should I use for wheat crop?': {
      en: 'For wheat crops, I recommend using NPK fertilizer with a 4:2:1 ratio. Apply 120 kg/acre of Urea in split doses - half at sowing and half 30 days after sowing. Also use 50 kg/acre of DAP at sowing time. Monitor soil pH which should be between 6.0-7.5 for optimal growth.',
      hi: 'गेहूं की फसल के लिए, मैं 4:2:1 अनुपात के साथ NPK उर्वरक की सिफारिश करता हूं। यूरिया 120 किग्रा/एकड़ को दो भागों में दें - आधा बुआई के समय और आधा बुआई के 30 दिन बाद। बुआई के समय 50 किग्रा/एकड़ DAP का भी उपयोग करें। मिट्टी का pH 6.0-7.5 के बीच होना चाहिए।'
    },
    'How to control aphids on my crops?': {
      en: 'For aphid control, spray neem oil solution (3-5ml per liter water) in the evening. You can also use ladybird beetles as biological control. Remove weeds regularly and avoid over-fertilization with nitrogen. If infestation is severe, use approved insecticides like imidacloprid, but always follow label instructions.',
      hi: 'एफिड्स के नियंत्रण के लिए, शाम को नीम तेल का घोल (3-5ml प्रति लीटर पानी) का छिड़काव करें। जैविक नियंत्रण के लिए लेडीबर्ड बीटल का भी उपयोग कर सकते हैं। नियमित रूप से खरपतवार हटाएं और नाइट्रोजन से अधिक उर्वरीकरण से बचें। यदि संक्रमण गंभीर है, तो अनुमोदित कीटनाशक जैसे इमिडाक्लोप्रिड का उपयोग करें।'
    },
    'Show me current market prices for rice': {
      en: 'Current rice prices: Grade A rice is trading at ₹3,200 per quintal in Delhi Mandi (down 2.3% from yesterday). FAQ rice is at ₹2,850 per quintal in Mumbai APMC. Prices are expected to stabilize next week due to increased supply from new harvest. Would you like price alerts for specific varieties?',
      hi: 'वर्तमान चावल मूल्य: ग्रेड ए चावल दिल्ली मंडी में ₹3,200 प्रति क्विंटल पर कारोबार कर रहा है (कल से 2.3% नीचे)। FAQ चावल मुंबई APMC में ₹2,850 प्रति क्विंटल पर है। नई फसल से बढ़ी आपूर्ति के कारण अगले सप्ताह कीमतें स्थिर होने की उम्मीद है। क्या आप विशिष्ट किस्मों के लिए मूल्य अलर्ट चाहते हैं?'
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: language === 'hi' 
          ? 'नमस्ते! मैं आपका कृषि सहायक हूं। मैं मौसम, फसल, उर्वरक, कीट नियंत्रण और बाजार मूल्यों के बारे में मदद कर सकता हूं। आप कैसे मदद चाहते हैं?'
          : 'Hello! I\'m your farming assistant. I can help you with weather, crops, fertilizers, pest control, and market prices. How can I assist you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [language, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string) => {
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

    // Simulate AI response
    setTimeout(() => {
      const response = sampleResponses[content] || {
        en: 'I understand your question about farming. Let me help you with that. For specific agricultural advice, I recommend consulting with local agricultural experts or extension officers who can provide guidance based on your specific location and conditions.',
        hi: 'मैं कृषि के बारे में आपके प्रश्न को समझता हूं। मैं इसमें आपकी मदद करता हूं। विशिष्ट कृषि सलाह के लिए, मैं स्थानीय कृषि विशेषज्ञों या विस्तार अधिकारियों से परामर्श करने की सिफारिश करता हूं जो आपके विशिष्ट स्थान और स्थितियों के आधार पर मार्गदर्शन प्रदान कर सकते हैं।'
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: language === 'hi' ? response.hi : response.en,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: any) => {
    sendMessage(action.query);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary-glow animate-float shadow-glow-primary z-50"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 h-[500px] shadow-strong z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[500px]'
        } animate-scale-in glass-card border-border/20`}>
          <CardHeader className="pb-3 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-sm">
                    {language === 'hi' ? 'कृषि सहायक' : 'Farming Assistant'}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
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
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>
                      <div className={`rounded-lg p-3 text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 opacity-70 ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick questions:'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleQuickAction(action)}
                      >
                        {language === 'hi' ? action.textHi : action.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-border/20">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={language === 'hi' ? 'अपना प्रश्न लिखें...' : 'Type your question...'}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                    className="text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleListening}
                    className={`h-10 w-10 p-0 ${isListening ? 'bg-destructive text-destructive-foreground' : ''}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim()}
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  {language === 'hi' 
                    ? '🎙️ बोलकर या 📝 लिखकर पूछें' 
                    : '🎙️ Speak or 📝 type your questions'
                  }
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default AIAssistant;