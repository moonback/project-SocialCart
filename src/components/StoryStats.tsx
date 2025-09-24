import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Eye, Heart, Share2, ShoppingBag, Clock, TrendingUp } from 'lucide-react';

interface StoryStats {
  total_stories: number;
  active_stories: number;
  total_views: number;
  total_likes: number;
  total_shares: number;
  total_product_clicks: number;
}

interface StoryStatsProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function StoryStats({ userId, isOwnProfile = false }: StoryStatsProps) {
  const [stats, setStats] = useState<StoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_user_story_stats', {
        user_uuid: userId
      });

      if (error) throw error;

      setStats(data?.[0] || null);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Statistiques des Stories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Statistiques des Stories</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Erreur lors du chargement des statistiques</p>
          <button
            onClick={loadStats}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Statistiques des Stories</h3>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune statistique disponible</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: Clock,
      label: 'Stories actives',
      value: stats.active_stories,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Eye,
      label: 'Vues totales',
      value: stats.total_views,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: Heart,
      label: 'Likes',
      value: stats.total_likes,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      icon: Share2,
      label: 'Partages',
      value: stats.total_shares,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      icon: ShoppingBag,
      label: 'Clics produit',
      value: stats.total_product_clicks,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      icon: TrendingUp,
      label: 'Engagement',
      value: Math.round((stats.total_likes + stats.total_shares + stats.total_product_clicks) / Math.max(stats.total_views, 1) * 100),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      suffix: '%'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Statistiques des Stories</h3>
        {isOwnProfile && (
          <button
            onClick={loadStats}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualiser"
          >
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`w-12 h-12 ${item.bgColor} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <div className={`text-2xl font-bold ${item.color} mb-1`}>
              {item.value.toLocaleString()}{item.suffix}
            </div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Résumé des performances */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Taux d'engagement moyen</span>
          <span className="font-semibold text-primary-600">
            {Math.round((stats.total_likes + stats.total_shares + stats.total_product_clicks) / Math.max(stats.total_views, 1) * 100)}%
          </span>
        </div>
        
        {stats.total_views > 0 && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Vues par story</span>
            <span className="font-semibold text-gray-900">
              {Math.round(stats.total_views / Math.max(stats.total_stories, 1))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
