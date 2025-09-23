import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  DollarSign,
  FileText,
  Check,
  AlertCircle,
  Tag,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MediaUploader } from '../components/MediaUploader';
import { ProductVariants } from '../components/ProductVariants';

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
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
    price: '',
    category: 'tech',
    variants: [],
    mediaFiles: [],
    videoFile: null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    { value: 'tech', label: 'Technologie' },
    { value: 'fashion', label: 'Mode' },
    { value: 'home', label: 'Maison' },
    { value: 'beauty', label: 'Beauté' },
    { value: 'sports', label: 'Sport' },
    { value: 'food', label: 'Alimentation' },
    { value: 'books', label: 'Livres' },
    { value: 'toys', label: 'Jouets' }
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
    
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler l'upload
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Ici vous ajouteriez la logique pour envoyer les données au serveur
      console.log('Product data:', formData);
      
      // Rediriger vers la page d'accueil après succès
      navigate('/');
    } catch (error) {
      console.error('Error uploading product:', error);
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

              {/* Category */}
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

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-surface-700">
                  Description *
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