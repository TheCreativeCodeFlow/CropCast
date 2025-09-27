import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardCards from '@/components/dashboard/DashboardCards';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import MarketTicker from '@/components/dashboard/MarketTicker';
import ActivityCarousel from '@/components/dashboard/ActivityCarousel';
import BadgeSystem from '@/components/dashboard/BadgeSystem';
import CommunityHighlight from '@/components/dashboard/CommunityHighlight';
import EnhancedAIAssistant from '@/components/EnhancedAIAssistant';
import ThemeToggle from '@/components/ThemeToggle';
import Navigation from '@/components/Navigation';

const Dashboard: React.FC = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-background farm-bg transition-theme pb-20">
      <Header currentLanguage={language} onLanguageChange={handleLanguageChange} />
      <ThemeToggle />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {language === 'hi' ? 'स्मार्ट कृषि सहायक' : 
             language === 'pa' ? 'ਸਮਾਰਟ ਖੇਤਿਬਾੜੀ ਸਹਾਇਕ' : 
             'Smart Farming Assistant'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'AI-आधारित फसल सलाह, मौसम अंतर्दृष्टि, और बाजार डेटा के साथ अपनी खेती को बेहतर बनाएं'
              : language === 'pa'
              ? 'AI-ਆਧਾਰਿਤ ਫਸਲ ਸਲਾਹ, ਮੌਸਮ ਸਮਝ, ਅਤੇ ਬਾਜ਼ਾਰ ਡੇਟਾ ਨਾਲ ਆਪਣੀ ਖੇਤਿਬਾੜੀ ਨੂੰ ਬਿਹਤਰ ਬਣਾਓ'
              : 'Enhance your farming with AI-powered crop advisory, weather insights, and market data'
            }
          </p>
        </section>

        {/* Main Features Grid */}
        <section className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'hi' ? 'मुख्य सुविधाएं' : 
             language === 'pa' ? 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ' : 
             'Main Features'}
          </h2>
          <DashboardCards language={language} />
        </section>

        {/* Enhanced Activity Carousel */}
        <section className="animate-fade-in">
          <ActivityCarousel language={language} />
        </section>

        {/* Widgets Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
          <WeatherWidget language={language} />
          <MarketTicker language={language} />
          <BadgeSystem language={language} />
        </section>

        {/* Community Features */}
        <section className="animate-slide-up">
          <CommunityHighlight language={language} />
        </section>

        {/* Farming Tips Section */}
        <section className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground animate-scale-in">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {language === 'hi' ? 'आज की कृषि सलाह' : 
               language === 'pa' ? 'ਅੱਜ ਦੀ ਖੇਤਿਬਾੜੀ ਸਲਾਹ' : 
               "Today's Farming Tip"}
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'इस सप्ताह बढ़ती नमी के कारण कीटों की गतिविधि बढ़ सकती है। नियमित रूप से अपनी फसलों की जांच करें और आवश्यकता पड़ने पर जैविक कीटनाशकों का उपयोग करें।'
                : language === 'pa'
                ? 'ਇਸ ਹਫ਼ਤੇ ਵਧਦੀ ਨਮੀ ਕਾਰਨ ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੀ ਗਤਿਵਿਧੀ ਵਧ ਸਕਦੀ ਹੈ। ਨਿਯਮਿਤ ਤੌਰ ਤੇ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਲੋੜ ਪੈਣ ਤੇ ਜੈਵਿਕ ਕੀੜੇ-ਮਾਰ ਦਵਾਈਆਂ ਦਾ ਪ੍ਰਯੋਗ ਕਰੋ।'
                : 'With increasing humidity this week, pest activity may rise. Monitor your crops regularly and use organic pesticides when necessary.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-sm opacity-90">
                  {language === 'hi' ? '🌡️ तापमान: 28°C' : 
                   language === 'pa' ? '🌡️ ਤਾਪਮਾਨ: 28°C' : 
                   '🌡️ Temperature: 28°C'}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-sm opacity-90">
                  {language === 'hi' ? '💧 नमी: 72%' : 
                   language === 'pa' ? '💧 ਨਮੀ: 72%' : 
                   '💧 Humidity: 72%'}
                </span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-sm opacity-90">
                  {language === 'hi' ? '🌧️ बारिश: 30%' : 
                   language === 'pa' ? '🌧️ ਮੀਂਹ: 30%' : 
                   '🌧️ Rain: 30%'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-primary mb-2">12K+</div>
            <div className="text-sm text-muted-foreground">
              {language === 'hi' ? 'खुश किसान' : 
               language === 'pa' ? 'ਖੁਸ਼ ਕਿਸਾਨ' : 
               'Happy Farmers'}
            </div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-sky mb-2">95%</div>
            <div className="text-sm text-muted-foreground">
              {language === 'hi' ? 'सटीकता दर' : 
               language === 'pa' ? 'ਸਟੀਕਤਾ ਦਰ' : 
               'Accuracy Rate'}
            </div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-warning mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">
              {language === 'hi' ? 'सहायता उपलब्धता' : 
               language === 'pa' ? 'ਸਹਾਇਤਾ ਉਪਲਬਧ' : 
               'Support Available'}
            </div>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <div className="text-3xl font-bold text-secondary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">
              {language === 'hi' ? 'फसल प्रकार' : 
               language === 'pa' ? 'ਫਸਲ ਦੇ ਕਿਸਮ' : 
               'Crop Types'}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Navigation language={language} />
      <EnhancedAIAssistant language={language} />
    </div>
  );
};

export default Dashboard;