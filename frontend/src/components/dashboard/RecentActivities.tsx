import React from 'react';
import { 
  BarChart3, 
  Bug, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentActivitiesProps {
  language: string;
}

interface Activity {
  id: string;
  type: 'prediction' | 'detection' | 'price-check' | 'ai-query';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  date: string;
  time: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  icon: React.ComponentType<any>;
  color: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ language }) => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Yield Prediction for Wheat',
      titleHi: 'गेहूं के लिए उपज पूर्वानुमान',
      description: 'Predicted 85% yield confidence for 5 acres',
      descriptionHi: '5 एकड़ के लिए 85% उपज विश्वास का पूर्वानुमान',
      date: 'Sept 25',
      time: '2:30 PM',
      status: 'completed',
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      id: '2',
      type: 'detection',
      title: 'Pest Detection',
      titleHi: 'कीट पहचान',
      description: 'Detected Aphids on tomato leaves',
      descriptionHi: 'टमाटर के पत्तों पर एफिड्स का पता लगाया',
      date: 'Sept 24',
      time: '4:15 PM',
      status: 'completed',
      icon: Bug,
      color: 'text-warning'
    },
    {
      id: '3',
      type: 'price-check',
      title: 'Market Price Check',
      titleHi: 'बाजार मूल्य जांच',
      description: 'Checked rice prices - ₹3,200/quintal',
      descriptionHi: 'चावल की कीमतें जांची - ₹3,200/क्विंटल',
      date: 'Sept 23',
      time: '11:45 AM',
      status: 'completed',
      icon: TrendingUp,
      color: 'text-sky'
    },
    {
      id: '4',
      type: 'ai-query',
      title: 'AI Assistant Query',
      titleHi: 'AI सहायक प्रश्न',
      description: 'Asked about fertilizer recommendations',
      descriptionHi: 'उर्वरक सिफारिशों के बारे में पूछा',
      date: 'Sept 22',
      time: '9:20 AM',
      status: 'completed',
      icon: MessageCircle,
      color: 'text-secondary'
    },
    {
      id: '5',
      type: 'prediction',
      title: 'Soil Analysis Scheduled',
      titleHi: 'मिट्टी विश्लेषण निर्धारित',
      description: 'Scheduled for tomorrow morning',
      descriptionHi: 'कल सुबह के लिए निर्धारित',
      date: 'Sept 26',
      time: '8:00 AM',
      status: 'scheduled',
      icon: Calendar,
      color: 'text-muted-foreground'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-primary" />;
      case 'in-progress':
        return <Clock className="w-3 h-3 text-warning" />;
      case 'scheduled':
        return <Calendar className="w-3 h-3 text-sky" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusText = {
      completed: language === 'hi' ? 'पूर्ण' : 'Completed',
      'in-progress': language === 'hi' ? 'प्रगति में' : 'In Progress',
      scheduled: language === 'hi' ? 'निर्धारित' : 'Scheduled'
    };

    const statusVariant = {
      completed: 'default',
      'in-progress': 'secondary',
      scheduled: 'outline'
    };

    return (
      <Badge variant={statusVariant[status] as any} className="text-xs">
        {getStatusIcon(status)}
        <span className="ml-1">{statusText[status]}</span>
      </Badge>
    );
  };

  return (
    <Card className="crop-card border-border/20 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {language === 'hi' ? 'हाल की गतिविधियां' : 'Recent Activities'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === 'hi' ? 'आपकी कृषि गतिविधियों का लॉग' : 'Your farming activities log'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const title = language === 'hi' ? activity.titleHi : activity.title;
            const description = language === 'hi' ? activity.descriptionHi : activity.description;

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-soft`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate pr-2">{title}</h4>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.date}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/20">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            {language === 'hi' ? 'सभी गतिविधियां देखें' : 'View All Activities'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;