import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStories } from '../hooks/useStories';
import { StoryService, ProductStory } from '../lib/stories';
import { StoriesFeed } from './StoriesFeed';
import { Clock, Plus } from 'lucide-react';

interface StoriesBarProps {
  onCreateStory?: () => void;
}

export function StoriesBar({ onCreateStory }: StoriesBarProps) {
  const { stories, loading } = useStories();
  const [showStoriesFeed, setShowStoriesFeed] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Grouper les stories par vendeur
  const storiesBySeller = stories.reduce((acc, story) => {
    if (!acc[story.seller_id]) {
      acc[story.seller_id] = {
        seller: {
          id: story.seller_id,
          username: story.seller_username,
          avatar_url: story.seller_avatar_url
        },
        stories: []
      };
    }
    acc[story.seller_id].stories.push(story);
    return acc;
  }, {} as Record<string, {
    seller: { id: string; username: string; avatar_url?: string };
    stories: ProductStory[];
  }>);

  const handleStoryClick = (storyIndex: number) => {
    setSelectedStoryIndex(storyIndex);
    setShowStoriesFeed(true);
  };

  const handleCreateStory = () => {
    if (onCreateStory) {
      onCreateStory();
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="mt-2 w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="flex space-x-4 p-4 overflow-x-auto scrollbar-hide">
          {/* Bouton créer une story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateStory}
            className="flex-shrink-0 flex flex-col items-center space-y-2 group"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <Plus className="w-3 h-3 text-primary-600" />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">Créer</span>
          </motion.button>

          {/* Stories des utilisateurs suivis */}
          {Object.values(storiesBySeller).map(({ seller, stories: sellerStories }) => {
            const hasUnviewedStories = sellerStories.some(story => !story.is_viewed);
            const latestStory = sellerStories[0]; // Stories triées par date décroissante

            return (
              <motion.button
                key={seller.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStoryClick(
                  stories.findIndex(s => s.id === latestStory.id)
                )}
                className="flex-shrink-0 flex flex-col items-center space-y-2 group"
              >
                <div className="relative">
                  {/* Avatar avec bordure colorée si stories non vues */}
                  <div className={`w-16 h-16 rounded-full p-0.5 ${
                    hasUnviewedStories 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                      : 'bg-gray-200'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                      {seller.avatar_url ? (
                        <img
                          src={seller.avatar_url}
                          alt={seller.username}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {seller.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicateur de temps restant */}
                  {latestStory && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Clock className="w-3 h-3 text-primary-600" />
                    </div>
                  )}

                  {/* Badge nombre de stories */}
                  {sellerStories.length > 1 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {sellerStories.length}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-xs text-gray-600 font-medium block truncate max-w-16">
                    {seller.username}
                  </span>
                  {latestStory && (
                    <span className="text-xs text-gray-400">
                      {StoryService.formatTimeRemaining(
                        StoryService.getTimeUntilExpiration(latestStory)
                      )}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}

          {/* Message si aucune story */}
          {Object.keys(storiesBySeller).length === 0 && (
            <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-2 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs">Aucune story</span>
            </div>
          )}
        </div>
      </div>

      {/* Stories Feed Modal */}
      {showStoriesFeed && (
        <StoriesFeed
          onClose={() => setShowStoriesFeed(false)}
          initialStoryIndex={selectedStoryIndex}
        />
      )}
    </>
  );
}
