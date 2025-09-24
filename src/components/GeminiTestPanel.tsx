import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { GeminiService } from '../lib/gemini';
import toast from 'react-hot-toast';

export function GeminiTestPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      toast.loading('Test de l\'analyse IA...', { id: 'gemini-test' });
      
      const analysisResult = await GeminiService.analyzeProductImage(file, {
        includePrice: true,
        includeBrand: true,
        includeCategory: true,
        language: 'fr'
      });

      setResult(analysisResult);
      toast.success('Analyse terminée!', { id: 'gemini-test' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'gemini-test' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center space-y-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Test de l'IA Gemini</h2>
        <p className="text-gray-600">
          Testez l'analyse automatique d'images avec l'API Gemini
        </p>
      </div>

      {/* Upload */}
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-semibold text-gray-700">
          Sélectionnez une image de produit
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isAnalyzing}
            className="hidden"
            id="test-upload"
          />
          <label
            htmlFor="test-upload"
            className={`cursor-pointer inline-block px-6 py-3 rounded-xl font-semibold transition-all ${
              isAnalyzing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
            }`}
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Choisir une image'}
          </label>
        </div>
      </div>

      {/* Résultats */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Analyse réussie</span>
            <span className="text-sm text-gray-500">
              (Confiance: {Math.round(result.confidence * 100)}%)
            </span>
          </div>

          <div className="grid gap-4">
            {result.name && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Nom du produit</h3>
                <p className="text-gray-900">{result.name}</p>
              </div>
            )}

            {result.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{result.description}</p>
              </div>
            )}

            {result.category && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Catégorie</h3>
                <p className="text-gray-900 capitalize">{result.category}</p>
              </div>
            )}

            {result.brand && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Marque</h3>
                <p className="text-gray-900">{result.brand}</p>
              </div>
            )}

            {result.price && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Prix estimé</h3>
                <p className="text-gray-900">{result.price} €</p>
              </div>
            )}

            {result.tags && result.tags.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Assurez-vous d'avoir configuré votre clé API Gemini</li>
          <li>• Utilisez des images de produits claires et bien éclairées</li>
          <li>• Les formats supportés sont JPG, PNG et WebP</li>
          <li>• La taille maximale est de 10MB</li>
        </ul>
      </div>
    </div>
  );
}
