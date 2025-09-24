# 🚀 Intégration de l'IA Gemini pour l'analyse d'images

## ✨ Fonctionnalités

Cette intégration permet d'analyser automatiquement les images de produits uploadées pour extraire :

- 📝 **Nom du produit** - Identification automatique du nom
- 📄 **Description détaillée** - Description complète basée sur l'image
- 📋 **Description courte** - Résumé en 1-2 phrases
- 🏷️ **Catégorie** - Classification automatique (électronique, mode, etc.)
- 🏢 **Marque** - Détection de la marque si visible
- 💰 **Prix estimé** - Estimation du prix basée sur l'image
- 🔖 **Tags** - Mots-clés pertinents pour la recherche

## 🛠️ Installation et Configuration

### 1. Installation des dépendances

```bash
npm install @google/generative-ai
```

### 2. Configuration de la clé API

1. **Obtenez une clé API Gemini** :
   - Visitez [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Connectez-vous avec votre compte Google
   - Créez une nouvelle clé API
   - Copiez la clé générée

2. **Ajoutez la clé dans votre fichier `.env`** :
   ```env
   VITE_GEMINI_API_KEY=votre_cle_api_gemini_ici
   ```

3. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🎯 Utilisation

### Dans le formulaire de création de produit

1. **Uploadez vos images** comme d'habitude
2. **Cliquez sur "Analyser avec l'IA"** qui apparaît après l'upload
3. **Révisez les suggestions** dans le panel d'analyse
4. **Appliquez les suggestions** pour remplir automatiquement les champs

### Page de test

Visitez `/test-gemini` pour tester l'intégration avec vos propres images.

## 🏗️ Architecture

### Services

- **`GeminiService`** (`src/lib/gemini.ts`) - Service principal pour l'API Gemini
- **`useImageAnalysis`** (`src/hooks/useImageAnalysis.tsx`) - Hook React pour gérer l'état

### Composants

- **`ImageAnalysisPanel`** - Interface d'analyse avec prévisualisation
- **`MediaUploader`** (modifié) - Ajout du bouton d'analyse IA
- **`GeminiTestPanel`** - Composant de test

### Types

```typescript
interface ProductAnalysisResult {
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  price?: number;
  tags?: string[];
  shortDescription?: string;
  confidence: number;
}
```

## 🎨 Interface utilisateur

### Panel d'analyse

- **Design moderne** avec animations Framer Motion
- **Score de confiance** pour chaque suggestion
- **Prévisualisation** des résultats avant application
- **Actions** : Appliquer, Réanalyser, Fermer

### Bouton d'analyse

- **Apparition conditionnelle** après l'upload d'images
- **Design attractif** avec gradient et icône Sparkles
- **Animation** au survol et au clic

## ⚙️ Personnalisation

### Options d'analyse

```typescript
interface ImageAnalysisOptions {
  includePrice?: boolean;      // Inclure l'estimation de prix
  includeBrand?: boolean;     // Inclure la détection de marque
  includeCategory?: boolean;  // Inclure la catégorisation
  language?: 'fr' | 'en';     // Langue de la réponse
}
```

### Catégories supportées

- `electronics` - Électronique
- `fashion` - Mode & Accessoires
- `home` - Maison & Jardin
- `sports` - Sports & Loisirs
- `beauty` - Beauté & Santé
- `books` - Livres & Médias
- `toys` - Jouets & Jeux
- `other` - Autres

## 🔧 Gestion des erreurs

### Types d'erreurs gérées

- **Erreurs d'API** - Problèmes de connexion avec Gemini
- **Erreurs de parsing** - Réponses JSON invalides
- **Erreurs de validation** - Images non supportées
- **Erreurs de quota** - Limites d'API dépassées

### Messages d'erreur

Tous les messages sont en français et affichés via des notifications toast.

## 📊 Performance

### Optimisations

- **Analyse en parallèle** des images multiples
- **Cache des résultats** pendant la session
- **Compression d'images** avant l'envoi
- **Timeouts appropriés** pour éviter les blocages

### Limites

- **Taille** : Maximum 10MB par image
- **Nombre** : Maximum 8 images par analyse
- **Types** : JPG, PNG, WebP uniquement
- **Quota** : Respecter les limites de l'API Gemini

## 🔒 Sécurité

- **Pas de stockage** des images côté serveur
- **Transmission sécurisée** via HTTPS
- **Validation stricte** des types de fichiers
- **Nettoyage automatique** des URLs temporaires

## 🧪 Tests

### Page de test

Visitez `/test-gemini` pour :
- Tester l'analyse avec vos images
- Vérifier la configuration
- Déboguer les problèmes

### Scénarios de test recommandés

- Produit électronique avec marque visible
- Produit de mode sans marque
- Produit artisanal unique
- Images de qualité variable
- Images avec texte multilingue

## 📚 Documentation complète

Consultez `docs/GEMINI_AI_INTEGRATION.md` pour la documentation technique complète.

## 🆘 Support

### Problèmes courants

1. **"Impossible d'analyser l'image"**
   - Vérifiez votre clé API Gemini
   - Vérifiez la connexion internet
   - Testez avec une image simple

2. **"Réponse de l'IA invalide"**
   - L'API a retourné un format inattendu
   - Réessayez avec une autre image
   - Vérifiez les quotas de l'API

3. **"Erreur lors de l'analyse"**
   - Problème de configuration de la clé API
   - Vérifiez le fichier `.env`
   - Redémarrez le serveur

### Debugging

1. Ouvrez les outils de développement (F12)
2. Vérifiez la console pour les erreurs
3. Testez avec la page `/test-gemini`
4. Vérifiez les variables d'environnement

## 🚀 Prochaines étapes

- [ ] Support de plus de langues
- [ ] Analyse de vidéos
- [ ] Intégration avec d'autres APIs IA
- [ ] Amélioration des prompts d'analyse
- [ ] Cache persistant des résultats
- [ ] Analytics d'utilisation

---

**Note** : Cette intégration nécessite une clé API Gemini valide. Assurez-vous de respecter les conditions d'utilisation de Google.
