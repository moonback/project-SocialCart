import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStories } from '../hooks/useStories';
import { StoryService, ProductStory } from '../lib/stories';
import { Heart, Share2, ShoppingBag, X, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoriesFeedProps {
  onClose: () => void;
  initialStoryIndex?: number;
}

export function StoriesFeed({ onClose, initialStoryIndex = 0 }: StoriesFeedProps) {
  const { stories, markStoryAsViewed, createStoryInteraction, deleteStory } = useStories();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStory = stories[currentStoryIndex];

  // Gestion du progrès automatique
  useEffect(() => {
    if (!currentStory || !isPlaying) return;

    const startTime = Date.now();
    const duration = StoryService.getTimeUntilExpiration(currentStory);
    
    if (duration <= 0) {
      // Story expirée, passer à la suivante
      nextStory();
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextStory();
      }
    }, 100);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStoryIndex, isPlaying, currentStory]);

  // Marquer la story comme vue
  useEffect(() => {
    if (currentStory && !currentStory.is_viewed) {
      markStoryAsViewed(currentStory.id);
    }
  }, [currentStory, markStoryAsViewed]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentMediaIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentMediaIndex(0);
      setProgress(0);
    }
  };

  const handleLike = async () => {
    if (!currentStory) return;
    
    const isLiked = likedStories.has(currentStory.id);
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(currentStory.id);
      } else {
        newSet.add(currentStory.id);
      }
      return newSet;
    });

    try {
      await createStoryInteraction(currentStory.id, 'like');
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleShare = async () => {
    if (!currentStory) return;
    
    try {
      await createStoryInteraction(currentStory.id, 'share');
      
      // Partager le lien du produit
      if (navigator.share) {
        await navigator.share({
          title: currentStory.product_name,
          text: currentStory.caption || `Découvrez ${currentStory.product_name}`,
          url: `${window.location.origin}/product/${currentStory.product_id}`
        });
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(
          `${window.location.origin}/product/${currentStory.product_id}`
        );
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleProductClick = async () => {
    if (!currentStory) return;
    
    try {
      await createStoryInteraction(currentStory.id, 'product_click');
      setShowProductDetails(true);
    } catch (error) {
      console.error('Erreur lors du clic produit:', error);
    }
  };

  const handleDeleteStory = async () => {
    if (!currentStory) return;
    
    try {
      await deleteStory(currentStory.id);
      if (currentStoryIndex >= stories.length - 1) {
        prevStory();
      } else {
        nextStory();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="text-white text-center">
          <p>Aucune story disponible</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-white/20 rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const timeRemaining = StoryService.getTimeUntilExpiration(currentStory);
  const isLiked = likedStories.has(currentStory.id);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Barre de progression */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header avec informations du vendeur */}
      <div className="absolute top-16 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
            {currentStory.seller_avatar_url ? (
              <img 
                src={currentStory.seller_avatar_url} 
                alt={currentStory.seller_username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {currentStory.seller_username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{currentStory.seller_username}</p>
            <div className="flex items-center space-x-2 text-white/70 text-xs">
              <Clock className="w-3 h-3" />
              <span>{StoryService.formatTimeRemaining(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Navigation gauche/droite */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Media */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentStory.media_type === 'image' ? (
            <img
              src={currentStory.media_url}
              alt={currentStory.caption || currentStory.product_name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.media_url}
              className="max-w-full max-h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg p-3">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {/* Actions en bas */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-3">
        <button
          onClick={handleLike}
          className={`p-3 rounded-full transition-colors ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleShare}
          className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleProductClick}
          className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

      {/* Statistiques */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-4 text-white text-sm">
        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <Eye className="w-4 h-4" />
          <span>{currentStory.views_count}</span>
        </div>
      </div>

      {/* Modal des détails du produit */}
      <AnimatePresence>
        {showProductDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowProductDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Détails du produit</h3>
                <button
                  onClick={() => setShowProductDetails(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {currentStory.product_image_url ? (
                    <img
                      src={currentStory.product_image_url}
                      alt={currentStory.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Aucune image
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-lg">{currentStory.product_name}</h4>
                  <p className="text-2xl font-bold text-primary-600">
                    {currentStory.product_price.toFixed(2)} €
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowProductDetails(false);
                      // Rediriger vers la page du produit
                      window.location.href = `/product/${currentStory.product_id}`;
                    }}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Voir le produit
                  </button>
                  <button
                    onClick={() => setShowProductDetails(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
