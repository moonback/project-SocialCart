import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration de l'API Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ProductAnalysisResult {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: number;
  tags?: string[];
  shortDescription?: string;
  confidence: number;
}

export interface ImageAnalysisOptions {
  includePrice?: boolean;
  includeBrand?: boolean;
  includeCategory?: boolean;
  language?: 'fr' | 'en';
}

export class GeminiService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Analyse une image de produit et extrait les informations automatiquement
   */
  static async analyzeProductImage(
    imageFile: File,
    options: ImageAnalysisOptions = {}
  ): Promise<ProductAnalysisResult> {
    try {
      const {
        includePrice = false,
        includeBrand = true,
        includeCategory = true,
        language = 'fr'
      } = options;

      // Convertir l'image en base64
      const imageData = await this.fileToBase64(imageFile);

      // Construire le prompt selon les options
      const prompt = this.buildAnalysisPrompt(includePrice, includeBrand, includeCategory, language);

      // Préparer les données pour l'API
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: imageFile.type,
        },
      };

      // Appeler l'API Gemini
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parser la réponse JSON
      return this.parseAnalysisResponse(text);
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      throw new Error('Impossible d\'analyser l\'image. Veuillez réessayer.');
    }
  }

  /**
   * Analyse plusieurs images et combine les résultats
   */
  static async analyzeMultipleImages(
    imageFiles: File[],
    options: ImageAnalysisOptions = {}
  ): Promise<ProductAnalysisResult> {
    try {
      if (imageFiles.length === 0) {
        throw new Error('Aucune image fournie');
      }

      // Analyser chaque image
      const analyses = await Promise.all(
        imageFiles.map(file => this.analyzeProductImage(file, options))
      );

      // Combiner les résultats (prendre les meilleures informations)
      return this.combineAnalysisResults(analyses);
    } catch (error) {
      console.error('Erreur lors de l\'analyse des images:', error);
      throw error;
    }
  }

  /**
   * Convertit un fichier en base64
   */
  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Retirer le préfixe data:image/...
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Construit le prompt d'analyse selon les options
   */
  private static buildAnalysisPrompt(
    includePrice: boolean,
    includeBrand: boolean,
    includeCategory: boolean,
    language: string
  ): string {
    const languageInstructions = language === 'fr' 
      ? 'Réponds en français et utilise des termes français.'
      : 'Respond in English and use English terms.';

    const priceInstruction = includePrice 
      ? 'Si tu peux identifier un prix ou une valeur approximative, inclus-la.'
      : 'Ne tente pas d\'estimer un prix.';

    return `
Tu es un expert en analyse d'images de produits e-commerce. ${languageInstructions}

Analyse cette image de produit et extrais les informations suivantes au format JSON :

{
  "name": "Nom du produit identifié",
  "description": "Description détaillée du produit basée sur ce que tu vois",
  "shortDescription": "Description courte en 1-2 phrases",
  "category": "Catégorie principale du produit (electronics, fashion, home, sports, beauty, books, toys, other)",
  "brand": "Marque identifiée (si visible)",
  "price": ${includePrice ? "prix estimé ou valeur approximative" : "null"},
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.85
}

Instructions spécifiques :
- ${priceInstruction}
- ${includeBrand ? 'Identifie la marque si elle est visible sur l\'image.' : 'Ignore les informations de marque.'}
- ${includeCategory ? 'Détermine la catégorie la plus appropriée parmi : electronics, fashion, home, sports, beauty, books, toys, other.' : 'Ignore la catégorisation.'}
- Génère des tags pertinents basés sur les caractéristiques visibles du produit
- Le score de confiance doit être entre 0 et 1 (1 = très confiant)
- Si une information n'est pas claire, utilise null ou une valeur par défaut appropriée
- Sois précis et factuel dans tes descriptions

Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire.
`;
  }

  /**
   * Parse la réponse JSON de l'API
   */
  private static parseAnalysisResponse(text: string): ProductAnalysisResult {
    try {
      // Nettoyer la réponse (enlever le markdown si présent)
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanedText);
      
      // Valider et nettoyer les données
      return {
        name: parsed.name || undefined,
        description: parsed.description || undefined,
        shortDescription: parsed.shortDescription || undefined,
        category: parsed.category || undefined,
        brand: parsed.brand || undefined,
        price: parsed.price || undefined,
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5))
      };
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse:', error);
      throw new Error('Réponse de l\'IA invalide. Veuillez réessayer.');
    }
  }

  /**
   * Combine plusieurs résultats d'analyse
   */
  private static combineAnalysisResults(analyses: ProductAnalysisResult[]): ProductAnalysisResult {
    if (analyses.length === 1) {
      return analyses[0];
    }

    // Prendre les meilleures informations de chaque analyse
    const combined: ProductAnalysisResult = {
      confidence: 0,
      tags: []
    };

    let totalConfidence = 0;
    const tagCounts: { [key: string]: number } = {};

    analyses.forEach(analysis => {
      totalConfidence += analysis.confidence;

      // Prendre le nom avec la plus haute confiance
      if (analysis.name && (!combined.name || analysis.confidence > combined.confidence)) {
        combined.name = analysis.name;
      }

      // Prendre la description avec la plus haute confiance
      if (analysis.description && (!combined.description || analysis.confidence > combined.confidence)) {
        combined.description = analysis.description;
      }

      // Prendre la description courte avec la plus haute confiance
      if (analysis.shortDescription && (!combined.shortDescription || analysis.confidence > combined.confidence)) {
        combined.shortDescription = analysis.shortDescription;
      }

      // Prendre la catégorie avec la plus haute confiance
      if (analysis.category && (!combined.category || analysis.confidence > combined.confidence)) {
        combined.category = analysis.category;
      }

      // Prendre la marque avec la plus haute confiance
      if (analysis.brand && (!combined.brand || analysis.confidence > combined.confidence)) {
        combined.brand = analysis.brand;
      }

      // Prendre le prix avec la plus haute confiance
      if (analysis.price && (!combined.price || analysis.confidence > combined.confidence)) {
        combined.price = analysis.price;
      }

      // Compter les tags
      analysis.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Calculer la confiance moyenne
    combined.confidence = totalConfidence / analyses.length;

    // Prendre les tags les plus fréquents
    combined.tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);

    return combined;
  }

  /**
   * Génère des suggestions de tags basées sur une description
   */
  static async generateTagsFromDescription(description: string): Promise<string[]> {
    try {
      const prompt = `
Génère 5-10 tags pertinents pour ce produit basé sur cette description :

"${description}"

Réponds uniquement avec un tableau JSON de tags :
["tag1", "tag2", "tag3", ...]

Les tags doivent être :
- En français
- Courts (1-3 mots)
- Pertinents pour le produit
- Utiles pour la recherche et la catégorisation
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const tags = JSON.parse(cleanedText);
      return Array.isArray(tags) ? tags : [];
    } catch (error) {
      console.error('Erreur lors de la génération de tags:', error);
      return [];
    }
  }
}
