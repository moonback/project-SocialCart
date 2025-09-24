import React from 'react';
import { Star } from 'lucide-react';

interface LoyaltyPointsProps {
  points: number | undefined;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoyaltyPoints({ 
  points = 0, 
  showIcon = true, 
  size = 'sm',
  className = '' 
}: LoyaltyPointsProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 font-medium ${sizeClasses[size]} ${className}`}>
      {showIcon && <Star className={iconSizes[size]} />}
      <span>{points} pts</span>
    </div>
  );
}
