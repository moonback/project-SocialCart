import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StoryService, ProductStory } from '../lib/stories';
import { supabase } from '../lib/supabase';
import { Clock, Eye, Trash2, Plus } from 'lucide-react';

interface UserStoriesProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function UserStories({ userId, isOwnProfile = false }: UserStoriesProps) {
  const [stories, setStories] = useState<ProductStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les stories de l'utilisateur
      const { data, error } = await supabase
        .from('product_stories')
        .select(`
          *,
          seller:users(username, avatar_url),
          product:products(name, primary_image_url, price)
        `)
        .eq('seller_id', userId)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedStories: ProductStory[] = (data || []).map(story => ({
        id: story.id,
        seller_id: story.seller_id,
        seller_username: story.seller.username,
        seller_avatar_url: story.seller.avatar_url,
        product_id: story.product_id,
        product_name: story.product.name,
        product_image_url: story.product.primary_image_url,
        product_price: story.product.price,
        media_url: story.media_url,
        media_type: story.media_type,
        caption: story.caption,
        expires_at: story.expires_at,
        views_count: story.views_count,
        created_at: story.created_at,
        is_viewed: false // Pas pertinent pour le profil
      }));

      setStories(formattedStories);
    } catch (err) {
      console.error('Erreur lors du chargement des stories:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (storyId: string) => {
    try {
      await StoryService.deleteStory(storyId);
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  useEffect(() => {
    loadUserStories();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stories</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Erreur lors du chargement des stories</p>
          <button
            onClick={loadUserStories}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stories</h3>
        {isOwnProfile && (
          <button className="flex items-center space-x-2 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Créer</span>
          </button>
        )}
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">Aucune story</p>
          <p className="text-sm">
            {isOwnProfile 
              ? 'Créez votre première story pour vos produits' 
              : 'Cet utilisateur n\'a pas encore créé de stories'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            >
              {/* Media */}
              {story.media_type === 'image' ? (
                <img
                  src={story.media_url}
                  alt={story.caption || story.product_name}
                  className="w-full h-full object-cover"
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
                {/* Top: Temps restant */}
                <div className="flex justify-end">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">
                      {StoryService.formatTimeRemaining(
                        StoryService.getTimeUntilExpiration(story)
                      )}
                    </span>
                  </div>
                </div>

                {/* Bottom: Statistiques et actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{story.views_count}</span>
                  </div>

                  {isOwnProfile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStory(story.id);
                      }}
                      className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Caption au survol */}
              {story.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm line-clamp-2">{story.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
