import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle,
  Eye,
  Tag,
  Package,
  DollarSign
} from 'lucide-react';
import { useImageAnalysis } from '../hooks/useImageAnalysis';
import { ProductAnalysisResult } from '../lib/gemini';

interface ImageAnalysisPanelProps {
  imageFiles: File[];
  onApplyAnalysis: (result: ProductAnalysisResult) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ImageAnalysisPanel({ 
  imageFiles, 
  onApplyAnalysis, 
  onClose, 
  isOpen 
}: ImageAnalysisPanelProps) {
  const { isAnalyzing, analysisResult, analyzeImages, clearAnalysis, error } = useImageAnalysis();
  const [showPreview, setShowPreview] = useState(false);

  const handleAnalyze = async () => {
    if (imageFiles.length === 0) return;
    
    const result = await analyzeImages(imageFiles, {
      includePrice: true,
      includeBrand: true,
      includeCategory: true,
      language: 'fr'
    });
  };

  const handleApplyAnalysis = () => {
    if (analysisResult) {
      onApplyAnalysis(analysisResult);
      onClose();
    }
  };

  const handleReanalyze = () => {
    clearAnalysis();
    handleAnalyze();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Analyse IA des images</h2>
                <p className="text-sm text-blue-100">
                  {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} sélectionnée{imageFiles.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {!analysisResult && !isAnalyzing && !error && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto">
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Analyse automatique avec l'IA
                  </h3>
                  <p className="text-blue-100 mt-2">
                    Notre IA va analyser vos images pour extraire automatiquement :
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span>Nom du produit</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Tag className="w-4 h-4 text-blue-400" />
                    <span>Catégorie</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span>Marque</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-100 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <span>Prix estimé</span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all backdrop-blur-sm border border-blue-400/30"
                >
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Analyser les images
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Analyse en cours...
                  </h3>
                  <p className="text-blue-100 mt-2">
                    Notre IA analyse vos images. Cela peut prendre quelques secondes.
                  </p>
                </div>
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Erreur d'analyse
                  </h3>
                  <p className="text-red-100 mt-2">{error}</p>
                </div>
                <button
                  onClick={handleReanalyze}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all backdrop-blur-sm border border-red-400/30"
                >
                  Réessayer
                </button>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                {/* Résultat de l'analyse */}
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Check className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Analyse terminée</h3>
                    <span className="text-sm text-blue-100">
                      (Confiance: {Math.round(analysisResult.confidence * 100)}%)
                    </span>
                  </div>
                  <p className="text-sm text-blue-100">
                    L'IA a analysé vos images et propose les informations suivantes :
                  </p>
                </div>

                {/* Prévisualisation des résultats */}
                <div className="space-y-4">
                  {analysisResult.name && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-100">Nom du produit</label>
                      <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <span className="text-white">{analysisResult.name}</span>
                      </div>
                    </div>
                  )}

                  {analysisResult.description && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-100">Description</label>
                      <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <span className="text-white">{analysisResult.description}</span>
                      </div>
                    </div>
                  )}

                  {analysisResult.shortDescription && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-100">Description courte</label>
                      <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <span className="text-white">{analysisResult.shortDescription}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {analysisResult.category && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-100">Catégorie</label>
                        <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <span className="text-white capitalize">{analysisResult.category}</span>
                        </div>
                      </div>
                    )}

                    {analysisResult.brand && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-100">Marque</label>
                        <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <span className="text-white">{analysisResult.brand}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {analysisResult.price && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-100">Prix estimé</label>
                      <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                        <span className="text-white">{analysisResult.price} €</span>
                      </div>
                    </div>
                  )}

                  {analysisResult.tags && analysisResult.tags.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-blue-100">Tags suggérés</label>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 text-blue-200 text-sm rounded-full border border-blue-400/30 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-white/20">
                  <button
                    onClick={handleReanalyze}
                    className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Réanalyser
                  </button>
                  <button
                    onClick={handleApplyAnalysis}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all backdrop-blur-sm border border-blue-400/30"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Appliquer les suggestions
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
