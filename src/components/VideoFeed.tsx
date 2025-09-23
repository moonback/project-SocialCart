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
  SkipBack,
  SkipForward,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';
import { Product as ProductFromProducts, ProductVariant } from '../lib/products';
import { Product as ProductFromSupabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
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
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const [autoPlay, setAutoPlay] = useState(true);
  const [showControls, setShowControls] = useState<{ [key: string]: boolean }>({});
  const [showInfo, setShowInfo] = useState<{ [key: string]: boolean }>({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Charger le paramètre autoPlay depuis le localStorage
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('video-autoplay');
    if (savedAutoPlay !== null) {
      setAutoPlay(savedAutoPlay === 'true');
    }
  }, []);

  // Sauvegarder le paramètre autoPlay dans le localStorage
  const toggleAutoPlay = () => {
    const newAutoPlay = !autoPlay;
    setAutoPlay(newAutoPlay);
    localStorage.setItem('video-autoplay', newAutoPlay.toString());
  };

  // Nouvelles fonctions pour les fonctionnalités avancées
  const toggleBookmark = (productId: string) => {
    setBookmarkedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success('Retiré des favoris');
      } else {
        newSet.add(productId);
        toast.success('Ajouté aux favoris');
      }
      return newSet;
    });
  };

  const toggleFollow = (sellerId: string) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sellerId)) {
        newSet.delete(sellerId);
        toast.success('Abonnement annulé');
      } else {
        newSet.add(sellerId);
        toast.success('Abonnement activé');
      }
      return newSet;
    });
  };


  const handleShare = (product: VideoFeedProduct) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

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

  const skipVideo = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const itemHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setCurrentIndex(newIndex);
      
      // Gérer la lecture automatique des vidéos
      if (autoPlay) {
        products.forEach((product, index) => {
          const video = videoRefs.current[product.id];
          if (video) {
            if (index === newIndex) {
              // Jouer la vidéo actuellement visible
              video.play().catch(console.error);
              setIsPlaying(prev => ({ ...prev, [product.id]: true }));
            } else {
              // Pause les autres vidéos
              video.pause();
              setIsPlaying(prev => ({ ...prev, [product.id]: false }));
            }
          }
        });
      }
    }
  }, [autoPlay, products]);

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const togglePlayPause = (productId: string) => {
    const video = videoRefs.current[productId];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(prev => ({ ...prev, [productId]: true }));
      } else {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [productId]: false }));
      }
    }
  };

  const toggleMute = (productId: string) => {
    const video = videoRefs.current[productId];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(prev => ({ ...prev, [productId]: video.muted }));
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
      return () => container.removeEventListener('scroll', handleScroll);
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
          onTouchStart={() => setShowControls(prev => ({ ...prev, [product.id]: true }))}
          onTouchEnd={() => {
            setTimeout(() => {
              setShowControls(prev => ({ ...prev, [product.id]: false }));
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
                  muted={isMuted[product.id] !== false}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(prev => ({ ...prev, [product.id]: true }))}
                  onPause={() => setIsPlaying(prev => ({ ...prev, [product.id]: false }))}
                />
                
                {/* Compact Video Controls Overlay */}
                <AnimatePresence>
                  {(showControls[product.id] || !autoPlay) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    >
                      {/* Compact Play/Pause Button */}
                      <div className="flex flex-col items-center space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => togglePlayPause(product.id)}
                          className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl"
                        >
                          {isPlaying[product.id] ? (
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
                            onClick={() => toggleMute(product.id)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            {isMuted[product.id] ? (
                              <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-white" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={changePlaybackSpeed}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xs"
                          >
                            {playbackSpeed}x
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Compact Skip Buttons */}
                <div className="absolute left-3 right-3 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => skipVideo('prev')}
                    className={`w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto ${currentIndex === 0 ? 'opacity-30' : ''}`}
                    disabled={currentIndex === 0}
                  >
                    <SkipBack className="w-5 h-5 text-white" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => skipVideo('next')}
                    className={`w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto ${currentIndex === products.length - 1 ? 'opacity-30' : ''}`}
                    disabled={currentIndex === products.length - 1}
                  >
                    <SkipForward className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Right sidebar with actions - Compact Design */}
          <div className="absolute right-2 sm:right-3 bottom-20 flex flex-col space-y-2 z-10">
            {/* AutoPlay Toggle - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAutoPlay}
              className="flex flex-col items-center space-y-1"
              title={autoPlay ? 'Désactiver la lecture automatique' : 'Activer la lecture automatique'}
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  autoPlay 
                    ? 'bg-green-500 shadow-lg shadow-green-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={autoPlay ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                {autoPlay ? 'Auto' : 'Manuel'}
              </span>
            </motion.button>
            {/* Like Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleLike(product.id)}
              className="flex flex-col items-center space-y-1"
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  likedProducts.has(product.id) 
                    ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={likedProducts.has(product.id) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-5 h-5 transition-all duration-300 ${
                    likedProducts.has(product.id) 
                      ? 'text-white fill-white' 
                      : 'text-white hover:text-red-300'
                  }`} 
                />
              </motion.div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                {product.likes_count + (likedProducts.has(product.id) ? 1 : 0)}
              </span>
            </motion.button>

            {/* Comments Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                42
              </span>
            </motion.button>

            {/* Share Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(product)}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <Share className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                Partager
              </span>
            </motion.button>

            {/* Bookmark Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleBookmark(product.id)}
              className="flex flex-col items-center space-y-1"
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  bookmarkedProducts.has(product.id) 
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={bookmarkedProducts.has(product.id) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Bookmark 
                  className={`w-5 h-5 transition-all duration-300 ${
                    bookmarkedProducts.has(product.id) 
                      ? 'text-white fill-white' 
                      : 'text-white hover:text-yellow-300'
                  }`} 
                />
              </motion.div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                {bookmarkedProducts.has(product.id) ? 'Sauvé' : 'Sauver'}
              </span>
            </motion.button>

            {/* Follow Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFollow(product.seller_id)}
              className="flex flex-col items-center space-y-1"
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  followingUsers.has(product.seller_id) 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={followingUsers.has(product.seller_id) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <UserPlus 
                  className={`w-5 h-5 transition-all duration-300 ${
                    followingUsers.has(product.seller_id) 
                      ? 'text-white' 
                      : 'text-white hover:text-blue-300'
                  }`} 
                />
              </motion.div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                {followingUsers.has(product.seller_id) ? 'Suivi' : 'Suivre'}
              </span>
            </motion.button>

            {/* More Options Button - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <MoreVertical className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                Plus
              </span>
            </motion.button>

            {/* User Avatar - Compact */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg"
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
          <div className="absolute bottom-16 left-3 sm:left-4 right-20 z-10">
            <motion.div 
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* User info - Compact */}
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-base">@{product.user?.username}</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium hover:bg-white/30 transition-all"
                >
                  Suivre
                </motion.button>
              </div>
              
              {/* Description - Compact */}
              <p className="text-white/90 text-sm leading-relaxed max-w-sm line-clamp-2">
                {product.description}
              </p>

              {/* Product card - Compact */}
              <motion.div 
                className="surface-glass rounded-xl p-3 space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-white/90 text-lg font-bold">€{product.price}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-all text-xs ml-2"
                  >
                    Voir
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-gradient-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Acheter maintenant</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Detailed Info Panel */}
          <AnimatePresence>
            {showInfo[product.id] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center p-4"
                onClick={() => setShowInfo(prev => ({ ...prev, [product.id]: false }))}
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
                      onClick={() => setShowInfo(prev => ({ ...prev, [product.id]: false }))}
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
    </div>
  );
}