import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { StoryService, ProductStory } from '../lib/stories';
import { TrendingUp, Eye, Heart, Share2, Clock } from 'lucide-react';

interface PopularStory {
  story_id: string;
  seller_id: string;
  seller_username: string;
  seller_avatar_url?: string;
  product_id: string;
  product_name: string;
  product_image_url?: string;
  product_price: number;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  views_count: number;
  likes_count: number;
  shares_count: number;
  created_at: string;
}

interface PopularStoriesProps {
  limit?: number;
  showHeader?: boolean;
}

export function PopularStories({ limit = 10, showHeader = true }: PopularStoriesProps) {
  const [stories, setStories] = useState<PopularStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPopularStories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_popular_stories', {
        limit_count: limit
      });

      if (error) throw error;

      setStories(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des stories populaires:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularStories();
  }, [limit]);

  const calculateEngagementScore = (story: PopularStory) => {
    return story.views_count + (story.likes_count * 2) + (story.shares_count * 3);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Stories populaires</h3>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="aspect-video bg-gray-200 rounded-lg mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Stories populaires</h3>
          </div>
        )}
        <div className="text-center py-8 text-gray-500">
          <p>Erreur lors du chargement des stories populaires</p>
          <button
            onClick={loadPopularStories}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Stories populaires</h3>
          </div>
        )}
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune story populaire pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Stories populaires</h3>
          </div>
          <button
            onClick={loadPopularStories}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Actualiser
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.story_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Media */}
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              {story.media_type === 'image' ? (
                <img
                  src={story.media_url}
                  alt={story.caption || story.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video
                  src={story.media_url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              )}

              {/* Overlay avec informations */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex flex-col justify-between p-3">
                {/* Top: Score d'engagement */}
                <div className="flex justify-end">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">
                      {calculateEngagementScore(story)}
                    </span>
                  </div>
                </div>

                {/* Bottom: Statistiques */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Eye className="w-3 h-3 text-white" />
                      <span className="text-white text-xs">{story.views_count}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Heart className="w-3 h-3 text-white" />
                      <span className="text-white text-xs">{story.likes_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Share2 className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{story.shares_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-4">
              {/* Informations du vendeur */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {story.seller_avatar_url ? (
                    <img
                      src={story.seller_avatar_url}
                      alt={story.seller_username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                      {story.seller_username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{story.seller_username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(story.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Informations du produit */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 line-clamp-1">{story.product_name}</h4>
                <p className="text-lg font-bold text-primary-600">{story.product_price.toFixed(2)} €</p>
                
                {story.caption && (
                  <p className="text-sm text-gray-600 line-clamp-2">{story.caption}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{story.views_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{story.likes_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4" />
                    <span>{story.shares_count}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Rediriger vers la page du produit
                    window.location.href = `/product/${story.product_id}`;
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Voir le produit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
