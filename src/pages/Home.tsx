import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoFeed } from '../components/VideoFeed';
import { ProductService, Product } from '../lib/products';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await ProductService.getProducts();
        
        // Convertir les produits de la BDD vers le format attendu par VideoFeed
        const formattedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.primary_image_url || (product.images && product.images[0]) || '',
          images: product.images || [],
          video_url: product.video_url || undefined,
          variants: [], // Les variantes sont stockées dans les tags
          likes_count: product.likes_count || 0,
          user_id: product.seller_id,
          user: {
            id: product.seller_id,
            email: product.seller?.email || 'user@example.com',
            username: product.seller?.username || 'Utilisateur',
            loyalty_points: product.seller?.loyalty_points || 0,
            created_at: product.created_at,
            avatar_url: product.seller?.avatar_url || undefined,
          },
          created_at: product.created_at,
        }));
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // En cas d'erreur, utiliser des données mockées
        const mockProducts = [
          {
            id: '1',
            name: 'Écouteurs Sans Fil Pro',
            description: 'Qualité sonore exceptionnelle avec réduction de bruit active 🎧 #tech #audio #musique',
            price: 129.99,
            image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
            variants: [],
            likes_count: 1234,
            user_id: '1',
            user: {
              id: '1',
              email: 'user@example.com',
              username: 'techguru',
              loyalty_points: 500,
              created_at: '2024-01-01',
            },
            created_at: '2024-01-01',
          }
        ];
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-white font-bold text-xl">SC</span>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-white text-xl font-semibold">Chargement...</h2>
            <p className="text-white/70">Préparation de votre expérience shopping</p>
          </div>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
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

  return <VideoFeed products={products} />;
}