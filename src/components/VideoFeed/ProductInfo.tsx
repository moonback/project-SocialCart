import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface ProductInfoProps {
  productId: string;
  productName: string;
  productPrice: number;
  productDescription?: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onViewProduct: () => void;
  onBuyNow: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  productId,
  productName,
  productPrice,
  productDescription,
  userId,
  username,
  avatarUrl,
  isFollowing,
  onToggleFollow,
  onViewProduct,
  onBuyNow,
}) => {
  const truncatedDescription = productDescription
    ? productDescription.length > 200
      ? productDescription.slice(0, 200) + '...'
      : productDescription
    : "Aucune description disponible.";

  return (
    <div className="absolute bottom-48 left-2 right-16 z-20 pb-4 pointer-events-auto">
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
              avatarUrl={avatarUrl} 
              username={username} 
              size="sm"
              className="w-6 h-6"
            />
            <h3 className="text-white font-bold text-base drop-shadow-lg">@{username}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFollow}
            className={`px-3 py-1 backdrop-blur-sm text-white rounded-full text-xs font-semibold transition-all border border-white/20 shadow ${
              isFollowing 
                ? 'bg-gradient-to-r from-purple-500/60 to-purple-400/60 hover:bg-purple-500/80' 
                : 'bg-gradient-to-r from-blue-500/60 to-blue-400/60 hover:bg-blue-500/80'
            }`}
          >
            {isFollowing ? 'Suivi' : 'Suivre'}
          </motion.button>
        </div>
      
        {/* Description - Améliorée */}
        <p className="text-white text-sm leading-relaxed max-w-md drop-shadow-md bg-black/20 rounded-lg px-3 py-2 whitespace-pre-wrap break-words overflow-hidden">
          {truncatedDescription}
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
              <h4 className="text-white font-bold text-base truncate drop-shadow-lg">{productName}</h4>
              <p className="text-white text-xl font-bold drop-shadow-lg">€{productPrice}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewProduct}
              className="px-4 py-2 bg-white/30 backdrop-blur-sm text-blue-700 rounded-lg font-semibold hover:bg-white/50 transition-all text-sm ml-2 shadow pointer-events-auto z-30"
            >
              Voir
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBuyNow}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 shadow-glow hover:shadow-glow-lg transition-all pointer-events-auto z-30"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Acheter maintenant</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
