import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  ShoppingCart, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Bookmark,
  Flag,
  MoreVertical,
  UserPlus,
  Maximize,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';
import { Product as ProductFromProducts, ProductVariant } from '../lib/products';
import { Product as ProductFromSupabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useSocial } from '../hooks/useSocial';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface VideoFeedProduct extends ProductFromProducts {
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  user_id: string;
  variants?: ProductVariant[];
}

interface VideoFeedProps {
  products: VideoFeedProduct[];
}

export function VideoFeed({ products }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();
  const { 
    toggleLike, 
    toggleBookmark, 
    toggleFollow, 
    recordView,
    isLiked, 
    isBookmarked, 
    isFollowing 
  } = useSocial();
  const navigate = useNavigate();

  // Variable pour le produit actuel
  const currentProduct = products[currentIndex];

  // Charger le paramètre autoPlay depuis le localStorage
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('video-autoplay');
    if (savedAutoPlay !== null) {
      setAutoPlay(savedAutoPlay === 'true');
    }
  }, []);

  // Fermer le menu d'actions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionsMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.actions-menu-container')) {
          setShowActionsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu]);


  // Fonction mémorisée pour enregistrer une vue
  const handleRecordView = useCallback((productId: string) => {
    recordView(productId);
  }, [recordView]);

  // Logique de lecture centralisée - s'exécute à chaque changement de currentIndex
  useEffect(() => {
    if (!currentProduct) return;

    // Enregistrer une vue (dans un setTimeout pour éviter les setState pendant le rendu)
    setTimeout(() => {
      handleRecordView(currentProduct.id);
    }, 0);

    // Mettre en pause toutes les vidéos
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.pause();
      }
    });

    // Lancer la lecture de la vidéo actuelle si autoPlay est activé
    if (autoPlay && currentProduct.video_url) {
      const currentVideo = videoRefs.current[currentProduct.id];
      if (currentVideo && currentVideo.paused) {
        currentVideo.play().catch((error) => {
          // Ignorer les erreurs d'interruption de lecture
          if (error.name !== 'AbortError') {
            console.error('Erreur de lecture vidéo:', error);
          }
        });
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, currentProduct, autoPlay, handleRecordView]);

 

  const handleReport = () => {
    toast.success('Signalement envoyé');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
    
    // Appliquer la vitesse à toutes les vidéos
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.playbackRate = speeds[nextIndex];
      }
    });
    
    toast.success(`Vitesse: ${speeds[nextIndex]}x`);
  };


  const handleScroll = useCallback(() => {
    // Throttling pour éviter les re-renders excessifs
    if (throttleTimeoutRef.current) {
      return;
    }

    throttleTimeoutRef.current = setTimeout(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const itemHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setCurrentIndex(newIndex);
      }
      throttleTimeoutRef.current = null;
    }, 200); // Throttle de 200ms
  }, []);

  const togglePlayPause = () => {
    if (!currentProduct) return;
    const video = videoRefs.current[currentProduct.id];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (!currentProduct) return;
    const video = videoRefs.current[currentProduct.id];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleBuyNow = (product: VideoFeedProduct) => {
    const productForCart: ProductFromSupabase = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      video_url: product.video_url,
      image_url: product.image_url,
      images: product.images,
      variants: product.variants || [],
      user_id: product.user_id,
      user: {
        id: product.user_id,
        email: '',
        username: product.user.username,
        loyalty_points: 0,
        is_seller: false,
        is_verified: false,
        created_at: '',
        updated_at: '',
        avatar_url: product.user.avatar_url
      },
      likes_count: 0,
      created_at: ''
    };
    addToCart(productForCart);
    navigate('/cart');
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        // Cleanup du throttling
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide video-feed"
      onScroll={handleScroll}
    >
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          className="h-screen snap-start relative flex items-center justify-center bg-black group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={() => setShowControls(true)}
          onTouchEnd={() => {
            setTimeout(() => {
              setShowControls(false);
            }, 3000);
          }}
        >
          {/* Video/Image Container */}
          <div className="w-full h-full relative overflow-hidden">
            {product.video_url ? (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => (videoRefs.current[product.id] = el)}
                  src={product.video_url}
                  className="w-full h-full object-cover"
                  autoPlay={autoPlay && index === currentIndex}
                  muted={isMuted}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Compact Video Controls Overlay */}
                <AnimatePresence>
                  {(showControls || !autoPlay) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto z-20"
                    >
                      {/* Compact Play/Pause Button */}
                      <div className="flex flex-col items-center space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={togglePlayPause}
                          className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl pointer-events-auto z-30"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </motion.button>
                        
                        {/* Compact Secondary Controls */}
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMute}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto z-30"
                          >
                            {isMuted ? (
                              <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-white" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={changePlaybackSpeed}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xs pointer-events-auto z-30"
                          >
                            {playbackSpeed}x
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            ) : (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            
            {/* Enhanced gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Right sidebar with actions - Compact Design */}
          <div className="absolute right-1 bottom-48 flex flex-col space-y-1.5 z-30 pb-4 pointer-events-auto actions-menu-container"> {/* Augmenté pour éviter le bottom nav */}
            
            {/* Like Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleLike(product.id)}
              className="flex flex-col items-center space-y-1 pointer-events-auto z-40"
            >
              <motion.div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isLiked(product.id) 
                    ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={isLiked(product.id) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-300 ${
                    isLiked(product.id) 
                      ? 'text-white fill-white' 
                      : 'text-white hover:text-red-300'
                  }`} 
                />
              </motion.div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded-full">
                {product.likes_count + (isLiked(product.id) ? 1 : 0)}
              </span>
            </motion.button>

            {/* Menu Button - Opens actions menu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="flex flex-col items-center space-y-1 pointer-events-auto z-40"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <MoreVertical className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded-full">
                Plus
              </span>
            </motion.button>

            {/* Actions Menu - Modal centrée à l'écran */}
            <AnimatePresence>
              {showActionsMenu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                   className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]"
                  onClick={() => setShowActionsMenu(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                     className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 relative z-[100000] border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header */}
                      <div className="text-center pb-2">
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">Actions</h3>
                        <p className="text-sm text-white/80">Que souhaitez-vous faire ?</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        {/* Comment Button */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowComments(true);
                            setShowActionsMenu(false);
                          }}
                          className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                        >
                          <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                            <MessageCircle className="w-5 h-5 text-blue-300" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-white font-medium">Commentaires</span>
                            <p className="text-sm text-white/70">Voir et ajouter des commentaires</p>
                          </div>
                        </motion.button>

                        {/* Share Button */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowShare(true);
                            setShowActionsMenu(false);
                          }}
                          className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                        >
                          <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                            <Share className="w-5 h-5 text-blue-300" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-white font-medium">Partager</span>
                            <p className="text-sm text-white/70">Partager ce produit</p>
                          </div>
                        </motion.button>

                        {/* Bookmark Button - Different states */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            toggleBookmark(product.id);
                            setShowActionsMenu(false);
                          }}
                          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 border shadow-lg ${
                            isBookmarked(product.id) 
                              ? 'bg-blue-500/30 hover:bg-blue-500/40 border-blue-400/50' 
                              : 'bg-white/10 hover:bg-white/20 border-white/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                            isBookmarked(product.id) 
                              ? 'bg-blue-500/30 border-blue-400/50' 
                              : 'bg-white/10 border-white/20'
                          }`}>
                            <Bookmark 
                              className={`w-5 h-5 ${
                                isBookmarked(product.id) 
                                  ? 'text-blue-300 fill-blue-300' 
                                  : 'text-white/70'
                              }`} 
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${
                              isBookmarked(product.id) ? 'text-blue-200' : 'text-white'
                            }`}>
                              {isBookmarked(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </span>
                            <p className={`text-sm ${
                              isBookmarked(product.id) ? 'text-blue-300/80' : 'text-white/70'
                            }`}>
                              {isBookmarked(product.id) ? 'Retirer de votre liste' : 'Sauvegarder pour plus tard'}
                            </p>
                          </div>
                        </motion.button>

                        {/* Follow Button - Different states */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            toggleFollow(product.user_id);
                            setShowActionsMenu(false);
                          }}
                          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 border shadow-lg ${
                            isFollowing(product.user_id) 
                              ? 'bg-blue-500/30 hover:bg-blue-500/40 border-blue-400/50' 
                              : 'bg-white/10 hover:bg-white/20 border-white/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                            isFollowing(product.user_id) 
                              ? 'bg-blue-500/30 border-blue-400/50' 
                              : 'bg-white/10 border-white/20'
                          }`}>
                            <UserPlus className={`w-5 h-5 ${
                              isFollowing(product.user_id) 
                                ? 'text-blue-300' 
                                : 'text-white/70'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${
                              isFollowing(product.user_id) ? 'text-blue-200' : 'text-white'
                            }`}>
                              {isFollowing(product.user_id) ? 'Ne plus suivre' : 'Suivre'}
                            </span>
                            <p className={`text-sm ${
                              isFollowing(product.user_id) ? 'text-blue-300/80' : 'text-white/70'
                            }`}>
                              {isFollowing(product.user_id) ? 'Arrêter de suivre ce vendeur' : 'Suivre ce vendeur'}
                            </p>
                          </div>
                        </motion.button>
                      </div>

                      {/* Close Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowActionsMenu(false)}
                        className="w-full py-3 bg-white/10 backdrop-blur-md text-white/80 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Avatar - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg"
            >
              <UserAvatar 
                avatarUrl={product.user?.avatar_url} 
                username={product.user?.username} 
                size="xl"
                className="w-full h-full"
              />
            </motion.button>
          </div>

           {/* Bottom content - Compact Design */}
           <div className="absolute bottom-48 left-2 right-16 z-20 pb-4 pointer-events-auto"> {/* Augmenté pour éviter le bottom nav */}
            <motion.div 
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {/* Infos utilisateur - Amélioré */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-black/30 rounded-full px-2 py-1">
                  <UserAvatar 
                    avatarUrl={product.user?.avatar_url} 
                    username={product.user?.username} 
                    size="sm"
                    className="w-6 h-6"
                  />
                  <h3 className="text-white font-bold text-base drop-shadow-lg">@{product.user?.username}</h3>
                </div>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFollow(product.user_id)}
                    className={`px-3 py-1 backdrop-blur-sm text-white rounded-full text-xs font-semibold transition-all border border-white/20 shadow ${
                      isFollowing(product.user_id) 
                        ? 'bg-gradient-to-r from-purple-500/60 to-purple-400/60 hover:bg-purple-500/80' 
                        : 'bg-gradient-to-r from-blue-500/60 to-blue-400/60 hover:bg-blue-500/80'
                    }`}
                  >
                    {isFollowing(product.user_id) ? 'Suivi' : 'Suivre'}
                  </motion.button>
                </div>
              
              {/* Description - Améliorée */}
              <p className="text-white text-sm leading-relaxed max-w-md drop-shadow-md bg-black/20 rounded-lg px-3 py-2 whitespace-pre-wrap break-words overflow-hidden">
                {product.description
                  ? product.description.length > 200
                    ? product.description.slice(0, 200) + '...'
                    : product.description
                  : "Aucune description disponible."}
              </p>

              {/* Carte produit - Améliorée */}
              <motion.div 
                className="bg-black/50 backdrop-blur-lg rounded-2xl p-3 space-y-2 border border-white/10 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base truncate drop-shadow-lg">{product.name}</h4>
                    <p className="text-white text-xl font-bold drop-shadow-lg">€{product.price}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-4 py-2 bg-white/30 backdrop-blur-sm text-blue-700 rounded-lg font-semibold hover:bg-white/50 transition-all text-sm ml-2 shadow pointer-events-auto z-30"
                  >
                    Voir
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyNow(product)}
                   className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 shadow-glow hover:shadow-glow-lg transition-all pointer-events-auto z-30"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Acheter maintenant</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Detailed Info Panel */}
          <AnimatePresence>
            {showInfo && index === currentIndex && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center p-4"
                onClick={() => setShowInfo(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-6 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-xl">Informations produit</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowInfo(false)}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {/* Product Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center bg-white/10 rounded-xl p-3">
                        <div className="text-white font-bold text-lg">{product.likes_count || 0}</div>
                        <div className="text-white/70 text-sm">Likes</div>
                      </div>
                      <div className="text-center bg-white/10 rounded-xl p-3">
                        <div className="text-white font-bold text-lg">{product.views_count || 0}</div>
                        <div className="text-white/70 text-sm">Vues</div>
                      </div>
                      <div className="text-center bg-white/10 rounded-xl p-3">
                        <div className="text-white font-bold text-lg">{product.sales_count || 0}</div>
                        <div className="text-white/70 text-sm">Ventes</div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Prix:</span>
                        <span className="text-white font-bold">€{product.price}</span>
                      </div>
                      {product.sku && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Référence:</span>
                          <span className="text-white font-bold">{product.sku}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Poids:</span>
                          <span className="text-white font-bold">{product.weight} kg</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/70">Statut:</span>
                        <span className="text-white font-bold capitalize">{product.status}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReport}
                        className="flex-1 bg-red-500/20 text-red-300 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                      >
                        <Flag className="w-4 h-4" />
                        <span>Signaler</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFullscreen}
                        className="flex-1 bg-white/20 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                      >
                        <Maximize className="w-4 h-4" />
                        <span>Plein écran</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Comments Modal */}
      <CommentsModal
        productId={currentProduct?.id || ''}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Share Modal */}
      <ShareModal
        product={currentProduct || { id: '', name: '', description: '', price: 0 }}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}