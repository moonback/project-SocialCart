import React from 'react';

interface LoyaltyBadgeProps {
  points: number | undefined;
}

export function LoyaltyBadge({ points = 0 }: LoyaltyBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">
      <span>⭐</span>
      <span>{points} pts</span>
    </div>
  );
}


