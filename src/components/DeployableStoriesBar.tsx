import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStories } from '../hooks/useStories';
import { StoryService, ProductStory } from '../lib/stories';
import { StoriesFeed } from './StoriesFeed';
import { Clock, Plus, X } from 'lucide-react';

interface DeployableStoriesBarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStory?: () => void;
  refreshTrigger?: number; // Pour déclencher un refresh des stories
}

export function DeployableStoriesBar({ isOpen, onClose, onCreateStory, refreshTrigger }: DeployableStoriesBarProps) {
  const { stories, loading, refreshStories } = useStories();
  const [showStoriesFeed, setShowStoriesFeed] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Grouper les stories par vendeur avec déduplication
  const storiesBySeller = stories.reduce((acc, story) => {
    const sellerKey = story.seller_id || `unknown-${story.seller_username || 'user'}`;
    
    if (!acc[sellerKey]) {
      acc[sellerKey] = {
        seller: {
          id: story.seller_id || `unknown-${story.seller_username || 'user'}`,
          username: story.seller_username || 'Utilisateur inconnu',
          avatar_url: story.seller_avatar_url
        },
        stories: []
      };
    }
    
    // Éviter les doublons de stories
    const existingStory = acc[sellerKey].stories.find(s => s.id === story.id);
    if (!existingStory) {
      acc[sellerKey].stories.push(story);
    }
    
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

  // Rafraîchir les stories quand refreshTrigger change
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refreshStories();
    }
  }, [refreshTrigger, refreshStories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40"
        >
          {/* Header avec bouton fermer */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Stories</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </motion.button>
          </div>

          {/* Contenu des stories */}
          <div className="p-4">
            {loading ? (
              <div className="flex space-x-4 overflow-x-auto">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="mt-2 w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
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
                {Object.entries(storiesBySeller).map(([sellerKey, { seller, stories: sellerStories }]) => {
                  const hasUnviewedStories = sellerStories.some(story => !story.is_viewed);
                  const viewedStoriesCount = sellerStories.filter(story => story.is_viewed).length;
                  const totalStoriesCount = sellerStories.length;
                  const latestStory = sellerStories[0]; // Stories triées par date décroissante

                  return (
                    <motion.button
                      key={sellerKey}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStoryClick(
                        stories.findIndex(s => s.id === latestStory.id)
                      )}
                      className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                    >
                      <div className="relative">
                        {/* Avatar avec bordure colorée si stories non vues */}
                        <motion.div 
                          className={`w-16 h-16 rounded-full p-0.5 transition-all duration-300 ${
                            hasUnviewedStories 
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg' 
                              : 'bg-gray-300 shadow-sm'
                          }`}
                          animate={hasUnviewedStories ? { 
                            scale: [1, 1.05, 1],
                            boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.5)', '0 0 0 8px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                          } : {}}
                          transition={{ 
                            duration: 3, 
                            repeat: hasUnviewedStories ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                            {seller.avatar_url ? (
                              <img
                                src={seller.avatar_url}
                                alt={seller.username}
                                className={`w-full h-full object-cover rounded-full transition-all duration-300 ${
                                  hasUnviewedStories ? 'brightness-100' : 'brightness-75'
                                }`}
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                                hasUnviewedStories ? 'brightness-100' : 'brightness-75'
                              }`}>
                                {seller.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Indicateur de temps restant */}
                        {latestStory && (
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                            hasUnviewedStories 
                              ? 'bg-white' 
                              : 'bg-gray-200'
                          }`}>
                            <Clock className={`w-3 h-3 transition-colors duration-300 ${
                              hasUnviewedStories 
                                ? 'text-primary-600' 
                                : 'text-gray-500'
                            }`} />
                          </div>
                        )}

                        {/* Badge nombre de stories avec état de visualisation */}
                        {totalStoriesCount > 1 && (
                          <motion.div 
                            className={`absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                              hasUnviewedStories 
                                ? 'bg-red-500' 
                                : 'bg-gray-400'
                            }`}
                            animate={hasUnviewedStories ? { 
                              scale: [1, 1.2, 1],
                              boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                            } : {}}
                            transition={{ 
                              duration: 2, 
                              repeat: hasUnviewedStories ? Infinity : 0,
                              ease: "easeInOut"
                            }}
                          >
                            {totalStoriesCount}
                          </motion.div>
                        )}

                        {/* Indicateur de progression des stories vues */}
                        {totalStoriesCount > 1 && (
                          <div className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-500 ease-out"
                              style={{ 
                                width: `${(viewedStoriesCount / totalStoriesCount) * 100}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <span className={`text-xs font-medium block truncate max-w-16 transition-colors duration-300 ${
                          hasUnviewedStories 
                            ? 'text-gray-800' 
                            : 'text-gray-500'
                        }`}>
                          {seller.username}
                        </span>
                        {latestStory && (
                          <span className={`text-xs transition-colors duration-300 ${
                            hasUnviewedStories 
                              ? 'text-gray-500' 
                              : 'text-gray-400'
                          }`}>
                            {StoryService.formatTimeRemaining(
                              StoryService.getTimeUntilExpiration(latestStory)
                            )}
                          </span>
                        )}
                        <span className={`text-xs font-medium mt-1 block transition-colors duration-300 ${
                          hasUnviewedStories 
                            ? 'text-primary-600' 
                            : 'text-gray-400'
                        }`}>
                          {hasUnviewedStories ? 'Nouveau' : 'Vu'}
                        </span>
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
            )}
          </div>
        </motion.div>
      )}

      {/* Stories Feed Modal */}
      {showStoriesFeed && (
        <StoriesFeed
          onClose={() => setShowStoriesFeed(false)}
          initialStoryIndex={selectedStoryIndex}
        />
      )}
    </AnimatePresence>
  );
}
