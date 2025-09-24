import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Image, 
  Video, 
  Type, 
  BarChart3, 
  HelpCircle,
  Clock,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { ProductStory } from '../lib/stories';
import { UserAvatar } from './UserAvatar';
import { StoriesViewer } from './StoriesViewer';

interface StoriesGridProps {
  stories: ProductStory[];
  onStoryClick?: (story: ProductStory) => void;
  onSwipeUp?: (story: ProductStory) => void;
}

export function StoriesGrid({ stories, onStoryClick, onSwipeUp }: StoriesGridProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState(false);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setViewingStories(true);
    if (onStoryClick) {
      onStoryClick(stories[index]);
    }
  };

  const handleCloseViewer = () => {
    setViewingStories(false);
    setSelectedStoryIndex(null);
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

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune story disponible</h3>
        <p className="text-gray-600">Revenez plus tard pour voir de nouvelles stories</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStoryClick(index)}
            className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
          >
            {/* Image de couverture */}
            <div className="aspect-square relative">
              {story.thumbnail_url ? (
                <img
                  src={story.thumbnail_url}
                  alt={story.content}
                  className="w-full h-full object-cover"
                />
              ) : story.media_url ? (
                <img
                  src={story.media_url}
                  alt={story.content}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: story.background_color || '#000000' }}
                >
                  <span 
                    className="text-center p-4"
                    style={{ color: story.text_color || '#FFFFFF' }}
                  >
                    {story.content}
                  </span>
                </div>
              )}
              
              {/* Overlay avec informations */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-1 rounded-full ${getStoryTypeColor(story.type)}`}>
                      {getStoryIcon(story.type)}
                    </div>
                    <span className="text-xs font-medium">
                      {story.type === 'image' ? 'Image' :
                       story.type === 'video' ? 'Vidéo' :
                       story.type === 'text' ? 'Texte' :
                       story.type === 'poll' ? 'Sondage' :
                       story.type === 'quiz' ? 'Quiz' : 'Story'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{story.views_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{story.interactions_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeLeft(story.expires_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Badge de type */}
              <div className="absolute top-2 left-2">
                <div className={`p-1 rounded-full ${getStoryTypeColor(story.type)}`}>
                  {getStoryIcon(story.type)}
                </div>
              </div>
              
              {/* Badge de temps restant */}
              <div className="absolute top-2 right-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-white text-xs font-medium">
                    {formatTimeLeft(story.expires_at)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Informations du vendeur */}
            <div className="p-3">
              <div className="flex items-center space-x-2">
                <UserAvatar 
                  avatarUrl={story.seller?.avatar_url} 
                  username={story.seller?.username || ''} 
                  size="xs"
                  className="w-6 h-6"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      @{story.seller?.username}
                    </span>
                    {story.seller?.is_verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  {story.product && (
                    <p className="text-xs text-gray-600 truncate">
                      {story.product.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Viewer de stories */}
      {viewingStories && selectedStoryIndex !== null && (
        <StoriesViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
          onSwipeUp={handleSwipeUp}
        />
      )}
    </>
  );
}
