import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  FileText,
  Tag,
  Settings,
  Truck,
  Scale,
  Barcode,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ProductService } from '../lib/products';
import { getCategoryId, getBrandId, PREDEFINED_CATEGORIES, PREDEFINED_BRANDS } from '../lib/categories';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  sku: string;
  weight: string;
  category: string;
  brand: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  inventoryTracking: boolean;
  inventoryQuantity: number;
  allowBackorder: boolean;
  requiresShipping: boolean;
  taxable: boolean;
  metaTitle: string;
  metaDescription: string;
}

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    weight: '',
    category: '',
    brand: '',
    status: 'active',
    inventoryTracking: true,
    inventoryQuantity: 1,
    allowBackorder: false,
    requiresShipping: true,
    taxable: true,
    metaTitle: '',
    metaDescription: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id || !user) return;
    
    setLoading(true);
    try {
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        toast.error('Produit non trouvé');
        navigate('/products');
        return;
      }

      // Vérifier que l'utilisateur est le propriétaire
      if (product.seller_id !== user.id) {
        toast.error('Vous n\'avez pas l\'autorisation de modifier ce produit');
        navigate('/products');
        return;
      }

      // Remplir le formulaire avec les données du produit
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.short_description || '',
        price: product.price?.toString() || '',
        comparePrice: product.compare_price?.toString() || '',
        costPrice: product.cost_price?.toString() || '',
        sku: product.sku || '',
        weight: product.weight?.toString() || '',
        category: product.category_id || '',
        brand: product.brand_id || '',
        status: product.status || 'active',
        inventoryTracking: product.inventory_tracking !== false,
        inventoryQuantity: product.inventory_quantity || 1,
        allowBackorder: product.allow_backorder || false,
        requiresShipping: product.requires_shipping !== false,
        taxable: product.taxable !== false,
        metaTitle: product.meta_title || '',
        metaDescription: product.meta_description || '',
      });
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Erreur lors du chargement du produit');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du produit est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Le prix doit être supérieur à 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !id || !user) return;

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription || formData.description.substring(0, 500),
        price: parseFloat(formData.price),
        compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost_price: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        sku: formData.sku || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        category_id: getCategoryId(formData.category),
        brand_id: getBrandId(formData.brand),
        status: formData.status,
        inventory_tracking: formData.inventoryTracking,
        inventory_quantity: formData.inventoryQuantity,
        allow_backorder: formData.allowBackorder,
        requires_shipping: formData.requiresShipping,
        taxable: formData.taxable,
        meta_title: formData.metaTitle || undefined,
        meta_description: formData.metaDescription || undefined,
      };

      await ProductService.updateProduct(id, updateData);
      toast.success('Produit mis à jour avec succès !');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    } finally {
      setSaving(false);
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
            <h2 className="text-2xl font-bold text-surface-900">Chargement du produit</h2>
            <p className="text-surface-600">Récupération des informations...</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="p-2 rounded-xl bg-surface-100 text-surface-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-surface-900">Modifier le produit</h1>
                <p className="text-surface-600 text-sm">{formData.name}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">Informations de base</h2>
              <p className="text-surface-600 text-sm">Détails essentiels du produit</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Nom du produit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Nom de votre produit"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Prix *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className={`input pl-10 ${errors.price ? 'input-error' : ''}`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="text-red-600 text-sm">{errors.price}</p>
              )}
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-surface-700">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {PREDEFINED_CATEGORIES.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-surface-700">
                  Marque
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="input"
                >
                  <option value="">Sélectionner une marque</option>
                  {PREDEFINED_BRANDS.map(brand => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Description complète *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`input min-h-[120px] resize-none ${errors.description ? 'input-error' : ''}`}
                placeholder="Décrivez votre produit..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Description courte
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="input min-h-[80px] resize-none"
                placeholder="Description courte pour les aperçus..."
                maxLength={500}
              />
              <p className="text-xs text-surface-500">{formData.shortDescription.length}/500 caractères</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-secondary rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">Informations supplémentaires</h2>
              <p className="text-surface-600 text-sm">Détails techniques et commerciaux</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Référence (SKU)
              </label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="input pl-10"
                  placeholder="REF-001"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Poids (kg)
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Compare Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Prix comparatif
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Cost Price */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Prix de revient
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status and Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">Statut et paramètres</h2>
              <p className="text-surface-600 text-sm">Configuration du produit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Statut du produit
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="input"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            {/* Inventory Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Quantité en stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.inventoryQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, inventoryQuantity: parseInt(e.target.value) || 0 }))}
                className="input"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Inventory Tracking */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inventoryTracking}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventoryTracking: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-surface-700">Suivi d'inventaire</span>
              </label>
              <p className="text-xs text-surface-500">Suivre automatiquement le stock</p>
            </div>

            {/* Allow Backorder */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.allowBackorder}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowBackorder: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-surface-700">Autoriser les commandes en attente</span>
              </label>
              <p className="text-xs text-surface-500">Permettre les commandes même sans stock</p>
            </div>

            {/* Requires Shipping */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requiresShipping}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresShipping: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-surface-700">Nécessite une expédition</span>
              </label>
              <p className="text-xs text-surface-500">Produit physique nécessitant un envoi</p>
            </div>

            {/* Taxable */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.taxable}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxable: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-surface-700">Assujetti aux taxes</span>
              </label>
              <p className="text-xs text-surface-500">Produit soumis à la TVA</p>
            </div>
          </div>
        </motion.div>

        {/* SEO Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">SEO et Métadonnées</h2>
              <p className="text-surface-600 text-sm">Optimisation pour les moteurs de recherche</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Titre SEO
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="input"
                placeholder="Titre pour les moteurs de recherche..."
                maxLength={255}
              />
              <p className="text-xs text-surface-500">{formData.metaTitle.length}/255 caractères</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-surface-700">
                Description SEO
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="input min-h-[80px] resize-none"
                placeholder="Description pour les moteurs de recherche..."
                maxLength={500}
              />
              <p className="text-xs text-surface-500">{formData.metaDescription.length}/500 caractères</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
