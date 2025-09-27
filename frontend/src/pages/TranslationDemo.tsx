import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LanguageProvider, 
  LanguageSelector, 
  TranslatedText, 
  BatchTranslationPanel,
  useLanguage 
} from '../components/LanguageComponents';
import LoadingIndicator from '../components/LoadingIndicator';
import { useToast } from '../hooks/use-toast';
import { 
  translationService, 
  weatherService, 
  marketService, 
  pestDetectionService,
  soilService 
} from '../services';
import {
  Globe,
  Cloud,
  TrendingUp,
  Bug,
  Sprout,
  MessageSquare,
  RefreshCw
} from 'lucide-react';

// Demo content for different agricultural contexts
const demoContent = {
  weather: [
    "Today's weather is perfect for planting crops with moderate humidity and gentle rainfall.",
    "Strong winds expected tomorrow - secure your crops and equipment.",
    "Drought conditions may affect crop yield. Consider irrigation strategies.",
    "Heavy rainfall warning issued for the next 48 hours. Ensure proper drainage."
  ],
  market: [
    "Wheat prices have increased by 15% this week due to high demand.",
    "Rice export rates are favorable for farmers in the current market.",
    "Tomato prices are expected to drop next month based on seasonal trends.",
    "Organic vegetables are commanding premium prices in urban markets."
  ],
  pest: [
    "Early signs of aphid infestation detected. Apply neem oil treatment immediately.",
    "Fungal disease spotted on leaves. Increase ventilation and reduce watering.",
    "Beneficial insects like ladybugs can help control pest populations naturally.",
    "Regular crop monitoring is essential for early pest detection and management."
  ],
  soil: [
    "Soil pH levels are slightly acidic. Consider adding lime to balance nutrients.",
    "Nitrogen deficiency detected. Apply organic compost or nitrogen-rich fertilizer.",
    "Soil moisture levels are ideal for most crops. Continue current irrigation schedule.",
    "Clay soil detected. Improve drainage by adding organic matter and sand."
  ],
  yield: [
    "Based on current conditions, expect 20% higher yield than last season.",
    "Weather patterns suggest potential crop stress in the next month.",
    "Optimal planting window closes in two weeks for maximum yield potential.",
    "Soil health improvements should result in 15% better crop quality."
  ]
};

// Demo Data Component
const DemoDataSection = ({ title, icon: Icon, context, items }) => {
  const { currentLanguage } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline">{context}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[100px] p-4 bg-muted rounded-md">
          <TranslatedText
            text={items[currentIndex]}
            context={context}
            showOriginal={currentLanguage !== 'en'}
            className="text-sm"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} of {items.length}
          </span>
          <Button variant="outline" size="sm" onClick={nextItem}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Next Example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Live API Demo Component
const LiveApiDemo = () => {
  const [apiData, setApiData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const loadApiData = async (service, endpoint, key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      let response;
      switch (service) {
        case 'weather':
          response = await weatherService.getCurrentWeather(28.6139, 77.2090, 'Delhi', 'Delhi');
          break;
        case 'market':
          response = await marketService.getMarketPrices({ limit: 3 });
          break;
        case 'soil':
          response = await soilService.getSoilRecommendations();
          break;
        default:
          throw new Error('Unknown service');
      }

      if (response.success) {
        setApiData(prev => ({ ...prev, [key]: response.data }));
        toast({
          title: "Success",
          description: `${key} data loaded successfully`
        });
      }
    } catch (error) {
      console.error(`Failed to load ${key} data:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${key} data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cloud className="h-4 w-4" />
              <span>Live Weather</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => loadApiData('weather', '/weather/current', 'weather')}
              disabled={loading.weather}
              className="w-full"
            >
              {loading.weather ? (
                <>
                  <LoadingIndicator size="sm" />
                  Loading...
                </>
              ) : (
                'Load Weather Data'
              )}
            </Button>
            
            {apiData.weather && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <TranslatedText
                  text={`Current temperature: ${apiData.weather.current?.temperature || 'N/A'}°C. Conditions: ${apiData.weather.current?.description || 'Clear'}`}
                  context="weather"
                  showOriginal={currentLanguage !== 'en'}
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Live Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => loadApiData('market', '/market/prices', 'market')}
              disabled={loading.market}
              className="w-full"
            >
              {loading.market ? (
                <>
                  <LoadingIndicator size="sm" />
                  Loading...
                </>
              ) : (
                'Load Market Data'
              )}
            </Button>
            
            {apiData.market && apiData.market.prices && (
              <div className="mt-4 space-y-2">
                {apiData.market.prices.slice(0, 2).map((price, index) => (
                  <div key={index} className="p-2 bg-muted rounded-md">
                    <TranslatedText
                      text={`${price.commodity?.name || 'Unknown'}: ₹${price.price?.current || 'N/A'}/kg`}
                      context="market"
                      showOriginal={currentLanguage !== 'en'}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-4 w-4" />
              <span>Soil Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => loadApiData('soil', '/soil/recommendations', 'soil')}
              disabled={loading.soil}
              className="w-full"
            >
              {loading.soil ? (
                <>
                  <LoadingIndicator size="sm" />
                  Loading...
                </>
              ) : (
                'Load Soil Tips'
              )}
            </Button>
            
            {apiData.soil && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <TranslatedText
                  text="Regular soil testing is crucial for maintaining optimal crop growth and maximizing yield potential."
                  context="soil"
                  showOriginal={currentLanguage !== 'en'}
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Translation Demo Component
const TranslationDemoContent = () => {
  const { currentLanguage, supportedLanguages } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Globe className="h-8 w-8" />
          <TranslatedText 
            text="CropCast Multilingual Demo" 
            context="general"
            className="text-4xl font-bold"
          />
        </h1>
        
        <TranslatedText 
          text="Experience agricultural insights in your preferred language using Google Gemini AI"
          context="general"
          className="text-lg text-muted-foreground"
        />

        <div className="flex justify-center">
          <Badge variant="secondary" className="text-sm">
            Current Language: {supportedLanguages[currentLanguage] || 'English'} ({currentLanguage.toUpperCase()})
          </Badge>
        </div>
      </div>

      <div className="flex justify-center">
        <LanguageSelector className="w-full max-w-md" />
      </div>

      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="examples">
            <MessageSquare className="h-4 w-4 mr-2" />
            Examples
          </TabsTrigger>
          <TabsTrigger value="live-api">
            <RefreshCw className="h-4 w-4 mr-2" />
            Live API
          </TabsTrigger>
          <TabsTrigger value="batch">
            <Globe className="h-4 w-4 mr-2" />
            Batch Translation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemoDataSection
              title="Weather Insights"
              icon={Cloud}
              context="weather"
              items={demoContent.weather}
            />
            
            <DemoDataSection
              title="Market Updates"
              icon={TrendingUp}
              context="market"
              items={demoContent.market}
            />
            
            <DemoDataSection
              title="Pest Management"
              icon={Bug}
              context="pest"
              items={demoContent.pest}
            />
            
            <DemoDataSection
              title="Soil Analysis"
              icon={Sprout}
              context="soil"
              items={demoContent.soil}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <TranslatedText text="Yield Predictions" context="general" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoContent.yield.map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-md">
                    <TranslatedText
                      text={item}
                      context="yield"
                      showOriginal={currentLanguage !== 'en'}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatedText text="Live API Integration Demo" context="general" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TranslatedText 
                text="Test real-time translation of data from various CropCast APIs. Note: Some APIs may require authentication or external service keys."
                context="general"
                className="text-sm text-muted-foreground mb-4"
              />
              
              <LiveApiDemo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <BatchTranslationPanel />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatedText text="How It Works" context="general" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <TranslatedText
              text="CropCast uses Google Gemini AI to provide accurate, context-aware translations for agricultural content. The system understands farming terminology and provides culturally appropriate translations for different regions."
              context="general"
              showOriginal={currentLanguage !== 'en'}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-muted rounded-md">
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-2">
                <TranslatedText text="30+ Languages" context="general" />
              </h4>
              <TranslatedText
                text="Support for major world languages including Indian regional languages"
                context="general"
                className="text-sm text-muted-foreground"
              />
            </div>
            
            <div className="text-center p-4 bg-muted rounded-md">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-2">
                <TranslatedText text="Context-Aware" context="general" />
              </h4>
              <TranslatedText
                text="Specialized translations for weather, market, pest, soil, and yield contexts"
                context="general"
                className="text-sm text-muted-foreground"
              />
            </div>
            
            <div className="text-center p-4 bg-muted rounded-md">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-2">
                <TranslatedText text="Real-time" context="general" />
              </h4>
              <TranslatedText
                text="Instant translation of dynamic content from live agricultural data sources"
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

// Main Translation Demo Page
const TranslationDemo = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <TranslationDemoContent />
      </div>
    </LanguageProvider>
  );
};

export default TranslationDemo;