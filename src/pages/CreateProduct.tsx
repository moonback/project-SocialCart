import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MediaUploader } from '../components/MediaUploader';
import { ImageAnalysisPanel } from '../components/ImageAnalysisPanel';
import { ProductVariants } from '../components/ProductVariants';
import { ProductService, CreateProductData } from '../lib/products';
import { LoyaltyService } from '../lib/loyalty';
import { getCategoryId, getBrandId } from '../lib/categories';
import { ProductAnalysisResult } from '../lib/gemini';
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

export default function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
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
    variants: [],
    mediaFiles: [],
    videoFile: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  const categories = [
    { value: 'electronics', label: 'Électronique', icon: '📱' },
    { value: 'fashion', label: 'Mode & Accessoires', icon: '👕' },
    { value: 'home', label: 'Maison & Jardin', icon: '🏠' },
    { value: 'sports', label: 'Sports & Loisirs', icon: '⚽' },
    { value: 'beauty', label: 'Beauté & Santé', icon: '💄' },
    { value: 'books', label: 'Livres & Médias', icon: '📚' },
    { value: 'toys', label: 'Jouets & Jeux', icon: '🧸' },
    { value: 'other', label: 'Autres', icon: '📦' }
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

  const handleAnalyzeImages = (files: File[]) => {
    if (files.length > 0) {
      setShowAnalysisPanel(true);
    }
  };

  const handleApplyAnalysis = (result: ProductAnalysisResult) => {
    setFormData(prev => ({
      ...prev,
      name: result.name || prev.name,
      description: result.description || prev.description,
      shortDescription: result.shortDescription || prev.shortDescription,
      category: result.category || prev.category,
      brand: result.brand || prev.brand,
      price: result.price ? result.price.toString() : prev.price
    }));
    
    // Si une catégorie a été détectée, passer à l'étape suivante
    if (result.category && currentStep === 1) {
      setTimeout(() => {
        nextStep();
      }, 500);
    }
    
    toast.success('Informations appliquées avec succès!');
  };

  // Fonctions de navigation des étapes
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Catégorie';
      case 2: return 'Médias';
      case 3: return 'Détails';
      default: return '';
    }
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
        category_id: getCategoryId(formData.category) || undefined,
        brand_id: getBrandId(formData.brand) || undefined,
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
      const created = await ProductService.createProduct(productData, user.id);
      // Fidélité: récompense création de produit
      if (created && (created as any).id) {
        const points = await LoyaltyService.awardPoints(user.id, 'create_product', (created as any).id);
        if (points > 0) {
          toast.success(`+${points} point${points > 1 ? 's' : ''} de fidélité ! ⭐`, { duration: 3000 });
        }
      }
      
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
          

          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step 
                    ? 'bg-gradient-primary text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? <Check className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-3 rounded-full transition-all ${
                    currentStep > step ? 'bg-gradient-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Titre de l'étape actuelle */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-surface-900">
              Étape {currentStep}: {getStepTitle(currentStep)}
            </h2>
            <p className="text-surface-600 mt-2">
              {currentStep === 1 && 'Choisissez la catégorie de votre produit'}
              {currentStep === 2 && 'Ajoutez des images et vidéos à votre produit'}
              {currentStep === 3 && 'Renseignez les informations de votre produit'}
            </p>
          </div>

          {/* Contenu des étapes */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-8"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-4">
                      Catégorie *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                          className={`p-6 rounded-2xl border-2 transition-all text-center group ${
                            formData.category === category.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                          }`}
                        >
                          <div className="text-3xl mb-2">{category.icon}</div>
                          <div className="font-medium text-sm">{category.label}</div>
                        </button>
                      ))}
                    </div>
                    {errors.category && (
                      <div className="flex items-center space-x-2 text-red-500 text-sm mt-3">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.category}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-3">
                      Marque (optionnel)
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="input"
                    >
                      {brands.map((brand) => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-8"
              >
                <MediaUploader
                  onFilesChange={handleMediaFilesChange}
                  onVideoChange={handleVideoChange}
                  onAnalyzeImages={handleAnalyzeImages}
                  maxFiles={8}
                  maxFileSize={10}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  acceptedVideoTypes={['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']}
                  error={errors.media || errors.video}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input"
                        placeholder="Nom de votre produit"
                      />
                      {errors.name && (
                        <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Prix *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          className="input pl-8"
                          placeholder="0.00"
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.price && (
                        <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Description courte
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      className="input"
                      placeholder="Description courte (optionnel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Description complète *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input min-h-[120px] resize-none"
                      placeholder="Décrivez votre produit en détail..."
                    />
                    {errors.description && (
                      <div className="flex items-center space-x-2 text-red-500 text-sm mt-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description}</span>
                      </div>
                    )}
                  </div>

                  {/* Variantes */}
                  <ProductVariants
                    variants={formData.variants}
                    onVariantsChange={handleVariantsChange}
                  />

                  {/* Informations supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Référence (SKU)
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        className="input"
                        placeholder="SKU-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Poids (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="input"
                        placeholder="0.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Prix comparatif
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.comparePrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                        className="input"
                        placeholder="Prix barré"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Prix de revient (optionnel)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                        className="input"
                        placeholder="Coût d'achat"
                      />
                    </div>
                  </div>

                  {/* Stock et statut */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Quantité en stock
                      </label>
                      <input
                        type="number"
                        value={formData.inventoryQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, inventoryQuantity: parseInt(e.target.value) || 0 }))}
                        className="input"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        Statut du produit
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'active' | 'inactive' | 'archived' }))}
                        className="input"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="archived">Archivé</option>
                      </select>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-surface-900">Options</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.inventoryTracking}
                          onChange={(e) => setFormData(prev => ({ ...prev, inventoryTracking: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-surface-700">Suivi des stocks</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.allowBackorder}
                          onChange={(e) => setFormData(prev => ({ ...prev, allowBackorder: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-surface-700">Autoriser les commandes en attente</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.requiresShipping}
                          onChange={(e) => setFormData(prev => ({ ...prev, requiresShipping: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-surface-700">Nécessite une livraison</span>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.taxable}
                          onChange={(e) => setFormData(prev => ({ ...prev, taxable: e.target.checked }))}
                          className="w-5 h-5 text-primary-600 rounded"
                        />
                        <span className="text-surface-700">Taxable</span>
                      </label>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boutons de navigation */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-surface-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Précédent</span>
            </motion.button>

            {currentStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <span>Suivant</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isUploading}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Créer le produit</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Barre de progression */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Erreur générale */}
          {errors.submit && (
            <div className="flex items-center space-x-2 text-red-500 text-center justify-center">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Panel d'analyse IA */}
      <ImageAnalysisPanel
        imageFiles={formData.mediaFiles}
        onApplyAnalysis={handleApplyAnalysis}
        onClose={() => setShowAnalysisPanel(false)}
        isOpen={showAnalysisPanel}
      />
    </div>
  );
}
