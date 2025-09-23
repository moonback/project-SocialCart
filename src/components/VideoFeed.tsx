import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, ShoppingCart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

interface VideoFeedProps {
  products: Product[];
}

export function VideoFeed({ products }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const itemHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setCurrentIndex(newIndex);
    }
  }, []);

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

  const handleBuyNow = (product: Product) => {
    addToCart(product);
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
        >
          {/* Video/Image Container */}
          <div className="w-full h-full relative overflow-hidden">
            {product.video_url ? (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => (videoRefs.current[product.id] = el)}
                  src={product.video_url}
                  className="w-full h-full object-cover"
                  autoPlay={index === currentIndex}
                  muted={isMuted[product.id] !== false}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(prev => ({ ...prev, [product.id]: true }))}
                  onPause={() => setIsPlaying(prev => ({ ...prev, [product.id]: false }))}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePlayPause(product.id)}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      {isPlaying[product.id] ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleMute(product.id)}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      {isMuted[product.id] ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </motion.button>
                  </div>
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

          {/* Right sidebar with actions */}
          <div className="absolute right-4 bottom-24 flex flex-col space-y-6 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => toggleLike(product.id)}
              className="flex flex-col items-center space-y-2"
            >
              <motion.div 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  likedProducts.has(product.id) 
                    ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
                animate={likedProducts.has(product.id) ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-7 h-7 transition-all duration-300 ${
                    likedProducts.has(product.id) 
                      ? 'text-white fill-white' 
                      : 'text-white hover:text-red-300'
                  }`} 
                />
              </motion.div>
              <span className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                {product.likes_count + (likedProducts.has(product.id) ? 1 : 0)}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                42
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                <Share className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                Partager
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg"
            >
              <img
                src={product.user?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face`}
                alt={product.user?.username}
                className="w-full h-full object-cover"
              />
            </motion.button>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-24 left-4 right-20 z-10">
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-white font-bold text-xl">@{product.user?.username}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-all"
                  >
                    Suivre
                  </motion.button>
                </div>
                <p className="text-white/90 text-base leading-relaxed max-w-md">
                  {product.description}
                </p>
              </div>

              <motion.div 
                className="surface-glass rounded-3xl p-6 space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-lg">{product.name}</h4>
                    <p className="text-white/90 text-2xl font-bold">${product.price}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all"
                  >
                    Voir le produit
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Acheter maintenant</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}