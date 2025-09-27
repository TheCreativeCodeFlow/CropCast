import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import GeminiAIAssistant from '../components/GeminiAIAssistant';
import { weatherMock } from '../mocks/weather';
import {
  Globe,
  MessageSquare,
  Bot,
  Sparkles,
  Wheat,
  CloudRain,
  TrendingUp,
  Users,
  Languages
} from 'lucide-react';

const PunjabiDemo: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('pa');

  // Sample agricultural content in multiple languages
  const sampleContent = {
    weather: {
      en: {
        title: "Today's Weather Forecast",
        description: "Partly cloudy with moderate rainfall expected. Good conditions for crop growth.",
        recommendation: "Consider applying organic fertilizer today and check irrigation systems."
      },
      hi: {
        title: "आज का मौसम पूर्वानुमान",
        description: "आंशिक रूप से बादल छाए हुए हैं और मध्यम बारिश की उम्मीद है। फसल की वृद्धि के लिए अच्छी स्थिति।",
        recommendation: "आज जैविक उर्वरक लगाने पर विचार करें और सिंचाई प्रणाली की जांच करें।"
      },
      pa: {
        title: "ਅੱਜ ਦਾ ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ",
        description: "ਅੰਸ਼ਿਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ ਅਤੇ ਦਰਮਿਆਨੀ ਮੀਂਹ ਦੀ ਉਮੀਦ। ਫਸਲ ਦੇ ਵਾਧੇ ਲਈ ਚੰਗੀਆਂ ਸਥਿਤੀਆਂ।",
        recommendation: "ਅੱਜ ਜੈਵਿਕ ਖਾਦ ਲਗਾਉਣ ਬਾਰੇ ਸੋਚੋ ਅਤੇ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀ ਦੀ ਜਾਂਚ ਕਰੋ।"
      }
    },
    market: {
      en: {
        title: "Market Price Updates",
        wheat: "Wheat: ₹2,150/quintal (+5.2%)",
        rice: "Rice: ₹3,200/quintal (-2.1%)",
        insight: "Wheat prices are rising due to increased export demand."
      },
      hi: {
        title: "बाजार मूल्य अपडेट",
        wheat: "गेहूं: ₹2,150/क्विंटल (+5.2%)",
        rice: "चावल: ₹3,200/क्विंटल (-2.1%)",
        insight: "निर्यात मांग बढ़ने से गेहूं की कीमतें बढ़ रही हैं।"
      },
      pa: {
        title: "ਬਾਜ਼ਾਰ ਕੀਮਤ ਅਪਡੇਟ",
        wheat: "ਕਣਕ: ₹2,150/ਕੁਇੰਟਲ (+5.2%)",
        rice: "ਚਾਵਲ: ₹3,200/ਕੁਇੰਟਲ (-2.1%)",
        insight: "ਨਿਰਯਾਤ ਦੀ ਮੰਗ ਵਧਣ ਕਾਰਨ ਕਣਕ ਦੀਆਂ ਕੀਮਤਾਂ ਵਧ ਰਹੀਆਂ ਹਨ।"
      }
    },
    farming: {
      en: {
        title: "Smart Farming Tips",
        tip1: "Use precision agriculture techniques to optimize water usage",
        tip2: "Implement crop rotation to maintain soil health",
        tip3: "Monitor soil pH levels weekly during growing season"
      },
      hi: {
        title: "स्मार्ट कृषि सुझाव",
        tip1: "पानी के उपयोग को अनुकूलित करने के लिए सटीक कृषि तकनीकों का उपयोग करें",
        tip2: "मिट्टी के स्वास्थ्य को बनाए रखने के लिए फसल चक्र लागू करें",
        tip3: "बढ़ते मौसम के दौरान साप्ताहिक मिट्टी के pH स्तर की निगरानी करें"
      },
      pa: {
        title: "ਸਮਾਰਟ ਖੇਤਿਬਾੜੀ ਸੁਝਾਅ",
        tip1: "ਪਾਣੀ ਦੀ ਵਰਤੋਂ ਨੂੰ ਅਨੁਕੂਲ ਬਣਾਉਣ ਲਈ ਸਟੀਕ ਖੇਤਿਬਾੜੀ ਤਕਨੀਕਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ",
        tip2: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਬਣਾਈ ਰੱਖਣ ਲਈ ਫਸਲ ਚੱਕਰ ਲਾਗੂ ਕਰੋ",
        tip3: "ਵਧਣ ਦੇ ਮੌਸਮ ਦੌਰਾਨ ਹਫਤਾਵਾਰੀ ਮਿੱਟੀ ਦੇ pH ਪੱਧਰ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ"
      }
    }
  };

  const getCurrentWeatherContent = () => {
    return sampleContent.weather[selectedLanguage as keyof typeof sampleContent.weather] || sampleContent.weather.en;
  };

  const getCurrentMarketContent = () => {
    return sampleContent.market[selectedLanguage as keyof typeof sampleContent.market] || sampleContent.market.en;
  };

  const getCurrentFarmingContent = () => {
    return sampleContent.farming[selectedLanguage as keyof typeof sampleContent.farming] || sampleContent.farming.en;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Globe className="h-8 w-8 text-primary" />
          <span>
            {selectedLanguage === 'pa' ? 'ਕ੍ਰਾਪਕਾਸਟ ਪੰਜਾਬੀ ਡੈਮੋ' : 
             selectedLanguage === 'hi' ? 'क्रॉपकास्ट हिंदी डेमो' : 
             'CropCast Multilingual Demo'}
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground">
          {selectedLanguage === 'pa' ? 'ਜੈਮਿਨੀ AI ਨਾਲ ਤੁਹਾਡੀ ਮਾਤ੍ਰਿਕ ਭਾਸ਼ਾ ਵਿੱਚ ਖੇਤਿਬਾੜੀ ਦੀ ਸਹਾਇਤਾ' :
           selectedLanguage === 'hi' ? 'जेमिनी AI के साथ आपकी मातृभाषा में कृषि सहायता' :
           'Agricultural assistance in your native language with Gemini AI'}
        </p>

        <div className="flex justify-center items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Languages className="h-3 w-3 mr-1" />
            {selectedLanguage === 'pa' ? 'ਪੰਜਾਬੀ' : 
             selectedLanguage === 'hi' ? 'हिंदी' : 'English'}
          </Badge>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          <Button
            variant={selectedLanguage === 'en' ? 'default' : 'outline'}
            onClick={() => setSelectedLanguage('en')}
            size="sm"
          >
            English
          </Button>
          <Button
            variant={selectedLanguage === 'hi' ? 'default' : 'outline'}
            onClick={() => setSelectedLanguage('hi')}
            size="sm"
          >
            हिंदी
          </Button>
          <Button
            variant={selectedLanguage === 'pa' ? 'default' : 'outline'}
            onClick={() => setSelectedLanguage('pa')}
            size="sm"
          >
            ਪੰਜਾਬੀ
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">
            <MessageSquare className="h-4 w-4 mr-2" />
            {selectedLanguage === 'pa' ? 'ਸਮੱਗਰੀ ਡੈਮੋ' : 
             selectedLanguage === 'hi' ? 'सामग्री डेमो' : 'Content Demo'}
          </TabsTrigger>
          <TabsTrigger value="chatbot">
            <Bot className="h-4 w-4 mr-2" />
            {selectedLanguage === 'pa' ? 'AI ਚੈਟਬਾਟ' : 
             selectedLanguage === 'hi' ? 'AI चैटबॉट' : 'AI Chatbot'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Weather Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CloudRain className="h-5 w-5 text-blue-500" />
                <span>{getCurrentWeatherContent().title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {getCurrentWeatherContent().description}
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {selectedLanguage === 'pa' ? 'ਸਿਫਾਰਸ਼:' : 
                   selectedLanguage === 'hi' ? 'सिफारिश:' : 'Recommendation:'}
                </h4>
                <p className="text-sm">{getCurrentWeatherContent().recommendation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Market Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>{getCurrentMarketContent().title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-green-600">
                    {getCurrentMarketContent().wheat}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-red-600">
                    {getCurrentMarketContent().rice}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {selectedLanguage === 'pa' ? 'ਬਾਜ਼ਾਰ ਸਮਝ:' : 
                   selectedLanguage === 'hi' ? 'बाजार अंतर्दृष्टि:' : 'Market Insight:'}
                </h4>
                <p className="text-sm">{getCurrentMarketContent().insight}</p>
              </div>
            </CardContent>
          </Card>

          {/* Farming Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wheat className="h-5 w-5 text-amber-500" />
                <span>{getCurrentFarmingContent().title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm">{getCurrentFarmingContent().tip1}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm">{getCurrentFarmingContent().tip2}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm">{getCurrentFarmingContent().tip3}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {selectedLanguage === 'pa' ? 'ਜੈਮਿਨੀ AI ਖੇਤਿਬਾੜੀ ਸਹਾਇਕ' : 
               selectedLanguage === 'hi' ? 'जेमिनी AI कृषि सहायक' : 'Gemini AI Agricultural Assistant'}
            </h2>
            <p className="text-muted-foreground">
              {selectedLanguage === 'pa' ? 'ਆਪਣੇ ਖੇਤਿਬਾੜੀ ਦੇ ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਤੁਰੰਤ ਸਮਾਰਟ ਜਵਾਬ ਪਾਓ' :
               selectedLanguage === 'hi' ? 'अपने कृषि प्रश्न पूछें और तुरंत स्मार्ट उत्तर प्राप्त करें' :
               'Ask your farming questions and get instant smart answers'}
            </p>
          </div>

          {/* AI Chatbot Component */}
          <div className="max-w-4xl mx-auto">
            <GeminiAIAssistant 
              defaultLanguage={selectedLanguage}
              className="shadow-lg"
            />
          </div>

          {/* Sample Questions */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>
                {selectedLanguage === 'pa' ? 'ਨਮੂਨਾ ਸਵਾਲ:' : 
                 selectedLanguage === 'hi' ? 'नमूना प्रश्न:' : 'Sample Questions:'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const questions = selectedLanguage === 'pa' ? [
                    "ਕਣਕ ਬੀਜਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕੀ ਹੈ?",
                    "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?",
                    "ਕੀੜੇ-ਮਕੌੜਿਆਂ ਤੋਂ ਕਿਵੇਂ ਬਚਾਅ ਕਰੀਏ?",
                    "ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ ਕਿਵੇਂ ਚੈੱਕ ਕਰੀਏ?"
                  ] : selectedLanguage === 'hi' ? [
                    "गेहूं बोने का सबसे अच्छा समय क्या है?",
                    "मिट्टी की सेहत कैसे सुधारें?",
                    "कीटों से कैसे बचाव करें?",
                    "बाजार की कीमतें कैसे चेक करें?"
                  ] : [
                    "What's the best time to plant wheat?",
                    "How to improve soil health?",
                    "How to protect crops from pests?",
                    "How to check market prices?"
                  ];
                  
                  return questions.map((question, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{question}</p>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">
                {selectedLanguage === 'pa' ? 'ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਸਟੈਟਸ' : 
                 selectedLanguage === 'hi' ? 'भाषा समर्थन स्थिति' : 'Language Support Status'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLanguage === 'pa' ? 'ਭਾਸ਼ਾਵਾਂ' : 
                   selectedLanguage === 'hi' ? 'भाषाएं' : 'Languages'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLanguage === 'pa' ? 'AI ਪਾਵਰਡ' : 
                   selectedLanguage === 'hi' ? 'AI संचालित' : 'AI Powered'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLanguage === 'pa' ? 'ਰੀਅਲ-ਟਾਈਮ' : 
                   selectedLanguage === 'hi' ? 'रीयल-टाइम' : 'Real-time'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PunjabiDemo;