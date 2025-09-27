import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  BarChart3, 
  Bell,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MarketPricesProps {
  language: string;
}

interface CropPrice {
  id: string;
  name: string;
  nameHi: string;
  namePa: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  market: string;
  marketHi: string;
  marketPa: string;
  unit: string;
  unitHi: string;
  unitPa: string;
  quality: string;
  qualityHi: string;
  qualityPa: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  forecast: 'bullish' | 'bearish' | 'stable';
}

const MarketPrices: React.FC<MarketPricesProps> = ({ language }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');

  const marketData: CropPrice[] = [
    {
      id: 'wheat',
      name: 'Wheat',
      nameHi: 'गेहूं',
      namePa: 'ਕਣਕ',
      category: 'cereal',
      currentPrice: 2850,
      previousPrice: 2800,
      change: 50,
      changePercent: 1.8,
      market: 'Mumbai APMC',
      marketHi: 'मुंबई एपीएमसी',
      marketPa: 'ਮੁੰਬਈ APMC',
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल',
      unitPa: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      quality: 'Grade A',
      qualityHi: 'ग्रेड ए',
      qualityPa: 'ਗ੍ਰੇਡ A',
      lastUpdated: '2 minutes ago',
      trend: 'up',
      forecast: 'bullish'
    },
    {
      id: 'rice',
      name: 'Rice',
      nameHi: 'चावल',
      namePa: 'ਚਾਵਲ',
      category: 'cereal',
      currentPrice: 3200,
      previousPrice: 3275,
      change: -75,
      changePercent: -2.3,
      market: 'Delhi APMC',
      marketHi: 'दिल्ली एपीएमसी',
      marketPa: 'ਦਿੱਲੀ APMC',
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल',
      unitPa: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      quality: 'Grade A',
      qualityHi: 'ग्रेड ए',
      qualityPa: 'ਗ੍ਰੇਡ A',
      lastUpdated: '5 minutes ago',
      trend: 'down',
      forecast: 'bearish'
    },
    {
      id: 'cotton',
      name: 'Cotton',
      nameHi: 'कपास',
      namePa: 'ਕਪਾਹ',
      category: 'fiber',
      currentPrice: 6800,
      previousPrice: 6680,
      change: 120,
      changePercent: 1.8,
      market: 'Nagpur APMC',
      marketHi: 'नागपुर एपीएमसी',
      marketPa: 'ਨਾਗਪੁਰ APMC',
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल',
      unitPa: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      quality: 'Grade B',
      qualityHi: 'ग्रेड बी',
      qualityPa: 'ਗ੍ਰੇਡ B',
      lastUpdated: '8 minutes ago',
      trend: 'up',
      forecast: 'bullish'
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane',
      nameHi: 'गन्ना',
      namePa: 'ਗੰਨਾ',
      category: 'cash',
      currentPrice: 380,
      previousPrice: 380,
      change: 0,
      changePercent: 0,
      market: 'Pune APMC',
      marketHi: 'पुणे एपीएमसी',
      marketPa: 'ਪੁਣੇ APMC',
      unit: 'per ton',
      unitHi: 'प्रति टन',
      unitPa: 'ਪ੍ਰਤੀ ਟਨ',
      quality: 'Standard',
      qualityHi: 'मानक',
      qualityPa: 'ਮਾਨਕ',
      lastUpdated: '12 minutes ago',
      trend: 'stable',
      forecast: 'stable'
    },
    {
      id: 'onion',
      name: 'Onion',
      nameHi: 'प्याज',
      namePa: 'ਪਿਆਜ',
      category: 'vegetable',
      currentPrice: 1500,
      previousPrice: 1300,
      change: 200,
      changePercent: 15.4,
      market: 'Nashik APMC',
      marketHi: 'नाशिक एपीएमसी',
      marketPa: 'ਨਾਸ਼ਿਕ APMC',
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल',
      unitPa: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      quality: 'Grade A',
      qualityHi: 'ग्रेड ए',
      qualityPa: 'ਗ੍ਰੇਡ A',
      lastUpdated: '15 minutes ago',
      trend: 'up',
      forecast: 'bullish'
    },
    {
      id: 'tomato',
      name: 'Tomato',
      nameHi: 'टमाटर',
      namePa: 'ਟਮਾਟਰ',
      category: 'vegetable',
      currentPrice: 2200,
      previousPrice: 2500,
      change: -300,
      changePercent: -12.0,
      market: 'Bangalore APMC',
      marketHi: 'बैंगलोर एपीएमसी',
      marketPa: 'ਬੰਗਲੂਰ APMC',
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल',
      unitPa: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ',
      quality: 'Grade A',
      qualityHi: 'ग्रेड ए',
      qualityPa: 'ਗ੍ਰੇਡ A',
      lastUpdated: '18 minutes ago',
      trend: 'down',
      forecast: 'bearish'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', labelHi: 'सभी श्रेणियां', labelPa: 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ' },
    { value: 'cereal', label: 'Cereals', labelHi: 'अनाज', labelPa: 'ਅਨਾਜ' },
    { value: 'vegetable', label: 'Vegetables', labelHi: 'सब्जियां', labelPa: 'ਸਬਜ਼ੀਆਂ' },
    { value: 'fiber', label: 'Fiber Crops', labelHi: 'रेशा फसलें', labelPa: 'ਰੇਸਾ ਫਸਲਾਂ' },
    { value: 'cash', label: 'Cash Crops', labelHi: 'नकदी फसलें', labelPa: 'ਨਕਦ ਫਸਲਾਂ' }
  ];

  const markets = [
    { value: 'all', label: 'All Markets', labelHi: 'सभी बाजार', labelPa: 'ਸਾਰੇ ਬਾਜਾਰ' },
    { value: 'mumbai', label: 'Mumbai APMC', labelHi: 'मुंबई एपीएमसी', labelPa: 'ਮੁੰਬਈ APMC' },
    { value: 'delhi', label: 'Delhi Mandi', labelHi: 'दिल्ली मंडी', labelPa: 'ਦਿੱਲੀ ਮੰਡੀ' },
    { value: 'nagpur', label: 'Nagpur APMC', labelHi: 'नागपुर एपीएमसी', labelPa: 'ਨਾਗਪੁਰ APMC' },
    { value: 'nashik', label: 'Nashik APMC', labelHi: 'नाशिक एपीएमसी', labelPa: 'ਨਾਸ਼ਿਕ APMC' },
    { value: 'Jalandhar', label: 'Jalandhar Mandi', labelHi: 'नाशिक एपीएमसी', labelPa: 'ਨਾਸ਼ਿਕ APMC' },
    { value: 'Amritsar', label: 'Amritsar APMC', labelHi: 'नाशिक एपीएमसी', labelPa: 'ਨਾਸ਼ਿਕ APMC' }
  ];

  const filteredData = marketData.filter(item => {
    const cropMatch = selectedCrop === 'all' || item.category === selectedCrop;
    const marketMatch = selectedMarket === 'all' || item.market.toLowerCase().includes(selectedMarket);
    return cropMatch && marketMatch;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable': return <Minus className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-primary';
      case 'down': return 'text-destructive';
      case 'stable': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getForecastBadge = (forecast: string) => {
    const forecastMap = {
      bullish: { 
        label: language === 'hi' ? 'तेजी' : language === 'pa' ? 'ਤੇਜੀ' : 'Bullish', 
        variant: 'default' as const, 
        color: 'bg-primary text-primary-foreground' 
      },
      bearish: { 
        label: language === 'hi' ? 'मंदी' : language === 'pa' ? 'ਗਿਰਾਵਟ' : 'Bearish', 
        variant: 'destructive' as const, 
        color: 'bg-destructive text-destructive-foreground' 
      },
      stable: { 
        label: language === 'hi' ? 'स्थिर' : language === 'pa' ? 'ਸਿਥਰ' : 'Stable', 
        variant: 'secondary' as const, 
        color: 'bg-secondary text-secondary-foreground' 
      }
    };
    return forecastMap[forecast] || forecastMap.stable;
  };

  const setupPriceAlert = (cropId: string) => {
    toast({
      title: language === 'hi' ? 'मूल्य अलर्ट' : language === 'pa' ? 'ਦਰ ਅਲਰਟ' : 'Price Alert',
      description: language === 'hi' ? 'मूल्य अलर्ट सेट किया गया' : 
                   language === 'pa' ? 'ਦਰ ਅਲਰਟ ਸੈੱਟ ਕੀਤਾ ਗਿਆ' : 'Price alert has been set'
    });
  };

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
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'hi' ? 'बाजार मूल्य' : 
                   language === 'pa' ? 'ਬਾਜਾਰ ਦਰਾਂ' : 'Market Prices'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'लाइव मंडी मूल्य और बाजार रुझान' : 
                   language === 'pa' ? 'ਲਾਈਵ ਮੰਡੀ ਦਰਾਂ ਅਤੇ ਮਾਰਕੀਟ ਰੁਝਾਨ' : 'Live mandi prices and market trends'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Filters */}
        <Card className="crop-card border-border/20 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">
                    {language === 'hi' ? 'फसल श्रेणी' : 
                     language === 'pa' ? 'ਫਸਲ ਸ਼੍ਰੇਣੀ' : 'Crop Category'}
                  </label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {language === 'hi' ? category.labelHi : 
                           language === 'pa' ? category.labelPa : category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">
                    {language === 'hi' ? 'मंडी बाजार' : 
                     language === 'pa' ? 'ਮੰਡੀ ਬਾਜਾਰ' : 'Market'}
                  </label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map((market) => (
                        <SelectItem key={market.value} value={market.value}>
                          {language === 'hi' ? market.labelHi : 
                           language === 'pa' ? market.labelPa : market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {language === 'hi' ? 'रिफ्रेश' : language === 'pa' ? 'ਰਿਫਰੈਸ਼' : 'Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="crop-card border-border/20 animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹3,421</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'औसत मूल्य' : 
                   language === 'pa' ? 'ਔਸਤ ਦਰ' : 'Average Price'}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2 text-primary">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">+2.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crop-card border-border/20 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky">12</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'सक्रिय बाजार' : 
                   language === 'pa' ? 'ਸਰਗਰਮ ਬਾਜਾਰ' : 'Active Markets'}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {language === 'hi' ? 'लाइव अपडेट' : 
                   language === 'pa' ? 'ਲਾਈਵ ਅਪਡੇਟ' : 'Live Updates'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crop-card border-border/20 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">24h</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'अपडेट आवृत्ति' : 
                   language === 'pa' ? 'ਅਪਡੇਟ ਦਰ' : 'Update Frequency'}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {language === 'hi' ? 'निरंतर निगरानी' : 
                   language === 'pa' ? 'ਲਗਾਤਾਰ ਨਿਗਰਾਨੀ' : 'Continuous Monitoring'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Table */}
        <Card className="crop-card border-border/20 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {language === 'hi' ? 'फसल मूल्य सूची' : 
               language === 'pa' ? 'ਫਸਲ ਦਰ ਸੂਚੀ' : 'Crop Price List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((crop, index) => {
                const name = language === 'hi' ? crop.nameHi : language === 'pa' ? crop.namePa : crop.name;
                const market = language === 'hi' ? crop.marketHi : language === 'pa' ? crop.marketPa : crop.market;
                const unit = language === 'hi' ? crop.unitHi : language === 'pa' ? crop.unitPa : crop.unit;
                const quality = language === 'hi' ? crop.qualityHi : language === 'pa' ? crop.qualityPa : crop.quality;
                const forecast = getForecastBadge(crop.forecast);
                
                return (
                  <div
                    key={crop.id}
                    className={`bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{name}</h3>
                          <Badge className={forecast.color}>
                            {forecast.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {market}
                          </span>
                          <span>{quality}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {crop.lastUpdated}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between lg:justify-end gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ₹{crop.currentPrice.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{unit}</div>
                        </div>
                        
                        <div className={`text-right ${getTrendColor(crop.trend)}`}>
                          <div className="flex items-center gap-1 justify-end">
                            {getTrendIcon(crop.trend)}
                            <span className="font-semibold">
                              {crop.change > 0 ? '+' : ''}₹{Math.abs(crop.change)}
                            </span>
                          </div>
                          <div className="text-xs">
                            ({crop.changePercent > 0 ? '+' : ''}{crop.changePercent}%)
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setupPriceAlert(crop.id)}
                          className="gap-2"
                        >
                          <Bell className="w-3 h-3" />
                          {language === 'hi' ? 'अलर्ट' : language === 'pa' ? 'ਅਲਰਟ' : 'Alert'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="crop-card border-border/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === 'hi' ? 'बाजार अंतर्दृष्टि' : 'Market Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">
                {language === 'hi' ? 'इस सप्ताह के रुझान' : 'This Week\'s Trends'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                  <span>
                    {language === 'hi' 
                      ? 'प्याज की कीमतों में 15% की वृद्धि, मौसमी मांग के कारण'
                      : 'Onion prices surge 15% due to seasonal demand'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                  <span>
                    {language === 'hi'
                      ? 'कपास की कीमतें स्थिर, निर्यात मांग मजबूत'
                      : 'Cotton prices stable with strong export demand'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                  <span>
                    {language === 'hi'
                      ? 'गेहूं की कीमतों में सुधार, सरकारी खरीद शुरू'
                      : 'Wheat prices improve with government procurement starting'
                    }
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;