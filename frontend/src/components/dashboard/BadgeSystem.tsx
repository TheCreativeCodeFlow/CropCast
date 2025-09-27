import React from 'react';
import { 
  Award, 
  Camera, 
  Cloud, 
  BarChart3, 
  TrendingUp, 
  Sprout,
  Star,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BadgeSystemProps {
  language: string;
}

interface BadgeData {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  progress: number;
  total: number;
  category: 'farming' | 'technology' | 'community' | 'expert';
  color: string;
  requirement: string;
  requirementHi: string;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ language }) => {
  const badges: BadgeData[] = [
    {
      id: 'first-prediction',
      name: 'Yield Predictor',
      nameHi: 'उपज भविष्यवक्ता',
      description: 'Made your first yield prediction',
      descriptionHi: 'पहला उपज पूर्वानुमान बनाया',
      icon: BarChart3,
      earned: true,
      progress: 1,
      total: 1,
      category: 'farming',
      color: 'text-primary',
      requirement: 'Complete 1 yield prediction',
      requirementHi: '1 उपज पूर्वानुमान पूरा करें'
    },
    {
      id: 'pest-detector',
      name: 'Pest Detective',
      nameHi: 'कीट जासूस',
      description: 'Uploaded crop images for pest detection',
      descriptionHi: 'कीट पहचान के लिए फसल तस्वीरें अपलोड की',
      icon: Camera,
      earned: true,
      progress: 3,
      total: 5,
      category: 'technology',
      color: 'text-warning',
      requirement: 'Upload 5 pest detection images',
      requirementHi: '5 कीट पहचान तस्वीरें अपलोड करें'
    },
    {
      id: 'weather-watcher',
      name: 'Weather Watcher',
      nameHi: 'मौसम निरीक्षक',
      description: 'Checked weather forecasts regularly',
      descriptionHi: 'नियमित रूप से मौसम पूर्वानुमान देखा',
      icon: Cloud,
      earned: false,
      progress: 8,
      total: 10,
      category: 'farming',
      color: 'text-sky',
      requirement: 'Check weather 10 times',
      requirementHi: '10 बार मौसम देखें'
    },
    {
      id: 'market-master',
      name: 'Market Master',
      nameHi: 'बाजार मास्टर',
      description: 'Expert at tracking market prices',
      descriptionHi: 'बाजार मूल्य ट्रैकिंग में विशेषज्ञ',
      icon: TrendingUp,
      earned: false,
      progress: 12,
      total: 20,
      category: 'expert',
      color: 'text-green-500',
      requirement: 'Check prices 20 times',
      requirementHi: '20 बार मूल्य देखें'
    },
    {
      id: 'soil-scientist',
      name: 'Soil Scientist',
      nameHi: 'मिट्टी वैज्ञानिक',
      description: 'Mastered soil health analysis',
      descriptionHi: 'मिट्टी स्वास्थ्य विश्लेषण में निपुण',
      icon: Sprout,
      earned: false,
      progress: 2,
      total: 3,
      category: 'farming',
      color: 'text-secondary',
      requirement: 'Complete 3 soil analyses',
      requirementHi: '3 मिट्टी विश्लेषण पूरे करें'
    },
    {
      id: 'community-helper',
      name: 'Community Helper',
      nameHi: 'समुदाय सहायक',
      description: 'Helped fellow farmers',
      descriptionHi: 'साथी किसानों की मदद की',
      icon: Star,
      earned: false,
      progress: 0,
      total: 5,
      category: 'community',
      color: 'text-purple-500',
      requirement: 'Help 5 farmers',
      requirementHi: '5 किसानों की मदद करें'
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;
  const completionRate = (earnedBadges.length / totalBadges) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'farming': return 'bg-primary/10 text-primary border-primary/20';
      case 'technology': return 'bg-warning/10 text-warning border-warning/20';
      case 'community': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'expert': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      farming: { en: 'Farming', hi: 'कृषि' },
      technology: { en: 'Technology', hi: 'तकनीक' },
      community: { en: 'Community', hi: 'समुदाय' },
      expert: { en: 'Expert', hi: 'विशेषज्ञ' }
    };
    return language === 'hi' ? labels[category]?.hi : labels[category]?.en;
  };

  return (
    <Card className="crop-card border-border/20 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            {language === 'hi' ? 'उपलब्धि बैज' : 'Achievement Badges'}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {earnedBadges.length}/{totalBadges}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span className="font-semibold">{completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recently Earned */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">
            {language === 'hi' ? 'हाल में अर्जित' : 'Recently Earned'}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {earnedBadges.slice(0, 3).map((badge) => {
              const Icon = badge.icon;
              const name = language === 'hi' ? badge.nameHi : badge.name;
              
              return (
                <div
                  key={badge.id}
                  className="flex-shrink-0 bg-gradient-primary rounded-lg p-3 text-primary-foreground shadow-glow-primary animate-pulse"
                >
                  <Icon className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs font-medium text-center whitespace-nowrap">
                    {name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* In Progress */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">
            {language === 'hi' ? 'प्रगति में' : 'In Progress'}
          </h4>
          <div className="space-y-3">
            {badges.filter(badge => !badge.earned && badge.progress > 0).slice(0, 3).map((badge) => {
              const Icon = badge.icon;
              const name = language === 'hi' ? badge.nameHi : badge.name;
              const requirement = language === 'hi' ? badge.requirementHi : badge.requirement;
              const progressPercent = (badge.progress / badge.total) * 100;
              
              return (
                <div key={badge.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm truncate">{name}</h5>
                        <Badge variant="outline" className={getCategoryColor(badge.category)}>
                          {getCategoryLabel(badge.category)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{requirement}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {badge.progress}/{badge.total}
                      </span>
                      <span className="font-semibold">{progressPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium py-2 border-t border-border/20">
          {language === 'hi' ? 'सभी बैज देखें' : 'View All Badges'}
        </button>
      </CardContent>
    </Card>
  );
};

export default BadgeSystem;