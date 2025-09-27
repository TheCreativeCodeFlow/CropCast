import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketTickerProps {
  language: string;
}

interface CropPrice {
  name: string;
  nameHi: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  unitHi: string;
}

const MarketTicker: React.FC<MarketTickerProps> = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cropPrices: CropPrice[] = [
    {
      name: 'Wheat',
      nameHi: 'गेहूं',
      price: 2850,
      change: 50,
      changePercent: 1.8,
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल'
    },
    {
      name: 'Rice',
      nameHi: 'चावल',
      price: 3200,
      change: -75,
      changePercent: -2.3,
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल'
    },
    {
      name: 'Cotton',
      nameHi: 'कपास',
      price: 6800,
      change: 120,
      changePercent: 1.8,
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल'
    },
    {
      name: 'Sugarcane',
      nameHi: 'गन्ना',
      price: 380,
      change: 0,
      changePercent: 0,
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल'
    },
    {
      name: 'Onion',
      nameHi: 'प्याज',
      price: 1500,
      change: 200,
      changePercent: 15.4,
      unit: 'per quintal',
      unitHi: 'प्रति क्विंटल'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cropPrices.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cropPrices.length]);

  const currentCrop = cropPrices[currentIndex];
  const cropName = language === 'hi' ? currentCrop.nameHi : currentCrop.name;
  const unit = language === 'hi' ? currentCrop.unitHi : currentCrop.unit;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-primary" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-primary';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className="crop-card border-border/20 animate-scale-in overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'hi' ? 'मंडी मूल्य' : 'Mandi Prices'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'hi' ? 'लाइव बाजार दरें' : 'Live market rates'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Crop Price */}
        <div className="bg-gradient-primary rounded-xl p-4 text-primary-foreground animate-slide-up">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold">{cropName}</h3>
              <p className="text-sm opacity-90">{unit}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{currentCrop.price.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(currentCrop.change)}`}>
                {getTrendIcon(currentCrop.change)}
                <span>
                  {currentCrop.change > 0 ? '+' : ''}
                  ₹{Math.abs(currentCrop.change)} ({currentCrop.changePercent > 0 ? '+' : ''}{currentCrop.changePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Indicators */}
        <div className="flex justify-center gap-2">
          {cropPrices.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/20">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              {language === 'hi' ? 'उच्चतम आज' : 'Highest Today'}
            </div>
            <div className="text-sm font-semibold text-primary">₹6,800</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              {language === 'hi' ? 'सक्रिय फसलें' : 'Active Crops'}
            </div>
            <div className="text-sm font-semibold">{cropPrices.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTicker;