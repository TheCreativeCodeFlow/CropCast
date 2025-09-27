import { AlertTriangle, Droplets, Sun, Cloud, CloudRain } from 'lucide-react';

// Demo weather mock data for when backend is unavailable
export const weatherMock = {
  location: {
    city: 'Mumbai',
    state: 'Maharashtra',
    locationLabel: 'Mumbai, Maharashtra',
    locationLabelHi: 'मुंबई, महाराष्ट्र',
    locationLabelPa: 'ਮੁੰਬਈ, ਮਹਾਰਾਸ਼ਟਰ',
  },
  current: {
    location: 'Mumbai, Maharashtra',
    locationHi: 'मुंबई, महाराष्ट्र',
    locationPa: 'ਮੁੰਬਈ, ਮਹਾਰਾਸ਼ਟਰ',
    temperature: 28,
    condition: 'Partly Cloudy',
    conditionHi: 'आंशिक रूप से बादल',
    conditionPa: 'ਕੁਝ ਬੱਦਲਵਾਈ',
    humidity: 72,
    windSpeed: 12,
    visibility: 8,
    pressure: 1013,
    uvIndex: 6,
    sunrise: '6:30 AM',
    sunset: '6:45 PM',
    rainChance: 30,
  },
  alerts: [
    {
      type: 'warning',
      title: 'High Pest Risk Alert',
      titleHi: 'उच्च कीट जोखिम चेतावनी',
      titlePa: 'ਉੱਚ ਕੀੜੇ ਦੇ ਜੋਖਮ ਦੀ ਚੇਤਾਵਨੀ',
      message:
        'Humid conditions (72% humidity) may increase aphid and whitefly activity. Check underside of leaves and apply neem oil spray if needed.',
      messageHi:
        'उच्च नमी (72%) के कारण एफिड और सफ़ेद मक्खी की गतिविधि बढ़ सकती है। पत्तियों के निचले हिस्से की जांच करें और जरूरत पड़ने पर नीम का तेल स्प्रे करें।',
      messagePa:
        'ਨਮੀ ਦੀਆਂ ਸਥਿਤੀਆਂ (72% ਨਮੀ) ਕਾਰਨ ਮਾਰੂ ਅਤੇ ਚਿੱਟੇ ਮੱਖੀ ਦੀ ਗਤਿਵਿਧੀ ਵਧ ਸਕਦੀ ਹੈ। ਪੱਤਿਆਂ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਲੋੜ ਪੈਣ ਤੇ ਨਿੰਮ ਤੇਲ ਸਪਰੇ ਕਰੋ।',
      icon: AlertTriangle,
      color: 'warning',
      priority: 'high',
      cropType: 'cotton, tomato, okra',
    },
    {
      type: 'info',
      title: 'Irrigation Schedule',
      titleHi: 'सिंचाई कार्यक्रम',
      titlePa: 'ਸਿੰਚਾਈ ਦਾ ਸਮਾਂ-ਸਾਰਣੀ',
      message:
        'With only 30% rain chance, plan irrigation for wheat and mustard crops. Early morning (5-7 AM) is optimal to reduce water evaporation.',
      messageHi:
        'केवल 30% बारिश की संभावना के साथ, गेहूं और सरसों की फसलों के लिए सिंचाई की योजना बनाएं। सुबह जल्दी (5-7 बजे) पानी के वाष्पीकरण को कम करने के लिए उत्तम है।',
      messagePa:
        'ਸਿਰਫ 30% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਨਾਲ, ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਦੀਆਂ ਫਸਲਾਂ ਲਈ ਸਿੰਚਾਈ ਦੀ ਯੋਜਨਾ ਬਣਾਓ। ਸਵੇਰੇ (5-7 ਵਜੇ) ਪਾਣੀ ਦੇ ਵਾਸ਼ਪੀਕਰਣ ਨੂੰ ਘਟਾਉਣ ਲਈ ਸਰਵੋਤਮ ਹੈ।',
      icon: Droplets,
      color: 'sky',
      priority: 'medium',
      cropType: 'wheat, mustard, barley',
    },
    {
      type: 'success',
      title: 'Favorable Sowing Conditions',
      titleHi: 'अनुकूल बुआई स्थिति',
      titlePa: 'ਅਨੁਕੂਲ ਬੀਜਾਈ ਸਥਿਤੀਆਂ',
      message:
        'Current temperature (28°C) and soil moisture are ideal for rabi crop sowing. Consider planting wheat, gram, and peas in the next 2-3 days.',
      messageHi:
        'वर्तमान तापमान (28°C) और मिट्टी की नमी रबी फसल की बुआई के लिए आदर्श है। अगले 2-3 दिनों में गेहूं, चना और मटर बोने पर विचार करें।',
      messagePa:
        'ਮੌਜੂਦਾ ਤਾਪਮਾਨ (28°C) ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ ਰਬੀ ਫਸਲ ਦੀ ਬੀਜਾਈ ਲਈ ਆਦਰਸ਼ ਹੈ। ਅਗਲੇ 2-3 ਦਿਨਾਂ ਵਿੱਚ ਕਣਕ, ਚਨਾ ਅਤੇ ਮਟਰ ਬੀਜਣ ਬਾਰੇ ਸੋਚੋ।',
      icon: Sun,
      color: 'primary',
      priority: 'medium',
      cropType: 'wheat, gram, peas',
    },
  ],
  forecast: [
    { day: 'Today', dayHi: 'आज', temp: { max: 28, min: 22 }, condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: Cloud, rain: 30 },
    { day: 'Tomorrow', dayHi: 'कल', temp: { max: 30, min: 24 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 10 },
    { day: 'Wed', dayHi: 'बुध', temp: { max: 26, min: 20 }, condition: 'Light Rain', conditionHi: 'हल्की बारिश', icon: CloudRain, rain: 80 },
    { day: 'Thu', dayHi: 'गुरु', temp: { max: 29, min: 23 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 5 },
    { day: 'Fri', dayHi: 'शुक्र', temp: { max: 31, min: 25 }, condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: Cloud, rain: 20 },
    { day: 'Sat', dayHi: 'शनि', temp: { max: 27, min: 21 }, condition: 'Cloudy', conditionHi: 'बादल', icon: Cloud, rain: 60 },
    { day: 'Sun', dayHi: 'रवि', temp: { max: 28, min: 22 }, condition: 'Sunny', conditionHi: 'धूप', icon: Sun, rain: 15 },
  ],
  farmingRecommendations: [
    {
      id: 'prep-wed-rain',
      title: "Prepare Before Wednesday's Rain",
      titleHi: 'बुधवार की बारिश से पहले तैयारी',
      description: 'Complete crop spraying and check drainage systems',
      descriptionHi: 'फसलों का छिड़काव पूरा करें और जल निकासी की जांच करें',
    },
  ],
};
