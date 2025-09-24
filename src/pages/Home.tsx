import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdaptiveVideoFeed, VideoFeedProduct } from '../components/AdaptiveVideoFeed';
import { ProductService, ProductVariant } from '../lib/products';

export default function Home() {
  const [products, setProducts] = useState<VideoFeedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const products = await ProductService.getProducts();
      
      // Convertir les produits de la BDD vers le format attendu par VideoFeed
      const formattedProducts: VideoFeedProduct[] = products.map(product => ({
        ...product,
        image_url: product.primary_image_url || (product.images && product.images[0]) || '',
        user: {
          username: product.seller?.username || 'Utilisateur',
          avatar_url: product.seller?.avatar_url || undefined,
        },
        variants: [] as ProductVariant[], // Les variantes sont stockées dans les tags
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await loadProducts();
      setLoading(false);
    };

    initializeProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-blue-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 relative z-10"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow border border-white/30 backdrop-blur-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-white font-bold text-xl">SC</span>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">Chargement...</h2>
          </div>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return <AdaptiveVideoFeed products={products} onProductDeleted={loadProducts} />;
}