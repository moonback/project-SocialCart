import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  isLiked?: boolean;
}

export function ProductCard({ product, onLike, isLiked = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">by @{product.user?.username}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">${product.price}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-1 hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}