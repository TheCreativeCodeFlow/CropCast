import React from 'react';
import { 
  BarChart3, 
  Cloud, 
  Sprout, 
  Bug, 
  TrendingUp, 
  MessageCircle,
  ArrowRight,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface DashboardCardsProps {
  language: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ language }) => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'yield-prediction',
      title: 'Yield Prediction',
      titleHi: 'उपज की भविष्यवाणी',
      description: 'Predict your crop yield based on current conditions',
      descriptionHi: 'वर्तमान स्थितियों के आधार पर अपनी फसल की पैदावार का अनुमान लगाएं',
      icon: BarChart3,
      gradient: 'bg-gradient-primary',
      glowClass: 'shadow-glow-primary',
      route: '/yield-prediction',
      cta: 'Enter Data',
      ctaHi: 'डेटा दर्ज करें',
      preview: '85% Confidence'
    },
    {
      id: 'weather',
      title: 'Weather Alerts',
      titleHi: 'मौसम चेतावनी',
      description: 'Real-time weather updates and farming alerts',
      descriptionHi: 'वास्तविक समय मौसम अपडेट और खेती की चेतावनी',
      icon: Cloud,
      gradient: 'bg-gradient-sky',
      glowClass: 'shadow-glow-sky',
      route: '/weather',
      cta: 'Check Weather',
      ctaHi: 'मौसम देखें',
      preview: '28°C, Sunny'
    },
    {
      id: 'soil-guide',
      title: 'Soil & Fertilizer Guide',
      titleHi: 'मिट्टी और उर्वरक गाइड',
      description: 'Get personalized soil health and fertilizer recommendations',
      descriptionHi: 'व्यक्तिगत मिट्टी स्वास्थ्य और उर्वरक सिफारिशें प्राप्त करें',
      icon: Sprout,
      gradient: 'bg-gradient-earth',
      glowClass: 'shadow-medium',
      route: '/soil-guide',
      cta: 'Get Recommendations',
      ctaHi: 'सिफारिशें प्राप्त करें',
      preview: 'pH: 6.8 - Good'
    },
    {
      id: 'pest-detection',
      title: 'Pest Detection',
      titleHi: 'कीट पहचान',
      description: 'Upload crop images to detect pests and get treatment advice',
      descriptionHi: 'कीटों का पता लगाने और उपचार सलाह के लिए फसल की तस्वीरें अपलोड करें',
      icon: Bug,
      gradient: 'bg-gradient-warm',
      glowClass: 'shadow-medium',
      route: '/pest-detection',
      cta: 'Upload Image',
      ctaHi: 'फोटो अपलोड करें',
      preview: 'AI Powered'
    },
    {
      id: 'market-prices',
      title: 'Market Prices',
      titleHi: 'बाजार मूल्य',
      description: 'Live mandi prices and market trends for your crops',
      descriptionHi: 'आपकी फसलों के लिए लाइव मंडी मूल्य और बाजार रुझान',
      icon: TrendingUp,
      gradient: 'bg-gradient-primary',
      glowClass: 'shadow-glow-primary',
      route: '/market-prices',
      cta: 'View Prices',
      ctaHi: 'मूल्य देखें',
      preview: '₹2,850/quintal'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const title = language === 'hi' ? card.titleHi : card.title;
        const description = language === 'hi' ? card.descriptionHi : card.description;
        const cta = language === 'hi' ? card.ctaHi : card.cta;

        return (
          <Card
            key={card.id}
            className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-strong animate-fade-in border-border/20 overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleCardClick(card.route)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${card.gradient} flex items-center justify-center ${card.glowClass} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {card.preview}
                </div>
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="ghost" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 justify-between"
              >
                <span>{cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;