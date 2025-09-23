import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../lib/supabase';
import { ProductService } from '../lib/products';

export function Search() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const categories = ['all', 'electronics', 'fashion', 'home', 'sports', 'beauty'];

  // Charger tous les produits au montage du composant
  useEffect(() => {
    loadProducts();
  }, []);

  // Effectuer la recherche quand la query ou les filtres changent
  useEffect(() => {
    performSearch();
  }, [query, selectedCategory, priceRange, allProducts]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const products = await ProductService.getProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = () => {
    let filteredProducts = [...allProducts];

    // Filtrer par recherche textuelle
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Filtrer par catégorie (si vous avez des catégories dans votre BDD)
    if (selectedCategory !== 'all') {
      // Pour l'instant, on garde tous les produits car la structure de catégorie n'est pas encore définie
      // Vous pouvez ajouter le filtrage par catégorie ici plus tard
    }

    // Filtrer par prix
    filteredProducts = filteredProducts.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setSearchResults(filteredProducts);
  };

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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  {query ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
                </div>
                <div className="text-gray-500 text-sm">
                  {query ? 'Essayez avec d\'autres mots-clés' : 'Les produits apparaîtront ici une fois créés'}
                </div>
              </div>
            )}
          </>
        )}

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