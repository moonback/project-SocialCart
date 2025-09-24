import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Plus, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  Image,
  Video,
  Type,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { ProductStory } from '../lib/stories';
import { useStories } from '../hooks/useStories';
import { StoryCreator } from './StoryCreator';
import { StoriesViewer } from './StoriesViewer';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../hooks/useAuth';

interface ProductStoriesProps {
  productId: string;
  sellerId: string;
  onSwipeUp?: (story: ProductStory) => void;
}

export function ProductStories({ productId, sellerId, onSwipeUp }: ProductStoriesProps) {
  const { user } = useAuth();
  const { stories, loadProductStories } = useStories();
  const [showCreator, setShowCreator] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  useEffect(() => {
    loadProductStories(productId);
  }, [productId, loadProductStories]);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowViewer(true);
  };

  const handleStoryCreated = (story: ProductStory) => {
    setShowCreator(false);
    loadProductStories(productId);
  };

  const handleSwipeUp = (story: ProductStory) => {
    if (onSwipeUp) {
      onSwipeUp(story);
    }
  };

  const getStoryIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'poll':
        return <BarChart3 className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStoryTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-500';
      case 'video':
        return 'bg-red-500';
      case 'text':
        return 'bg-green-500';
      case 'poll':
        return 'bg-purple-500';
      case 'quiz':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const isOwner = user?.id === sellerId;

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isOwner ? 'Aucune story pour ce produit' : 'Aucune story disponible'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isOwner 
              ? 'Créez votre première story pour promouvoir ce produit !'
              : 'Revenez plus tard pour voir de nouvelles stories'
            }
          </p>
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreator(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Créer une Story
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Stories du Produit</h3>
            <p className="text-sm text-gray-600">{stories.length} story{stories.length > 1 ? 's' : ''} disponible{stories.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {isOwner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreator(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle</span>
          </motion.button>
        )}
      </div>

      {/* Liste des stories */}
      <div className="space-y-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStoryClick(index)}
            className="relative bg-gray-50 rounded-xl p-4 cursor-pointer group hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {/* Miniature */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {story.thumbnail_url ? (
                  <img
                    src={story.thumbnail_url}
                    alt={story.content}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: story.background_color || '#000000' }}
                  >
                    <span 
                      className="text-white text-xs text-center p-1"
                      style={{ color: story.text_color || '#FFFFFF' }}
                    >
                      {story.content.substring(0, 20)}...
                    </span>
                  </div>
                )}
                
                {/* Badge de type */}
                <div className="absolute -top-1 -right-1">
                  <div className={`w-5 h-5 ${getStoryTypeColor(story.type)} rounded-full flex items-center justify-center`}>
                    {getStoryIcon(story.type)}
                  </div>
                </div>
              </div>
              
              {/* Informations */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {story.type === 'image' ? 'Image' :
                     story.type === 'video' ? 'Vidéo' :
                     story.type === 'text' ? 'Texte' :
                     story.type === 'poll' ? 'Sondage' :
                     story.type === 'quiz' ? 'Quiz' : 'Story'}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeLeft(story.expires_at)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-2">
                  {story.content}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{story.views_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{story.interactions_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{story.duration}s</span>
                  </div>
                </div>
              </div>
              
              {/* Bouton play */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Créateur de stories */}
      {showCreator && (
        <StoryCreator
          productId={productId}
          onClose={() => setShowCreator(false)}
          onStoryCreated={handleStoryCreated}
        />
      )}

      {/* Viewer de stories */}
      {showViewer && (
        <StoriesViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setShowViewer(false)}
          onSwipeUp={handleSwipeUp}
        />
      )}
    </div>
  );
}
