import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  ArrowLeft, 
  Thermometer, 
  Droplets, 
  Wind,
  Eye,
  AlertTriangle,
  Sunrise,
  Sunset,
  Umbrella,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { weatherService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { weatherMock } from '@/mocks/weather';
import { useAnalytics } from '@/hooks/useAnalytics';

interface WeatherProps {
  language: string;
}

const Weather: React.FC<WeatherProps> = ({ language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data on component mount
  useEffect(() => {
    trackEvent('page_view', { page: 'weather' });
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await weatherService.getCurrentWeather({
        lat: '19.0760', // Mumbai coordinates (you can make this dynamic)
        lng: '72.8777',
        city: 'Mumbai',
        state: 'Maharashtra'
      });
      
      if (response.success) {
        setWeatherData(response.data);
        setError(null);
        trackEvent('weather_api_success');
      } else {
        throw new Error(response.message || 'Failed to fetch weather data');
      }
    } catch (err: any) {
      // Fallback to demo data
      setWeatherData(weatherMock);
      setError(null);
      trackEvent('weather_mock_used', { reason: err?.message });
      toast({
        title: language === 'hi' ? 'डेमो डेटा' : 'Demo Data',
        description: language === 'hi' ? 'बैकएंड उपलब्ध नहीं — डेमो मौसम डेटा दिखाया जा रहा है।' : 'Backend unavailable — showing demo weather data.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fallback weather data
  const currentWeather = weatherData?.current || {
    location: 'Mumbai, Maharashtra',
    locationHi: 'मुंबई, महाराष्ट्र',
    temperature: 28,
    condition: 'Partly Cloudy',
    conditionHi: 'आंशिक रूप से बादल',
    humidity: 72,
    windSpeed: 12,
    visibility: 8,
    pressure: 1013,
    uvIndex: 6,
    sunrise: '6:30 AM',
    sunset: '6:45 PM',
    rainChance: 30
  };

  // Comprehensive mock weather alerts for farmers
  const fallbackAlerts = [
    {
      type: 'warning',
      title: 'High Pest Risk Alert',
      titleHi: 'उच्च कीट जोखिम चेतावनी',
      message: 'Humid conditions (72% humidity) may increase aphid and whitefly activity. Check underside of leaves and apply neem oil spray if needed.',
      messageHi: 'उच्च नमी (72%) के कारण एफिड और सफ़ेद मक्खी की गतिविधि बढ़ सकती है। पत्तियों के निचले हिस्से की जांच करें और जरूरत पड़ने पर नीम का तेल स्प्रे करें।',
      icon: AlertTriangle,
      color: 'warning',
      priority: 'high',
      cropType: 'cotton, tomato, okra'
    },
    {
      type: 'info',
      title: 'Irrigation Schedule',
      titleHi: 'सिंचाई कार्यक्रम',
      message: 'With only 30% rain chance, plan irrigation for wheat and mustard crops. Early morning (5-7 AM) is optimal to reduce water evaporation.',
      messageHi: 'केवल 30% बारिश की संभावना के साथ, गेहूं और सरसों की फसलों के लिए सिंचाई की योजना बनाएं। सुबह जल्दी (5-7 बजे) पानी के वाष्पीकरण को कम करने के लिए उत्तम है।',
      icon: Droplets,
      color: 'sky',
      priority: 'medium',
      cropType: 'wheat, mustard, barley'
    },
    {
      type: 'success',
      title: 'Favorable Sowing Conditions',
      titleHi: 'अनुकूल बुआई स्थिति',
      message: 'Current temperature (28°C) and soil moisture are ideal for rabi crop sowing. Consider planting wheat, gram, and peas in the next 2-3 days.',
      messageHi: 'वर्तमान तापमान (28°C) और मिट्टी की नमी रबी फसल की बुआई के लिए आदर्श है। अगले 2-3 दिनों में गेहूं, चना और मटर बोने पर विचार करें।',
      icon: Sun,
      color: 'primary',
      priority: 'medium',
      cropType: 'wheat, gram, peas'
    },
    {
      type: 'warning',
      title: 'Fungal Disease Alert',
      titleHi: 'कवक रोग चेतावनी',
      message: 'High humidity (72%) + moderate temperature creates favorable conditions for fungal diseases. Apply preventive fungicide spray on vulnerable crops.',
      messageHi: 'उच्च नमी (72%) + मध्यम तापमान कवक रोगों के लिए अनुकूल परिस्थितियां बनाता है। संवेदनशील फसलों पर निवारक कवकनाशी स्प्रे करें।',
      icon: AlertTriangle,
      color: 'warning',
      priority: 'high',
      cropType: 'tomato, potato, grapes'
    },
    {
      type: 'info',
      title: 'Harvest Weather Window',
      titleHi: 'फसल कटाई का मौसम',
      message: 'Next 3 days show sunny weather - ideal for harvesting mature crops. Plan cotton picking and grain harvesting during this period.',
      messageHi: 'अगले 3 दिन धूप का मौसम दिखाते हैं - परिपक्व फसलों की कटाई के लिए आदर्श। इस अवधि के दौरान कपास की तुड़ाई और अनाज की कटाई की योजना बनाएं।',
      icon: Sun,
      color: 'sky',
      priority: 'low',
      cropType: 'cotton, rice, maize'
    }
  ];

  const fallbackForecast = [
    { day: 'Today', dayHi: 'आज', temp: { max: 28, min: 22 }, condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: Cloud, rain: 30 },
    { day: 'Tomorrow', dayHi: 'कल', temp: { max: 30, min: 24 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 10 },
    { day: 'Wed', dayHi: 'बुध', temp: { max: 26, min: 20 }, condition: 'Light Rain', conditionHi: 'हल्की बारिश', icon: CloudRain, rain: 80 },
    { day: 'Thu', dayHi: 'गुरु', temp: { max: 29, min: 23 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 5 },
    { day: 'Fri', dayHi: 'शुक्र', temp: { max: 31, min: 25 }, condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: Cloud, rain: 20 },
    { day: 'Sat', dayHi: 'शनि', temp: { max: 27, min: 21 }, condition: 'Cloudy', conditionHi: 'बादल', icon: Cloud, rain: 60 },
    { day: 'Sun', dayHi: 'रवि', temp: { max: 28, min: 22 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 15 }
  ];

  const alerts = weatherData?.alerts || fallbackAlerts;
  const weeklyForecast = weatherData?.forecast || fallbackForecast;
  const farmingRecommendations = weatherData?.farmingRecommendations || [];
  
  const location = weatherData?.location?.city || (language === 'hi' ? 'मुंबई, महाराष्ट्र' : 'Mumbai, Maharashtra');
  const condition = language === 'hi' ? currentWeather.conditionHi : currentWeather.condition;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{language === 'hi' ? 'मौसम डेटा लोड हो रहा है...' : 'Loading weather data...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchWeatherData}>
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-sky rounded-xl flex items-center justify-center shadow-glow-sky">
                <Cloud className="w-5 h-5 text-sky-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'मौसम चेतावनी' : 
                   language === 'pa' ? 'ਮੌਸਮ ਚੇਤਾਵਨੀ' : 
                   'Weather Alerts'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'वास्तविक समय मौसम और कृषि सुझाव' : 
                   language === 'pa' ? 'ਵਾਸਤਵਿਕ ਸਮਾਂ ਮੌਸਮ ਅਤੇ ਖੇਤਿਬਾੜੀ ਸੁਝਾਅ' : 
                   'Real-time weather and farming insights'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Current Weather */}
        <Card className="weather-card border-0 text-sky-foreground animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{location}</CardTitle>
                <p className="text-sm opacity-90">{condition}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{currentWeather.temperature}°C</div>
                <div className="text-sm opacity-90">
                  {language === 'hi' ? 'वास्तविक समय' : 
                   language === 'pa' ? 'ਵਾਸਤਵਿਕ ਸਮਾਂ' : 
                   'Real-time'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm text-center">
                <Droplets className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xs opacity-90">{language === 'hi' ? 'नमी' : language === 'pa' ? 'ਨਮੀ' : 'Humidity'}</div>
                <div className="text-lg font-semibold">{currentWeather.humidity}%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm text-center">
                <Wind className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xs opacity-90">{language === 'hi' ? 'हवा' : language === 'pa' ? 'ਹਵਾ' : 'Wind'}</div>
                <div className="text-lg font-semibold">{currentWeather.windSpeed} km/h</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm text-center">
                <Eye className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xs opacity-90">{language === 'hi' ? 'दृश्यता' : language === 'pa' ? 'ਦਰਿਸਬਤਾ' : 'Visibility'}</div>
                <div className="text-lg font-semibold">{currentWeather.visibility} km</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm text-center">
                <Umbrella className="w-5 h-5 mx-auto mb-1 opacity-80" />
                <div className="text-xs opacity-90">{language === 'hi' ? 'बारिश' : language === 'pa' ? 'ਮੀਂਹ' : 'Rain'}</div>
                <div className="text-lg font-semibold">{currentWeather.rainChance}%</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-90">{currentWeather.sunrise}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-90">{currentWeather.sunset}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold">
            {language === 'hi' ? 'कृषि चेतावनी' : 
             language === 'pa' ? 'ਖੇਤਿਬਾੜੀ ਚੇਤਾਵਨੀ' : 
             'Farming Alerts'}
          </h2>
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            const title = language === 'hi' ? alert.titleHi : alert.title;
            const message = language === 'hi' ? alert.messageHi : alert.message;
            
            return (
              <Alert key={index} className={`border-l-4 ${
                alert.color === 'warning' ? 'border-l-warning bg-warning/10' : 'border-l-sky bg-sky/10'
              } animate-fade-in`} style={{ animationDelay: `${index * 200}ms` }}>
                <Icon className={`h-4 w-4 ${alert.color === 'warning' ? 'text-warning' : 'text-sky'}`} />
                <AlertDescription>
                  <div className="font-semibold mb-1">{title}</div>
                  <div className="text-sm">{message}</div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>

        {/* 7-Day Forecast */}
        <Card className="crop-card border-border/20 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              {language === 'hi' ? '7-दिन का पूर्वानुमान' : '7-Day Forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyForecast.map((day, index) => {
                const Icon = day.icon;
                const dayName = language === 'hi' ? day.dayHi : day.day;
                const conditionName = language === 'hi' ? day.conditionHi : day.condition;
                
                return (
                  <div
                    key={index}
                    className={`text-center p-4 rounded-lg border border-border/20 hover:shadow-soft transition-all duration-300 animate-fade-in ${
                      index === 0 ? 'bg-primary/10 border-primary/30' : 'bg-muted/30'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="font-semibold mb-2">{dayName}</div>
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      day.condition.includes('Rain') ? 'text-sky' : 
                      day.condition.includes('Sun') ? 'text-warning' : 'text-muted-foreground'
                    }`} />
                    <div className="text-sm text-muted-foreground mb-1">{conditionName}</div>
                    <div className="font-semibold">
                      {day.temp.max}° / {day.temp.min}°
                    </div>
                    <div className="text-xs text-sky mt-1">
                      {day.rain}% {language === 'hi' ? 'बारिश' : 'rain'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Farming Recommendations */}
        <Card className="crop-card border-border/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              {language === 'hi' ? 'कृषि सुझाव' : 'Farming Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">
                {language === 'hi' ? 'इस सप्ताह के लिए सुझाव' : 'This Week\'s Recommendations'}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">
                      {language === 'hi' ? 'बुधवार की बारिश से पहले तैयारी' : 'Prepare Before Wednesday\'s Rain'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'hi' 
                        ? 'फसलों का छिड़काव पूरा करें और जल निकासी की जांच करें'
                        : 'Complete crop spraying and check drainage systems'
                      }
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">
                      {language === 'hi' ? 'रोग निगरानी आवश्यक' : 'Disease Monitoring Required'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'hi'
                        ? 'उच्च नमी के कारण पत्ती धब्बा और फफूंद रोगों की जांच करें'
                        : 'Check for leaf spot and fungal diseases due to high humidity'
                      }
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">
                      {language === 'hi' ? 'फसल कटाई की योजना' : 'Harvest Planning'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'hi'
                        ? 'आने वाले धूप वाले दिनों में परिपक्व फसलों की कटाई करें'
                        : 'Harvest mature crops during upcoming sunny days'
                      }
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">
                      {language === 'hi' ? 'मिट्टी नमी प्रबंधन' : 'Soil Moisture Management'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'hi'
                        ? 'सिंचाई को समायोजित करें और जल भराव से बचें'
                        : 'Adjust irrigation schedules and prevent waterlogging'
                      }
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;