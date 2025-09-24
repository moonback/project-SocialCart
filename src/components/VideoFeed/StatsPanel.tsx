import React from 'react';
import { Heart } from 'lucide-react';

interface StatsPanelProps {
  product: {
    id: string;
    name: string;
    likes_count: number;
  };
  isLiked: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  product,
  isLiked,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">Statistiques</h3>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          <span className="text-lg font-bold text-gray-900">
            {product.likes_count}
          </span>
          <span className="text-sm text-gray-600">Likes</span>
        </div>
      </div>
    </div>
  );
};
