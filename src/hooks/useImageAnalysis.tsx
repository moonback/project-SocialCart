import { useState, useCallback } from 'react';
import { GeminiService, ProductAnalysisResult, ImageAnalysisOptions } from '../lib/gemini';
import toast from 'react-hot-toast';

export interface UseImageAnalysisReturn {
  isAnalyzing: boolean;
  analysisResult: ProductAnalysisResult | null;
  analyzeImages: (files: File[], options?: ImageAnalysisOptions) => Promise<ProductAnalysisResult | null>;
  clearAnalysis: () => void;
  error: string | null;
}

export function useImageAnalysis(): UseImageAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImages = useCallback(async (
    files: File[],
    options: ImageAnalysisOptions = {}
  ): Promise<ProductAnalysisResult | null> => {
    if (!files || files.length === 0) {
      setError('Aucune image fournie');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      toast.loading('Analyse de l\'image en cours...', { id: 'image-analysis' });

      const result = await GeminiService.analyzeMultipleImages(files, options);
      
      setAnalysisResult(result);
      toast.success('Analyse terminée avec succès!', { id: 'image-analysis' });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'image-analysis' });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    analyzeImages,
    clearAnalysis,
    error
  };
}
