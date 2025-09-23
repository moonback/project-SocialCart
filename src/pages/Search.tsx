import React, { useState } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../lib/supabase';

export function Search() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Mock search results
  const searchResults: Product[] = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      description: 'Premium sound quality',
      price: 129.99,
      image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [],
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
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      description: 'Track your fitness',
      price: 299.99,
      image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
      images: [],
      variants: [],
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
  ];

  const categories = ['all', 'electronics', 'fashion', 'home', 'sports', 'beauty'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-0 shadow-sm focus:ring-2 focus:ring-purple-500 text-lg"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {query ? `Results for "${query}"` : 'Trending Products'}
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div>
              <h4 className="font-medium mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Popular Searches */}
        {!query && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Earbuds', 'Smart Watch', 'Phone Case', 'Coffee', 'Skincare', 'Fitness'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-white rounded-full text-sm hover:bg-gray-50 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}