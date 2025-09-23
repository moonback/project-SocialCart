import React, { useState, useEffect } from 'react';
import { VideoFeed } from '../components/VideoFeed';
import { Product } from '../lib/supabase';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wireless Earbuds Pro',
        description: 'Amazing sound quality with noise cancellation 🎧 #tech #earbuds #music',
        price: 129.99,
        image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        images: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
        variants: [
          { id: '1', name: 'Color', options: ['Black', 'White', 'Blue'] }
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
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals ⌚ #fitness #health #smartwatch',
        price: 299.99,
        image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
        variants: [
          { id: '1', name: 'Size', options: ['38mm', '42mm'] },
          { id: '2', name: 'Band', options: ['Sport', 'Leather', 'Metal'] }
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
        name: 'Premium Coffee Beans',
        description: 'Single origin coffee from Colombia ☕ #coffee #morning #premium',
        price: 24.99,
        image_url: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        images: ['https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
        variants: [
          { id: '1', name: 'Grind', options: ['Whole Bean', 'Ground', 'Espresso'] },
          { id: '2', name: 'Size', options: ['250g', '500g', '1kg'] }
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
      }
    ];

    setProducts(mockProducts);
  }, []);

  return <VideoFeed products={products} />;
}