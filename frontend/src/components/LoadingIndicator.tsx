import React from 'react';
import { Leaf, Sprout, Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  type?: 'leaf' | 'soil' | 'default';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  type = 'leaf', 
  size = 'md',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const containerSizeClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  const renderIcon = () => {
    const iconClass = `${sizeClasses[size]} text-primary`;
    
    switch (type) {
      case 'leaf':
        return <Leaf className={`${iconClass} loading-leaf`} />;
      case 'soil':
        return <Sprout className={`${iconClass} loading-soil`} />;
      default:
        return <Loader2 className={`${iconClass} animate-spin`} />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${containerSizeClasses[size]}`}>
      {renderIcon()}
      {text && (
        <span className="text-muted-foreground font-medium animate-pulse-slow">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingIndicator;