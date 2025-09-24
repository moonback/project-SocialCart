import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { ProductUserAvatar } from './UserAvatar';
import { LoyaltyPoints } from './LoyaltyPoints';

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  isLiked?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export function ProductCard({ 
  product, 
  onLike, 
  isLiked = false, 
  variant = 'default' 
}: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(product.id);
  };

  const cardVariants = {
    default: 'card-glass-hover',
    compact: 'card-glass',
    featured: 'card-glass-hover border-2 border-primary-300/50 shadow-glow'
  };

  const aspectRatio = variant === 'compact' ? 'aspect-[4/3]' : 'aspect-square';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`${cardVariants[variant]} overflow-hidden group cursor-pointer`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className={`relative ${aspectRatio} overflow-hidden`}>
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface-100 animate-pulse" />
        )}
        
        <img
          src={product.primary_image_url || product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="btn-floating"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-surface-600 group-hover:text-red-500'
              }`} 
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn-floating opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Eye className="w-5 h-5 text-surface-600" />
          </motion.button>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-glow"
          >
            ${product.price}
          </motion.div>
        </div>

        {/* Quick Add Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full bg-white/90 backdrop-blur-sm text-surface-900 py-2 px-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-white transition-all shadow-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-surface-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ProductUserAvatar 
                avatarUrl={product.user?.avatar_url} 
                username={product.user?.username} 
                size="sm"
              />
              <span className="text-sm text-surface-500">@{product.user?.username || 'vendeur'}</span>
            </div>
            {product.user?.loyalty_points && product.user.loyalty_points > 0 && (
              <LoyaltyPoints points={product.user.loyalty_points} size="sm" />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-surface-500">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{product.likes_count + (isLiked ? 1 : 0)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>4.8</span>
          </div>
        </div>

        {/* Description for featured variant */}
        {variant === 'featured' && (
          <p className="text-sm text-surface-600 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}