import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Users, TrendingUp, Clock } from 'lucide-react';

interface StatsPanelProps {
  product: {
    id: string;
    name: string;
    likes_count: number;
    views_count?: number;
    sales_count?: number;
    created_at: string;
  };
  isLiked: boolean;
  viewersCount?: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  product,
  isLiked,
  viewersCount = 0,
}) => {
  const timeAgo = React.useMemo(() => {
    const now = new Date();
    const created = new Date(product.created_at);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Il y a ${diffInWeeks}sem`;
  }, [product.created_at]);

  const stats = [
    {
      icon: Heart,
      value: product.likes_count + (isLiked ? 1 : 0),
      label: 'Likes',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      trend: '+12%'
    },
    {
      icon: Eye,
      value: product.views_count || 0,
      label: 'Vues',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: '+8%'
    },
    {
      icon: ShoppingCart,
      value: product.sales_count || 0,
      label: 'Ventes',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      trend: '+25%'
    },
    {
      icon: Users,
      value: viewersCount,
      label: 'En ligne',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      trend: 'Live'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Statistiques en temps réel</h3>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-3 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              {stat.trend && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  stat.trend === 'Live' 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {stat.trend === 'Live' ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>{stat.trend}</span>
                    </div>
                  )}
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatNumber(stat.value)}
            </div>
            <div className="text-xs text-gray-600">
              {stat.label}
            </div>
            
            {/* Animation de fond pour les stats en temps réel */}
            {stat.label === 'En ligne' && viewersCount > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-transparent"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Graphique simplifié des tendances */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Activité des 7 derniers jours</span>
          <span className="text-green-600 font-medium">↗ +15%</span>
        </div>
        <div className="flex items-end space-x-1 h-8">
          {[3, 7, 4, 8, 6, 9, 5].map((height, index) => (
            <motion.div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: `${height * 10}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
