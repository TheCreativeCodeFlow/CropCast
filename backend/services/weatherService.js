const axios = require('axios');

// Weather service to fetch weather data from external APIs
class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lng) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: this.getWindDirection(data.wind.deg),
        pressure: data.main.pressure,
        visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
        uvIndex: 6, // Would need UV Index API
        condition: data.weather[0].description,
        conditionHi: this.translateCondition(data.weather[0].description),
        rainChance: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(lat, lng) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      const forecast = [];
      
      // Group by day and get daily forecast
      const dailyData = {};
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      let dayIndex = 0;
      Object.keys(dailyData).slice(0, 7).forEach(date => {
        const dayData = dailyData[date];
        const temps = dayData.map(d => d.main.temp);
        const conditions = dayData.map(d => d.weather[0].description);
        const rain = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0);

        const dayNames = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayNamesHi = ['आज', 'कल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

        forecast.push({
          date: new Date(date),
          day: dayNames[dayIndex] || new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
          dayHi: dayNamesHi[dayIndex] || new Date(date).toLocaleDateString('hi-IN', { weekday: 'short' }),
          temperature: {
            max: Math.round(Math.max(...temps)),
            min: Math.round(Math.min(...temps))
          },
          condition: conditions[0],
          conditionHi: this.translateCondition(conditions[0]),
          rainChance: Math.min(100, Math.round(rain * 10)),
          rainfall: rain,
          humidity: Math.round(dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length),
          windSpeed: Math.round(dayData.reduce((sum, d) => sum + d.wind.speed, 0) / dayData.length * 3.6)
        });
        dayIndex++;
      });

      return forecast;
    } catch (error) {
      console.error('Forecast API error:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  }

  translateCondition(condition) {
    const translations = {
      'clear sky': 'साफ आसमान',
      'few clouds': 'कुछ बादल',
      'scattered clouds': 'बिखरे बादल',
      'broken clouds': 'टूटे बादल',
      'shower rain': 'बौछारें',
      'rain': 'बारिश',
      'thunderstorm': 'तूफान',
      'snow': 'बर्फ',
      'mist': 'धुंध',
      'overcast clouds': 'घने बादल'
    };
    return translations[condition.toLowerCase()] || condition;
  }
}

// Function to get weather data from API
async function getWeatherFromAPI(lat, lng, city, state) {
  const weatherService = new WeatherService();
  
  try {
    const [current, forecast] = await Promise.all([
      weatherService.getCurrentWeather(lat, lng),
      weatherService.getForecast(lat, lng)
    ]);

    // Generate weather alerts based on current conditions
    const alerts = generateWeatherAlerts(current, forecast);

    return {
      current,
      forecast,
      alerts
    };
  } catch (error) {
    console.error('Weather service error:', error);
    
    // Return mock data if API fails
    return getMockWeatherData();
  }
}

// Generate weather-based alerts
function generateWeatherAlerts(current, forecast) {
  const alerts = [];

  // High temperature alert
  if (current.temperature > 40) {
    alerts.push({
      type: 'weather',
      severity: 'high',
      title: 'Heat Wave Alert',
      titleHi: 'गर्मी की लहर चेतावनी',
      message: 'Extreme heat conditions. Avoid outdoor activities during peak hours.',
      messageHi: 'अत्यधिक गर्मी की स्थिति। दिन के समय बाहरी गतिविधियों से बचें।',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true
    });
  }

  // Heavy rain alert
  const heavyRainDay = forecast.find(day => day.rainfall > 50);
  if (heavyRainDay) {
    alerts.push({
      type: 'weather',
      severity: 'medium',
      title: 'Heavy Rain Expected',
      titleHi: 'भारी बारिश की संभावना',
      message: 'Heavy rainfall expected. Ensure proper drainage in fields.',
      messageHi: 'भारी बारिश की उम्मीद। खेतों में उचित जल निकासी सुनिश्चित करें।',
      validFrom: new Date(),
      validTo: new Date(heavyRainDay.date),
      isActive: true
    });
  }

  // High humidity pest alert
  if (current.humidity > 80) {
    alerts.push({
      type: 'pest',
      severity: 'medium',
      title: 'High Pest Risk',
      titleHi: 'उच्च कीट जोखिम',
      message: 'High humidity may increase pest activity. Monitor crops closely.',
      messageHi: 'उच्च नमी से कीटों की गतिविधि बढ़ सकती है। फसलों की बारीकी से निगरानी करें।',
      validFrom: new Date(),
      validTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isActive: true
    });
  }

  return alerts;
}

// Generate farming recommendations based on weather
function generateFarmingRecommendations(weatherData) {
  const recommendations = [];
  const { current, forecast } = weatherData;

  // Irrigation recommendations
  const upcomingRain = forecast.slice(0, 3).some(day => day.rainfall > 10);
  if (!upcomingRain && current.humidity < 60) {
    recommendations.push({
      type: 'irrigation',
      priority: 'high',
      title: 'Irrigation Needed',
      titleHi: 'सिंचाई आवश्यक',
      description: 'No significant rain expected in next 3 days. Schedule irrigation.',
      descriptionHi: 'अगले 3 दिनों में महत्वपूर्ण बारिश की उम्मीद नहीं। सिंचाई की योजना बनाएं।',
      validFor: {
        crops: ['wheat', 'rice', 'cotton', 'vegetables'],
        cropsHi: ['गेहूं', 'चावल', 'कपास', 'सब्जियां']
      },
      timing: 'Next 2-3 days',
      timingHi: 'अगले 2-3 दिन'
    });
  }

  // Spraying recommendations
  if (current.windSpeed < 10 && current.rainChance < 30) {
    recommendations.push({
      type: 'spraying',
      priority: 'medium',
      title: 'Good Spraying Conditions',
      titleHi: 'छिड़काव के लिए अच्छी स्थिति',
      description: 'Low wind and no rain expected. Good time for pesticide application.',
      descriptionHi: 'कम हवा और बारिश की उम्मीद नहीं। कीटनाशक छिड़काव के लिए अच्छा समय।',
      validFor: {
        crops: ['all'],
        cropsHi: ['सभी']
      },
      timing: 'Today',
      timingHi: 'आज'
    });
  }

  // Harvesting recommendations
  const drySeason = forecast.slice(0, 5).every(day => day.rainfall < 5);
  if (drySeason && current.humidity < 70) {
    recommendations.push({
      type: 'harvesting',
      priority: 'high',
      title: 'Ideal Harvesting Weather',
      titleHi: 'कटाई के लिए आदर्श मौसम',
      description: 'Dry weather expected for next 5 days. Good time for harvesting.',
      descriptionHi: 'अगले 5 दिन सूखा मौसम रहने की उम्मीद। कटाई के लिए अच्छा समय।',
      validFor: {
        crops: ['wheat', 'barley', 'mustard'],
        cropsHi: ['गेहूं', 'जौ', 'सरसों']
      },
      timing: 'Next 5 days',
      timingHi: 'अगले 5 दिन'
    });
  }

  return recommendations;
}

// Mock weather data for fallback
function getMockWeatherData() {
  return {
    current: {
      temperature: 28,
      humidity: 72,
      windSpeed: 12,
      windDirection: 'NW',
      pressure: 1013,
      visibility: 8,
      uvIndex: 6,
      condition: 'Partly cloudy',
      conditionHi: 'आंशिक रूप से बादल',
      rainChance: 30,
      sunrise: '6:30 AM',
      sunset: '6:45 PM'
    },
    forecast: [
      {
        date: new Date(),
        day: 'Today',
        dayHi: 'आज',
        temperature: { max: 28, min: 22 },
        condition: 'Partly Cloudy',
        conditionHi: 'आंशिक बादल',
        rainChance: 30,
        rainfall: 0,
        humidity: 72,
        windSpeed: 12
      },
      {
        date: new Date(Date.now() + 86400000),
        day: 'Tomorrow',
        dayHi: 'कल',
        temperature: { max: 30, min: 24 },
        condition: 'Sunny',
        conditionHi: 'धूप',
        rainChance: 10,
        rainfall: 0,
        humidity: 65,
        windSpeed: 10
      }
    ],
    alerts: [
      {
        type: 'farming',
        severity: 'medium',
        title: 'Irrigation Reminder',
        titleHi: 'सिंचाई अनुस्मारक',
        message: 'Consider scheduling irrigation for tomorrow.',
        messageHi: 'कल के लिए सिंचाई की योजना बनाने पर विचार करें।',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]
  };
}

module.exports = {
  getWeatherFromAPI,
  generateFarmingRecommendations,
  generateWeatherAlerts
};