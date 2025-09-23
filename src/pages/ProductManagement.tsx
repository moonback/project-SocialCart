import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  TrendingUp,
  Heart,
  Star,
  Calendar,
  Tag,
  Settings,
  BarChart3,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProductService } from '../lib/products';
import { Product } from '../lib/supabase';
import { getCategoryName, getBrandName } from '../lib/categories';
import toast from 'react-hot-toast';

export function ProductManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const allProducts = await ProductService.getProducts();
      // Filtrer les produits de l'utilisateur connecté
      const userProducts = allProducts.filter(p => p.seller_id === user.id);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      await ProductService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await ProductService.updateProduct(productId, { status: newStatus });
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      ));
      toast.success(`Produit ${newStatus === 'active' ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'likes_count':
        aValue = a.likes_count || 0;
        bValue = b.likes_count || 0;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'draft': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">Chargement des produits</h2>
            <p className="text-surface-600">Récupération de vos produits...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-surface-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Mes Produits</h1>
              <p className="text-surface-600 text-sm">{products.length} produit{products.length > 1 ? 's' : ''}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-product')}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border transition-colors ${
                  showFilters ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-surface-200 bg-white text-surface-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadProducts}
                className="p-2 rounded-xl border border-surface-200 bg-white text-surface-700 hover:bg-surface-50"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl border border-surface-200 p-4 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Statut</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input text-sm"
                      >
                        <option value="all">Tous</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="draft">Brouillon</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Trier par</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input text-sm"
                      >
                        <option value="created_at">Date de création</option>
                        <option value="name">Nom</option>
                        <option value="price">Prix</option>
                        <option value="likes_count">Popularité</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'asc' ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-600'
                      }`}
                    >
                      Croissant
                    </button>
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        sortOrder === 'desc' ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-600'
                      }`}
                    >
                      Décroissant
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="px-4 py-6 space-y-4">
        {sortedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Aucun produit trouvé' : 'Aucun produit créé'}
            </h3>
            <p className="text-surface-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier produit'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-product')}
                className="btn-primary px-6 py-3"
              >
                Créer un produit
              </motion.button>
            )}
          </motion.div>
        ) : (
          sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-surface-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.primary_image_url || product.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-surface-900 truncate">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(product.status)}`}>
                          {getStatusLabel(product.status)}
                        </span>
                        {product.category_id && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {getCategoryName(product.category_id)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">€{product.price}</div>
                      {product.sku && (
                        <div className="text-xs text-surface-500">Réf: {product.sku}</div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-xs text-surface-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{product.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.views_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{product.sales_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(product.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 bg-surface-100 text-surface-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex-1 bg-primary-100 text-primary-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 ${
                        product.status === 'active' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {product.status === 'active' ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Désactiver</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Activer</span>
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
