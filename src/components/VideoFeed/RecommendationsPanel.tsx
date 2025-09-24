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
  const formatPrice = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.25 } })
  };
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
    <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50/60 px-3 py-1">
          <Sparkles className="h-4 w-4 text-yellow-600" />
          <h3 className="text-sm font-semibold text-gray-900">Recommandations pour vous</h3>
        </div>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onProductSelect(product.id)}
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-blue-100 hover:bg-white hover:shadow-sm"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <img
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <div className="pointer-events-none absolute right-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {product.likes_count}
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {product.name}
              </h4>
              <div className="mt-1 flex items-center gap-2">
                <UserAvatar
                  avatarUrl={product.user.avatar_url}
                  username={product.user.username}
                  size="sm"
                  className="h-4 w-4"
                />
                <span className="text-xs text-gray-500">@{product.user.username}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm font-semibold text-blue-600">
                {formatPrice(product.price)}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lien vers plus de recommandations */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full rounded-lg border border-blue-100 bg-blue-50/60 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Voir plus de recommandations
        </span>
      </motion.button>
    </div>
  );
};
