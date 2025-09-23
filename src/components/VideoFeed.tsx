import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

interface VideoFeedProps {
  products: Product[];
}

export function VideoFeed({ products }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const itemHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      setCurrentIndex(newIndex);
    }
  };

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

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      onScroll={handleScroll}
    >
      {products.map((product, index) => (
        <div key={product.id} className="h-screen snap-start relative flex items-center justify-center bg-black">
          {/* Video/Image */}
          <div className="w-full h-full relative">
            {product.video_url ? (
              <video
                src={product.video_url}
                className="w-full h-full object-cover"
                autoPlay={index === currentIndex}
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Right sidebar with actions */}
          <div className="absolute right-4 bottom-24 flex flex-col space-y-6">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => toggleLike(product.id)}
              className="flex flex-col items-center space-y-1"
            >
              <div className={`p-3 rounded-full ${likedProducts.has(product.id) ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'}`}>
                <Heart 
                  className={`w-6 h-6 ${likedProducts.has(product.id) ? 'text-white fill-white' : 'text-white'}`} 
                />
              </div>
              <span className="text-white text-xs font-medium">
                {product.likes_count + (likedProducts.has(product.id) ? 1 : 0)}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center space-y-1"
            >
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">42</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              className="flex flex-col items-center space-y-1"
            >
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Share className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">Share</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
            >
              <img
                src={product.user?.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face`}
                alt={product.user?.username}
                className="w-full h-full object-cover"
              />
            </motion.button>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-24 left-4 right-20">
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold text-lg">@{product.user?.username}</h3>
                <p className="text-white/90 text-sm mt-1">{product.description}</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{product.name}</h4>
                    <p className="text-white/90 text-lg font-bold">${product.price}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-4 py-2 bg-white text-purple-600 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    View Product
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyNow(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}