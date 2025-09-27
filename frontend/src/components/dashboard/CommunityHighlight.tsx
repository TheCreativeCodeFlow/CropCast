import React from 'react';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Award,
  BarChart3,
  Sprout,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CommunityHighlightProps {
  language: string;
}

interface CommunityData {
  id: string;
  type: 'prediction' | 'achievement' | 'tip' | 'success';
  farmer: {
    name: string;
    nameHi: string;
    location: string;
    locationHi: string;
    avatar: string;
  };
  content: string;
  contentHi: string;
  metric?: {
    value: string;
    label: string;
    labelHi: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  icon: React.ComponentType<any>;
  color: string;
}

const CommunityHighlight: React.FC<CommunityHighlightProps> = ({ language }) => {
  const communityData: CommunityData[] = [
    {
      id: '1',
      type: 'prediction',
      farmer: {
        name: 'Rajesh Kumar',
        nameHi: 'राजेश कुमार',
        location: 'Punjab',
        locationHi: 'पंजाब',
        avatar: 'RK'
      },
      content: 'Predicted excellent wheat yield of 28 quintals per acre using CropCast AI',
      contentHi: 'CropCast AI का उपयोग करके 28 क्विंटल प्रति एकड़ उत्कृष्ट गेहूं उपज की भविष्यवाणी की',
      metric: {
        value: '28 q/acre',
        label: 'Wheat Yield',
        labelHi: 'गेहूं उपज'
      },
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      id: '2',
      type: 'achievement',
      farmer: {
        name: 'Priya Patel',
        nameHi: 'प्रिया पटेल',
        location: 'Gujarat',
        locationHi: 'गुजरात',
        avatar: 'PP'
      },
      content: 'Earned "Pest Detective" badge after successfully identifying cotton bollworm',
      contentHi: 'कपास बॉलवर्म की सफल पहचान के बाद "कीट जासूस" बैज अर्जित किया',
      timestamp: '4 hours ago',
      likes: 31,
      comments: 12,
      icon: Award,
      color: 'text-warning'
    },
    {
      id: '3',
      type: 'tip',
      farmer: {
        name: 'Suresh Reddy',
        nameHi: 'सुरेश रेड्डी',
        location: 'Telangana',
        locationHi: 'तेलंगाना',
        avatar: 'SR'
      },
      content: 'Shared organic fertilizer recipe that increased soil health by 15%',
      contentHi: 'जैविक उर्वरक रेसिपी साझा की जिससे मिट्टी की सेहत में 15% सुधार हुआ',
      metric: {
        value: '+15%',
        label: 'Soil Health',
        labelHi: 'मिट्टी स्वास्थ्य'
      },
      timestamp: '1 day ago',
      likes: 45,
      comments: 18,
      icon: Sprout,
      color: 'text-secondary'
    },
    {
      id: '4',
      type: 'success',
      farmer: {
        name: 'Meera Singh',
        nameHi: 'मीरा सिंह',
        location: 'Haryana',
        locationHi: 'हरियाणा',
        avatar: 'MS'
      },
      content: 'Increased crop yield by 20% using CropCast weather insights',
      contentHi: 'CropCast मौसम अंतर्दृष्टि का उपयोग करके फसल उपज में 20% वृद्धि',
      metric: {
        value: '+20%',
        label: 'Yield Increase',
        labelHi: 'उपज वृद्धि'
      },
      timestamp: '2 days ago',
      likes: 67,
      comments: 23,
      icon: TrendingUp,
      color: 'text-sky'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-primary/10 text-primary border-primary/20';
      case 'achievement': return 'bg-warning/10 text-warning border-warning/20';
      case 'tip': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'success': return 'bg-sky/10 text-sky border-sky/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      prediction: { en: 'Prediction', hi: 'पूर्वानुमान' },
      achievement: { en: 'Achievement', hi: 'उपलब्धि' },
      tip: { en: 'Tip', hi: 'सुझाव' },
      success: { en: 'Success', hi: 'सफलता' }
    };
    return language === 'hi' ? labels[type]?.hi : labels[type]?.en;
  };

  return (
    <Card className="crop-card border-border/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {language === 'hi' ? 'समुदाय हाइलाइट्स' : 'Community Highlights'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'hi' ? 'आपके क्षेत्र के किसानों की सफलता की कहानियां' : 'Success stories from farmers in your area'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {communityData.slice(0, 3).map((item, index) => {
          const Icon = item.icon;
          const farmerName = language === 'hi' ? item.farmer.nameHi : item.farmer.name;
          const location = language === 'hi' ? item.farmer.locationHi : item.farmer.location;
          const content = language === 'hi' ? item.contentHi : item.content;
          const metricLabel = item.metric ? (language === 'hi' ? item.metric.labelHi : item.metric.label) : '';
          
          return (
            <div 
              key={item.id} 
              className={`bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 animate-slide-up cursor-pointer`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                    {item.farmer.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{farmerName}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{location}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 ${item.color}`} />
                    <p className="text-sm text-foreground flex-1">{content}</p>
                  </div>
                  
                  {item.metric && (
                    <div className="bg-background rounded-lg p-2 border border-border/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{metricLabel}</span>
                        <span className={`text-sm font-bold ${item.color}`}>{item.metric.value}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Eye className="w-3 h-3" />
                        <span>{item.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <MessageSquare className="w-3 h-3" />
                        <span>{item.comments}</span>
                      </button>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      {language === 'hi' ? 'और पढ़ें' : 'Read more'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium py-2 border-t border-border/20">
          {language === 'hi' ? 'सभी हाइलाइट्स देखें' : 'View All Highlights'}
        </button>
      </CardContent>
    </Card>
  );
};

export default CommunityHighlight;