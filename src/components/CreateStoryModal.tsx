import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryService } from '../lib/stories';
import { ProductService, Product } from '../lib/products';
import { StorageService } from '../lib/storage';
import { X, Upload, Image, Video, Send, AlertCircle, Loader } from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}

export function CreateStoryModal({ isOpen, onClose, onStoryCreated }: CreateStoryModalProps) {
  const [step, setStep] = useState<'select-product' | 'upload-media' | 'add-caption'>('select-product');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les produits de l'utilisateur
  React.useEffect(() => {
    if (isOpen && step === 'select-product') {
      loadUserProducts();
    }
  }, [isOpen, step]);

  const loadUserProducts = async () => {
    try {
      setLoading(true);
      const products = await ProductService.getUserProducts();
      setUserProducts(products);
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Erreur lors du chargement de vos produits');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      // Compression automatique pour les images
      let processedFile = file;
      if (file.type.startsWith('image/')) {
        processedFile = await StorageService.compressImage(file, 85, 1920, 1080);
      }

      setMediaFile(processedFile);

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error('Erreur lors du traitement du fichier:', err);
      setError('Erreur lors du traitement du fichier');
    }
  };

  const uploadMedia = async (): Promise<string> => {
    if (!mediaFile) throw new Error('Aucun fichier sélectionné');

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await StorageService.uploadFile(mediaFile, (progress) => {
        setUploadProgress(progress.percentage);
      });

      return result.url;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const createStory = async () => {
    if (!selectedProduct || !mediaFile) return;

    try {
      setLoading(true);
      setError(null);

      // Créer la story avec upload automatique
      await StoryService.createStoryWithFile(
        selectedProduct.id,
        mediaFile,
        caption.trim() || undefined,
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );

      onStoryCreated();
      onClose();
      resetForm();
    } catch (err) {
      console.error('Erreur lors de la création de la story:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('select-product');
    setSelectedProduct(null);
    setMediaFile(null);
    setMediaPreview(null);
    setCaption('');
    setError(null);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const nextStep = () => {
    if (step === 'select-product' && selectedProduct) {
      setStep('upload-media');
    } else if (step === 'upload-media' && mediaFile) {
      setStep('add-caption');
    }
  };

  const prevStep = () => {
    if (step === 'upload-media') {
      setStep('select-product');
    } else if (step === 'add-caption') {
      setStep('upload-media');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Créer une story</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-4">
              {/* Indicateur de progression */}
              <div className="flex space-x-2">
                {['select-product', 'upload-media', 'add-caption'].map((stepName, index) => (
                  <div
                    key={stepName}
                    className={`flex-1 h-2 rounded-full ${
                      step === stepName ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Erreur */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Étape 1: Sélection du produit */}
              {step === 'select-product' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Sélectionnez un produit</h3>
                  
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {userProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className={`w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                            selectedProduct?.id === product.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Image className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-gray-500 text-xs">{product.price.toFixed(2)} €</p>
                          </div>
                        </button>
                      ))}
                      
                      {userProducts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun produit trouvé</p>
                          <p className="text-sm">Créez d'abord un produit pour pouvoir faire des stories</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Étape 2: Upload du média */}
              {step === 'upload-media' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Ajoutez une image ou vidéo</h3>
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                  >
                    {mediaPreview ? (
                      <div className="space-y-4">
                        {mediaFile?.type.startsWith('video/') ? (
                          <video
                            src={mediaPreview}
                            className="max-w-full max-h-48 mx-auto rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={mediaPreview}
                            alt="Aperçu"
                            className="max-w-full max-h-48 mx-auto rounded-lg"
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaFile(null);
                            setMediaPreview(null);
                          }}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-gray-600">Cliquez pour sélectionner un fichier</p>
                        <p className="text-sm text-gray-400">Images et vidéos acceptés (max 50MB)</p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Étape 3: Ajout de la légende */}
              {step === 'add-caption' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Ajoutez une légende (optionnel)</h3>
                  
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Décrivez votre produit..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                    rows={4}
                    maxLength={200}
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Maximum 200 caractères</span>
                    <span>{caption.length}/200</span>
                  </div>

                  {/* Aperçu de la story */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Aperçu de votre story</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        Vous
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedProduct?.name}</p>
                        {caption && <p className="text-xs text-gray-600">{caption}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de progression d'upload */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Upload en cours...</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center">{Math.round(uploadProgress)}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={step === 'select-product'}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>

              {step === 'add-caption' ? (
                <button
                  onClick={createStory}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Publier</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 'select-product' && !selectedProduct) ||
                    (step === 'upload-media' && !mediaFile)
                  }
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
