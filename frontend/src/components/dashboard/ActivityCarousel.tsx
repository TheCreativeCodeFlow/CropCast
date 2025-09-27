import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Bug, 
  TrendingUp, 
  MessageCircle,
  Sprout,
  Cloud,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityCarouselProps {
  language: string;
}

interface Activity {
  id: string;
  type: 'prediction' | 'detection' | 'price-check' | 'ai-query' | 'soil-test' | 'weather-check';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  date: string;
  time: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  result?: string;
  resultHi?: string;
  confidence?: number;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
}

const ActivityCarousel: React.FC<ActivityCarouselProps> = ({ language }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const activities: Activity[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Wheat Yield Prediction',
      titleHi: 'गेहूं उपज पूर्वानुमान',
      description: 'Analyzed 5 acres farmland',
      descriptionHi: '5 एकड़ खेत का विश्लेषण',
      date: 'Today',
      time: '2:30 PM',
      status: 'completed',
      result: '22.5 quintals/acre',
      resultHi: '22.5 क्विंटल/एकड़',
      confidence: 87,
      icon: BarChart3,
      color: 'text-primary',
      bgGradient: 'bg-gradient-primary'
    },
    {
      id: '2',
      type: 'detection',
      title: 'Pest Detection',
      titleHi: 'कीट पहचान',
      description: 'Scanned tomato crop images',
      descriptionHi: 'टमाटर फसल की तस्वीरें स्कैन की',
      date: 'Today',
      time: '1:15 PM',
      status: 'completed',
      result: 'Aphids detected',
      resultHi: 'एफिड्स मिले',
      confidence: 92,
      icon: Bug,
      color: 'text-warning',
      bgGradient: 'bg-gradient-warm'
    },
    {
      id: '3',
      type: 'price-check',
      title: 'Market Price Check',
      titleHi: 'बाजार मूल्य जांच',
      description: 'Cotton prices in Nagpur',
      descriptionHi: 'नागपुर में कपास मूल्य',
      date: 'Today',
      time: '11:45 AM',
      status: 'completed',
      result: '₹6,800/quintal',
      resultHi: '₹6,800/क्विंटल',
      icon: TrendingUp,
      color: 'text-sky',
      bgGradient: 'bg-gradient-sky'
    },
    {
      id: '4',
      type: 'soil-test',
      title: 'Soil Health Analysis',
      titleHi: 'मिट्टी स्वास्थ्य विश्लेषण',
      description: 'NPK levels checked',
      descriptionHi: 'NPK स्तर जांचा गया',
      date: 'Yesterday',
      time: '4:20 PM',
      status: 'completed',
      result: 'pH: 6.8 - Good',
      resultHi: 'pH: 6.8 - अच्छा',
      icon: Sprout,
      color: 'text-secondary',
      bgGradient: 'bg-gradient-earth'
    },
    {
      id: '5',
      type: 'weather-check',
      title: 'Weather Forecast',
      titleHi: 'मौसम पूर्वानुमान',
      description: '7-day weather update',
      descriptionHi: '7-दिन मौसम अपडेट',
      date: 'Yesterday',
      time: '8:30 AM',
      status: 'completed',
      result: 'Rain expected Wed',
      resultHi: 'बुध को बारिश संभावित',
      icon: Cloud,
      color: 'text-sky',
      bgGradient: 'bg-gradient-sky'
    },
    {
      id: '6',
      type: 'ai-query',
      title: 'AI Assistant Query',
      titleHi: 'AI सहायक प्रश्न',
      description: 'Fertilizer recommendations',
      descriptionHi: 'उर्वरक सुझाव',
      date: '2 days ago',
      time: '3:15 PM',
      status: 'completed',
      result: 'DAP + Urea suggested',
      resultHi: 'DAP + यूरिया सुझाव',
      icon: MessageCircle,
      color: 'text-purple-500',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      id: '7',
      type: 'prediction',
      title: 'Rice Yield Forecast',
      titleHi: 'चावल उपज पूर्वानुमान',
      description: 'Monsoon impact analysis',
      descriptionHi: 'मानसून प्रभाव विश्लेषण',
      date: '3 days ago',
      time: '10:00 AM',
      status: 'completed',
      result: '28.2 quintals/acre',
      resultHi: '28.2 क्विंटल/एकड़',
      confidence: 91,
      icon: BarChart3,
      color: 'text-primary',
      bgGradient: 'bg-gradient-primary'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-primary" />;
      case 'in-progress':
        return <Clock className="w-3 h-3 text-warning animate-pulse" />;
      case 'scheduled':
        return <Calendar className="w-3 h-3 text-sky" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {language === 'hi' ? 'हाल की गतिविधियां' : 'Recent Activities'}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const title = language === 'hi' ? activity.titleHi : activity.title;
            const description = language === 'hi' ? activity.descriptionHi : activity.description;
            const result = language === 'hi' ? activity.resultHi : activity.result;

            return (
              <Card
                key={activity.id}
                className={`flex-shrink-0 w-80 crop-card border-border/20 hover:shadow-strong hover:-translate-y-1 transition-all duration-300 animate-fade-in cursor-pointer group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${activity.bgGradient} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(activity.status)}
                      {activity.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.confidence}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                    
                    {result && (
                      <div className="bg-muted/50 rounded-lg p-2 mt-2">
                        <p className="text-xs font-medium text-foreground">
                          {language === 'hi' ? 'परिणाम:' : 'Result:'} {result}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.date}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityCarousel;