import React from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherWidgetProps {
  language: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  // Mock weather data - in real app, this would come from weather API
  const weatherData = {
    location: 'Mumbai, Maharashtra',
    locationHi: 'मुंबई, महाराष्ट्र',
    temperature: 28,
    condition: 'Partly Cloudy',
    conditionHi: 'आंशिक रूप से बादल',
    humidity: 72,
    windSpeed: 12,
    visibility: 8,
    rainChance: 30,
    forecast: [
      { day: 'Today', dayHi: 'आज', temp: 28, icon: Cloud },
      { day: 'Tomorrow', dayHi: 'कल', temp: 30, icon: Sun },
      { day: 'Wed', dayHi: 'बुध', temp: 26, icon: CloudRain },
      { day: 'Thu', dayHi: 'गुरु', temp: 29, icon: Sun },
    ]
  };

  const location = language === 'hi' ? weatherData.locationHi : weatherData.location;
  const condition = language === 'hi' ? weatherData.conditionHi : weatherData.condition;

  return (
    <Card className="weather-card border-0 text-sky-foreground animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {language === 'hi' ? 'मौसम अपडेट' : 'Weather Update'}
          </CardTitle>
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
            {language === 'hi' ? 'लाइव' : 'LIVE'}
          </div>
        </div>
        <p className="text-sm opacity-90">{location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 opacity-80" />
            <div>
              <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-sm opacity-90">{condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">
              {language === 'hi' ? 'बारिश की संभावना' : 'Rain Chance'}
            </div>
            <div className="text-lg font-semibold">{weatherData.rainChance}%</div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/20">
          <div className="text-center">
            <Droplets className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-90">
              {language === 'hi' ? 'नमी' : 'Humidity'}
            </div>
            <div className="text-sm font-semibold">{weatherData.humidity}%</div>
          </div>
          <div className="text-center">
            <Wind className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-90">
              {language === 'hi' ? 'हवा' : 'Wind'}
            </div>
            <div className="text-sm font-semibold">{weatherData.windSpeed} km/h</div>
          </div>
          <div className="text-center">
            <Eye className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-90">
              {language === 'hi' ? 'विज़िबिलिटी' : 'Visibility'}
            </div>
            <div className="text-sm font-semibold">{weatherData.visibility} km</div>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div className="pt-3 border-t border-white/20">
          <div className="text-sm font-medium mb-2 opacity-90">
            {language === 'hi' ? '4-दिन का पूर्वानुमान' : '4-Day Forecast'}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {weatherData.forecast.map((day, index) => {
              const Icon = day.icon;
              const dayName = language === 'hi' ? day.dayHi : day.day;
              return (
                <div key={index} className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                  <div className="text-xs opacity-90 mb-1">{dayName}</div>
                  <Icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
                  <div className="text-sm font-semibold">{day.temp}°</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;