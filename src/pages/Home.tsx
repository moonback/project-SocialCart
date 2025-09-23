import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoFeed } from '../components/VideoFeed';
import { Product } from '../lib/supabase';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Mock data for demonstration
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Écouteurs Sans Fil Pro',
          description: 'Qualité sonore exceptionnelle avec réduction de bruit active 🎧 #tech #audio #musique',
          price: 129.99,
          image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
          variants: [
            { id: '1', name: 'Color', options: ['Noir', 'Blanc', 'Bleu'] }
          ],
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
        },
        {
          id: '2',
          name: 'Montre Connectée Fitness',
          description: 'Suivez vos objectifs de santé et fitness ⌚ #fitness #santé #montre',
          price: 299.99,
          image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
          variants: [
            { id: '1', name: 'Taille', options: ['38mm', '42mm'] },
            { id: '2', name: 'Bracelet', options: ['Sport', 'Cuir', 'Métal'] }
          ],
          likes_count: 2156,
          user_id: '2',
          user: {
            id: '2',
            email: 'fitness@example.com',
            username: 'fitnessfan',
            loyalty_points: 750,
            created_at: '2024-01-01',
          },
          created_at: '2024-01-01',
        },
        {
          id: '3',
          name: 'Grains de Café Premium',
          description: 'Café d\'origine unique du Colombie ☕ #café #matin #premium',
          price: 24.99,
          image_url: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          images: ['https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
          variants: [
            { id: '1', name: 'Mouture', options: ['Grain entier', 'Moulu', 'Expresso'] },
            { id: '2', name: 'Taille', options: ['250g', '500g', '1kg'] }
          ],
          likes_count: 892,
          user_id: '3',
          user: {
            id: '3',
            email: 'coffee@example.com',
            username: 'coffeemaster',
            loyalty_points: 300,
            created_at: '2024-01-01',
          },
          created_at: '2024-01-01',
        },
        {
          id: '4',
          name: 'Sac à Dos Voyage',
          description: 'Parfait pour vos aventures urbaines et voyages 🎒 #voyage #style #pratique',
          price: 89.99,
          image_url: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          images: ['https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
          variants: [
            { id: '1', name: 'Couleur', options: ['Noir', 'Gris', 'Bleu marine'] }
          ],
          likes_count: 567,
          user_id: '4',
          user: {
            id: '4',
            email: 'travel@example.com',
            username: 'voyageur',
            loyalty_points: 420,
            created_at: '2024-01-01',
          },
          created_at: '2024-01-01',
        },
        {
          id: '5',
          name: 'Smartphone Pro Max',
          description: 'Dernière technologie avec caméra professionnelle 📱 #tech #photo #innovation',
          price: 1299.99,
          image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
          variants: [
            { id: '1', name: 'Stockage', options: ['128GB', '256GB', '512GB'] },
            { id: '2', name: 'Couleur', options: ['Noir', 'Blanc', 'Or'] }
          ],
          likes_count: 3421,
          user_id: '5',
          user: {
            id: '5',
            email: 'mobile@example.com',
            username: 'mobileexpert',
            loyalty_points: 1200,
            created_at: '2024-01-01',
          },
          created_at: '2024-01-01',
        }
      ];

      setProducts(mockProducts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
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