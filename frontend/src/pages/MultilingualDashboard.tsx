import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LanguageProvider, 
  LanguageSelector, 
  TranslatedText,
  useLanguage 
} from '../components/LanguageComponents';
import LoadingIndicator from '../components/LoadingIndicator';
import { useToast } from '../hooks/use-toast';
import { 
  translationService, 
  weatherService, 
  marketService 
} from '../services';
import {
  Globe,
  Cloud,
  TrendingUp,
  Sprout,
  MessageSquare,
  RefreshCw,
  Users,
  BarChart3,
  Zap
} from 'lucide-react';

// Enhanced Multilingual Dashboard Content
const MultilingualDashboardContent: React.FC = () => {
  const { currentLanguage, translateText } = useLanguage();
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Sample agricultural data in different contexts
  const sampleData = {
    weather: {
      title: "Today's Weather Forecast",
      description: "Partly cloudy with moderate rainfall expected. Good conditions for crop growth.",
      recommendations: [
        "Consider applying organic fertilizer today",
        "Check irrigation systems for proper drainage",
        "Monitor crops for early pest signs"
      ]
    },
    market: {
      title: "Market Price Updates",
      crops: [
        { name: "Wheat", price: "₹2,150/quintal", change: "+5.2%" },
        { name: "Rice", price: "₹3,200/quintal", change: "-2.1%" },
        { name: "Corn", price: "₹1,850/quintal", change: "+8.5%" },
        { name: "Soybeans", price: "₹4,500/quintal", change: "+12.3%" }
      ],
      insights: [
        "Wheat prices are rising due to increased export demand",
        "Rice market showing consolidation after recent peaks",
        "Corn demand strong from feed industry"
      ]
    },
    farming: {
      title: "Smart Farming Tips",
      tips: [
        "Use precision agriculture techniques to optimize water usage",
        "Implement crop rotation to maintain soil health",
        "Monitor soil pH levels weekly during growing season",
        "Apply integrated pest management strategies",
        "Utilize weather data for optimal planting times"
      ]
    },
    news: {
      title: "Agricultural News & Updates",
      articles: [
        "Government announces new subsidies for organic farming",
        "Technology advances in drone-based crop monitoring",
        "Climate-resilient seed varieties show promising results",
        "Digital marketplace connecting farmers directly to consumers"
      ]
    }
  };

  // Live translation test
  const testLiveTranslation = async (context: string) => {
    setLoading(prev => ({ ...prev, [context]: true }));
    
    try {
      const testText = context === 'weather' 
        ? "The weather conditions are favorable for planting. Soil moisture is optimal."
        : context === 'market'
        ? "Market prices for wheat have increased by 15% this week due to high demand."
        : "Smart farming techniques can increase crop yield by 25% while reducing water usage.";

      const response = await translationService.translateAgriculturalContent(
        testText,
        currentLanguage,
        context
      );

      if (response.success) {
        setDashboardData(prev => ({
          ...prev,
          [context]: {
            original: testText,
            translated: response.data.translatedText,
            context: response.data.context
          }
        }));
        
        toast({
          title: "Translation Success",
          description: `Successfully translated ${context} content to ${currentLanguage.toUpperCase()}`
        });
      }
    } catch (error) {
      console.error(`Translation failed for ${context}:`, error);
      toast({
        title: "Translation Error",
        description: `Failed to translate ${context} content`,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [context]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Globe className="h-8 w-8 text-primary" />
          <TranslatedText 
            text="CropCast Multilingual Agricultural Platform" 
            context="general"
            className="text-4xl font-bold"
          />
        </h1>
        
        <TranslatedText 
          text="Experience real-time agricultural insights in your preferred language using Google Gemini AI"
          context="general"
          className="text-lg text-muted-foreground"
        />

        <div className="flex justify-center items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Current: {currentLanguage.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center">
        <LanguageSelector variant="compact" className="w-auto" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Weather Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              <TranslatedText text={sampleData.weather.title} context="weather" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TranslatedText 
              text={sampleData.weather.description}
              context="weather"
              showOriginal={currentLanguage !== 'en'}
              className="text-sm text-muted-foreground"
            />
            
            <div className="space-y-2">
              <h4 className="font-medium">
                <TranslatedText text="Recommendations:" context="weather" />
              </h4>
              {sampleData.weather.recommendations.map((rec, index) => (
                <div key={index} className="p-2 bg-blue-50 rounded-md">
                  <TranslatedText 
                    text={rec}
                    context="weather"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={() => testLiveTranslation('weather')}
              disabled={loading.weather}
              size="sm"
              className="w-full"
            >
              {loading.weather ? (
                <LoadingIndicator size="sm" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <TranslatedText text="Test Live Translation" context="general" />
                </>
              )}
            </Button>

            {dashboardData.weather && (
              <div className="p-3 bg-muted rounded-md text-xs">
                <div className="font-medium mb-1">Live Translation Result:</div>
                <div className="text-primary">{dashboardData.weather.translated}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Prices Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <TranslatedText text={sampleData.market.title} context="market" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {sampleData.market.crops.map((crop, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                  <div>
                    <TranslatedText 
                      text={crop.name}
                      context="market"
                      className="font-medium text-sm"
                    />
                    <div className="text-xs text-muted-foreground">{crop.price}</div>
                  </div>
                  <Badge variant={crop.change.startsWith('+') ? 'default' : 'destructive'}>
                    {crop.change}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">
                <TranslatedText text="Market Insights:" context="market" />
              </h4>
              {sampleData.market.insights.map((insight, index) => (
                <div key={index} className="p-2 bg-green-50 rounded-md">
                  <TranslatedText 
                    text={insight}
                    context="market"
                    className="text-xs"
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={() => testLiveTranslation('market')}
              disabled={loading.market}
              size="sm"
              className="w-full"
            >
              {loading.market ? (
                <LoadingIndicator size="sm" />
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <TranslatedText text="Test Market Translation" context="general" />
                </>
              )}
            </Button>

            {dashboardData.market && (
              <div className="p-3 bg-muted rounded-md text-xs">
                <div className="font-medium mb-1">Live Translation Result:</div>
                <div className="text-primary">{dashboardData.market.translated}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farming Tips Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-5 w-5 text-emerald-500" />
              <TranslatedText text={sampleData.farming.title} context="soil" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {sampleData.farming.tips.map((tip, index) => (
                <div key={index} className="p-3 bg-emerald-50 rounded-md">
                  <TranslatedText 
                    text={tip}
                    context="soil"
                    className="text-sm"
                    showOriginal={currentLanguage !== 'en'}
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={() => testLiveTranslation('soil')}
              disabled={loading.soil}
              size="sm"
              className="w-full"
            >
              {loading.soil ? (
                <LoadingIndicator size="sm" />
              ) : (
                <>
                  <Sprout className="h-4 w-4 mr-2" />
                  <TranslatedText text="Test Farming Translation" context="general" />
                </>
              )}
            </Button>

            {dashboardData.soil && (
              <div className="p-3 bg-muted rounded-md text-xs">
                <div className="font-medium mb-1">Live Translation Result:</div>
                <div className="text-primary">{dashboardData.soil.translated}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* News & Updates Card */}
        <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <TranslatedText text={sampleData.news.title} context="general" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleData.news.articles.map((article, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <TranslatedText 
                    text={article}
                    context="general"
                    className="text-sm font-medium"
                    showOriginal={currentLanguage !== 'en'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <TranslatedText text="Multilingual Support Statistics" context="general" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">30+</div>
              <TranslatedText text="Languages Supported" context="general" className="text-sm text-blue-600" />
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">5</div>
              <TranslatedText text="Agricultural Contexts" context="general" className="text-sm text-green-600" />
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Real-time</div>
              <TranslatedText text="Translation Speed" context="general" className="text-sm text-purple-600" />
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">AI-Powered</div>
              <TranslatedText text="Gemini Integration" context="general" className="text-sm text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatedText text="How to Use Multilingual Features" context="general" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Globe className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">
                <TranslatedText text="1. Select Language" context="general" />
              </h3>
              <TranslatedText 
                text="Choose your preferred language from the dropdown menu above"
                context="general"
                className="text-sm text-muted-foreground"
              />
            </div>
            
            <div className="text-center p-4">
              <RefreshCw className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">
                <TranslatedText text="2. Watch Auto-Translation" context="general" />
              </h3>
              <TranslatedText 
                text="All content automatically translates to your selected language using Gemini AI"
                context="general"
                className="text-sm text-muted-foreground"
              />
            </div>
            
            <div className="text-center p-4">
              <Zap className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">
                <TranslatedText text="3. Test Live Features" context="general" />
              </h3>
              <TranslatedText 
                text="Click the test buttons to see real-time context-aware translations in action"
                context="general"
                className="text-sm text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Multilingual Dashboard Component
const MultilingualDashboard: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <MultilingualDashboardContent />
      </div>
    </LanguageProvider>
  );
};

export default MultilingualDashboard;