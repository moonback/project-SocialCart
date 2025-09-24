import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share, 
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { ProductStory } from '../lib/stories';
import { useStories } from '../hooks/useStories';
import { UserAvatar } from './UserAvatar';
import toast from 'react-hot-toast';

interface StoriesViewerProps {
  stories: ProductStory[];
  initialIndex?: number;
  onClose: () => void;
  onSwipeUp?: (story: ProductStory) => void;
}

export function StoriesViewer({ stories, initialIndex = 0, onClose, onSwipeUp }: StoriesViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { markAsViewed, voteInPoll, answerQuiz, swipeUp } = useStories();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const timeLeftIntervalRef = useRef<NodeJS.Timeout>();

  const currentStory = stories[currentStoryIndex];
  const currentSlide = currentStory?.type === 'image' ? currentStory : null;

  useEffect(() => {
    if (!currentStory) return;

    // Marquer comme vue
    markAsViewed(currentStory.id);

    // Calculer le temps restant
    const duration = currentStory.duration || 5;
    setTimeLeft(duration);
    setProgress(0);

    // Démarrer le timer
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (duration * 10));
          if (newProgress >= 100) {
            nextStory();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      timeLeftIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            nextStory();
            return duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timeLeftIntervalRef.current) clearInterval(timeLeftIntervalRef.current);
    };
  }, [currentStoryIndex, isPlaying, currentStory, markAsViewed]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleSwipeUp = () => {
    if (currentStory && onSwipeUp) {
      onSwipeUp(currentStory);
    }
    swipeUp(currentStory.id);
  };

  const handlePollVote = (option: string) => {
    voteInPoll(currentStory.id, option);
  };

  const handleQuizAnswer = (answer: string) => {
    answerQuiz(currentStory.id, answer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Aucune story disponible</h2>
          <p className="text-gray-400">Revenez plus tard pour voir de nouvelles stories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header avec informations du vendeur */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar 
              avatarUrl={currentStory.seller?.avatar_url} 
              username={currentStory.seller?.username || ''} 
              size="sm"
              className="w-10 h-10"
            />
            <div className="text-white">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">@{currentStory.seller?.username}</span>
                {currentStory.seller?.is_verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-300">
                {formatTime(timeLeft)} • {currentStoryIndex + 1}/{stories.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4 flex space-x-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${
                index < currentStoryIndex ? 'bg-white' :
                index === currentStoryIndex ? 'bg-white/50' : 'bg-white/20'
              }`}
            >
              {index === currentStoryIndex && (
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de la story */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStoryIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: currentStory.background_color || '#000000' }}
          >
            {currentStory.type === 'image' && (
              <img
                src={currentStory.media_url}
                alt={currentStory.content}
                className="w-full h-full object-cover"
              />
            )}
            
            {currentStory.type === 'video' && (
              <video
                src={currentStory.media_url}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                loop
                playsInline
              />
            )}
            
            {currentStory.type === 'text' && (
              <div className="text-center p-8 max-w-md">
                <h2 
                  className="font-bold mb-4"
                  style={{ 
                    color: currentStory.text_color || '#FFFFFF',
                    fontSize: currentStory.font_size === 'large' ? '2rem' : 
                             currentStory.font_size === 'small' ? '1rem' : '1.5rem'
                  }}
                >
                  {currentStory.content}
                </h2>
              </div>
            )}
            
            {currentStory.type === 'poll' && (
              <div className="text-center p-8 max-w-md">
                <h2 
                  className="font-bold mb-6"
                  style={{ color: currentStory.text_color || '#FFFFFF' }}
                >
                  {currentStory.content}
                </h2>
                <div className="space-y-3">
                  {currentStory.poll_options?.map((option, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePollVote(option)}
                      className="w-full p-4 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {currentStory.type === 'quiz' && (
              <div className="text-center p-8 max-w-md">
                <h2 
                  className="font-bold mb-6"
                  style={{ color: currentStory.text_color || '#FFFFFF' }}
                >
                  {currentStory.quiz_question}
                </h2>
                <div className="space-y-3">
                  {currentStory.quiz_options?.map((option, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-4 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay avec informations du produit */}
        {currentStory.product && (
          <div className="absolute bottom-20 left-4 right-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white"
            >
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={currentStory.product.image_url}
                  alt={currentStory.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{currentStory.product.name}</h3>
                  <p className="text-sm text-gray-300">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(currentStory.product.price)}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSwipeUp}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <ArrowUp className="w-5 h-5" />
                <span>Swipe up pour voir le produit</span>
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Actions en bas */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Heart className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Share className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Navigation par clic */}
      <div className="absolute inset-0 flex">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={prevStory}
        />
        <div 
          className="flex-1 cursor-pointer" 
          onClick={nextStory}
        />
      </div>

      {/* Navigation par clavier */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={prevStory}
          disabled={currentStoryIndex === 0}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextStory}
          disabled={currentStoryIndex === stories.length - 1}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
