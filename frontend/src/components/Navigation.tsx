import React from 'react';
import { 
  Home, 
  BarChart3, 
  Cloud, 
  Sprout, 
  Bug, 
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  language: string;
}

const Navigation: React.FC<NavigationProps> = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'dashboard',
      path: '/',
      icon: Home,
      label: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      labelPa: 'ਡੈਸ਼ਬੋਰਡ',
      color: 'text-primary'
    },
    {
      id: 'yield',
      path: '/yield-prediction',
      icon: BarChart3,
      label: 'Yield',
      labelHi: 'उपज',
      labelPa: 'ਪੈਦਾਵਾਰ',
      color: 'text-primary'
    },
    {
      id: 'weather',
      path: '/weather',
      icon: Cloud,
      label: 'Weather',
      labelHi: 'मौसम',
      labelPa: 'ਮੌਸਮ',
      color: 'text-sky'
    },
    {
      id: 'soil',
      path: '/soil-guide',
      icon: Sprout,
      label: 'Soil',
      labelHi: 'मिट्टी',
      labelPa: 'ਮਿੱਟੀ',
      color: 'text-secondary'
    },
    {
      id: 'pest',
      path: '/pest-detection',
      icon: Bug,
      label: 'Pests',
      labelHi: 'कीट',
      labelPa: 'ਕੀੜੇ',
      color: 'text-warning'
    },
    {
      id: 'market',
      path: '/market-prices',
      icon: TrendingUp,
      label: 'Market',
      labelHi: 'बाजार',
      labelPa: 'ਬਾਜ਼ਾਰ',
      color: 'text-green-500'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border/20 rounded-t-2xl">
      <div className="grid grid-cols-6 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const label = language === 'hi' ? item.labelHi : language === 'pa' ? item.labelPa : item.label;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 hover:bg-muted/50 relative group",
                isActive && "bg-primary/10"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-full animate-scale-in" />
              )}
              
              <div className={cn(
                "transition-all duration-300 group-hover:scale-110",
                isActive ? item.color : "text-muted-foreground"
              )}>
                <Icon className="w-5 h-5 mb-1" />
              </div>
              
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isActive ? item.color : "text-muted-foreground"
              )}>
                {label}
              </span>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>

      {/* PWA indicator */}
      <div className="absolute top-2 right-4">
        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20 animate-pulse-slow">
          {language === 'hi' ? 'ऑफलाइन उपलब्ध' : 
           language === 'pa' ? 'ਆਫਲਾਈਨ ਉਪਲਬਧ' : 
           'Available Offline'}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;