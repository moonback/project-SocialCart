import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  likes_count: number;
}

interface RecommendationsPanelProps {
  currentProduct: Product;
  allProducts: Product[];
  onProductSelect: (productId: string) => void;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  currentProduct,
  allProducts,
  onProductSelect,
}) => {
  // Algorithme simple de recommandation basé sur:
  // 1. Même vendeur
  // 2. Prix similaire
  // 3. Popularité (likes)
  const recommendations = React.useMemo(() => {
    const filtered = allProducts
      .filter(p => p.id !== currentProduct.id)
      .map(product => {
        let score = 0;
        
        // Bonus si même vendeur
        if (product.user.username === currentProduct.user.username) {
          score += 50;
        }
        
        // Bonus si prix similaire (±30%)
        const priceDiff = Math.abs(product.price - currentProduct.price) / currentProduct.price;
        if (priceDiff <= 0.3) {
          score += 30;
        }
        
        // Score basé sur la popularité
        score += Math.min(product.likes_count / 10, 20);
        
        return { ...product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    
    return filtered;
  }, [currentProduct, allProducts]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <h3 className="font-semibold text-gray-900">Recommandations pour vous</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onProductSelect(product.id)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <UserAvatar
                  avatarUrl={product.user.avatar_url}
                  username={product.user.username}
                  size="sm"
                  className="w-4 h-4"
                />
                <span className="text-xs text-gray-500">@{product.user.username}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">{product.likes_count}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-blue-600">€{product.price}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lien vers plus de recommandations */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        Voir plus de recommandations
      </motion.button>
    </div>
  );
};
