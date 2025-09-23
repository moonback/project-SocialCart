import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  DollarSign,
  FileText,
  Check,
  AlertCircle,
  Tag,
  Sparkles,
  Settings,
  Truck,
  Scale,
  Barcode,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MediaUploader } from '../components/MediaUploader';
import { ProductVariants } from '../components/ProductVariants';
import { ProductService, CreateProductData } from '../lib/products';
import { getCategoryId, getBrandId } from '../lib/categories';
import toast from 'react-hot-toast';

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

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
  variants: ProductVariant[];
  mediaFiles: File[];
  videoFile: File | null;
}

export function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    weight: '',
    category: 'tech',
    brand: '',
    status: 'active',
    inventoryTracking: true,
    inventoryQuantity: 1,
    allowBackorder: false,
    requiresShipping: true,
    taxable: true,
    metaTitle: '',
    metaDescription: '',
    variants: [],
    mediaFiles: [],
    videoFile: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    { value: 'electronics', label: 'Électronique' },
    { value: 'fashion', label: 'Mode & Accessoires' },
    { value: 'home', label: 'Maison & Jardin' },
    { value: 'sports', label: 'Sports & Loisirs' },
    { value: 'beauty', label: 'Beauté & Santé' },
    { value: 'food', label: 'Alimentation' },
    { value: 'books', label: 'Livres & Médias' },
    { value: 'automotive', label: 'Automobile' },
    { value: 'toys', label: 'Jouets & Enfants' },
    { value: 'other', label: 'Autres' }
  ];

  const brands = [
    { value: '', label: 'Aucune marque' },
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'sony', label: 'Sony' },
    { value: 'lg', label: 'LG' },
    { value: 'dell', label: 'Dell' },
    { value: 'hp', label: 'HP' },
    { value: 'canon', label: 'Canon' },
    { value: 'other', label: 'Autre' }
  ];

  const handleMediaFilesChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, mediaFiles: files }));
    setErrors(prev => ({ ...prev, media: '' }));
  };

  const handleVideoChange = (video: File | null) => {
    setFormData(prev => ({ ...prev, videoFile: video }));
    setErrors(prev => ({ ...prev, video: '' }));
  };

  const handleVariantsChange = (variants: ProductVariant[]) => {
    setFormData(prev => ({ ...prev, variants }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du produit est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (formData.mediaFiles.length === 0 && !formData.videoFile) newErrors.media = 'Au moins une image ou une vidéo est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Étape 1: Upload des médias
      setUploadProgress(20);
      toast.loading('Upload des médias...', { id: 'upload-media' });
      
      const mediaResult = await ProductService.uploadMedia(
        formData.mediaFiles,
        formData.videoFile
      );
      
      setUploadProgress(50);
      toast.success('Médias uploadés avec succès!', { id: 'upload-media' });

      // Étape 2: Préparer les données du produit
      setUploadProgress(70);
      toast.loading('Création du produit...', { id: 'create-product' });

      const productData: CreateProductData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription || formData.description.substring(0, 500),
        price: parseFloat(formData.price),
        compare_price: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost_price: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        sku: formData.sku || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        // Utiliser les utilitaires pour convertir les noms en UUIDs
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
        images: mediaResult.images,
        primary_image_url: mediaResult.primaryImageUrl,
        video_url: mediaResult.videoUrl,
        variants: formData.variants,
        tags: [`#${formData.category}`, ...formData.variants.flatMap(v => v.options.map(o => `${v.name}:${o}`))]
      };

      // Étape 3: Créer le produit
      setUploadProgress(90);
      const createdProduct = await ProductService.createProduct(productData, user.id);
      
      setUploadProgress(100);
      toast.success('Produit créé avec succès!', { id: 'create-product' });
      
      // Rediriger vers la page d'accueil après succès
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Erreur lors de la création du produit', { id: 'create-product' });
      setErrors({ submit: 'Erreur lors de la création du produit' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow"
            >
              <Package className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-display text-4xl text-gradient">Créer un produit</h1>
            <p className="text-surface-600 text-lg">Partagez vos produits avec la communauté</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Media Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-surface-900">Médias</h2>
                  <p className="text-surface-600 text-sm">Ajoutez des images et vidéos à votre produit</p>
                </div>
              </div>

              <MediaUploader
                onFilesChange={handleMediaFilesChange}
                onVideoChange={handleVideoChange}
                maxFiles={8}
                maxFileSize={10}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                acceptedVideoTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']}
                error={errors.media || errors.video}
              />
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-2xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-surface-900">Détails du produit</h2>
                  <p className="text-surface-600 text-sm">Informations essentielles sur votre produit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Nom du produit *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`input pl-12 ${errors.name ? 'input-error' : ''}`}
                      placeholder="Nom de votre produit"
                    />
                  </div>
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
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className={`input pl-12 ${errors.price ? 'input-error' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-600 text-sm">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
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
                    {brands.map(brand => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
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

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-surface-700">
                  Description complète *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`input min-h-[120px] resize-none ${errors.description ? 'input-error' : ''}`}
                  placeholder="Décrivez votre produit... Utilisez des hashtags pour plus de visibilité !"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SKU */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Référence (SKU)
                  </label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="input pl-12"
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
                    <Scale className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      className="input pl-12"
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
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.comparePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                      className="input pl-12"
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
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                      className="input pl-12"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Dimensions (optionnel)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-surface-700">
                      Longueur (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="input"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-surface-700">
                      Largeur (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="input"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-surface-700">
                      Hauteur (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="input"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </motion.div>

            {/* Variants */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-8"
            >
              <ProductVariants
                variants={formData.variants}
                onVariantsChange={handleVariantsChange}
              />
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-surface-900">Informations de livraison</h2>
                  <p className="text-surface-600 text-sm">Détails sur l'expédition et la livraison</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Délai de livraison (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    placeholder="3-5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Frais de port (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </motion.div>

            {/* Advanced Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="card p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-surface-900">Paramètres avancés</h2>
                  <p className="text-surface-600 text-sm">Options supplémentaires pour votre produit</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Tags Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Tags et Mots-clés</span>
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-surface-700">
                    Tags personnalisés (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="premium, qualité, nouveau, tendance..."
                  />
                  <p className="text-xs text-surface-500">Ajoutez des tags pour améliorer la visibilité de votre produit</p>
                </div>
              </div>

              {/* SEO Fields */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>SEO et Métadonnées</span>
                </h3>
                
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

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-end"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="btn-secondary px-8 py-4"
              >
                Annuler
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isUploading}
                className="btn-primary px-8 py-4 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Publier le produit</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Upload Progress */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card p-6 space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold text-surface-900">Publication en cours...</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-surface-600">{uploadProgress}% terminé</p>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{errors.submit}</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}