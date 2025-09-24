# Intégration de l'IA Gemini pour l'analyse d'images

## Vue d'ensemble

Cette fonctionnalité permet d'analyser automatiquement les images de produits uploadées pour extraire automatiquement les informations suivantes :
- Nom du produit
- Description détaillée
- Description courte
- Catégorie
- Marque
- Prix estimé
- Tags pertinents

## Configuration

### 1. Obtenir une clé API Gemini

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Créez une nouvelle clé API
4. Copiez la clé générée

### 2. Configuration des variables d'environnement

Ajoutez la clé API dans votre fichier `.env` :

```env
VITE_GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### 3. Installation des dépendances

La dépendance `@google/generative-ai` est déjà installée dans le projet.

## Utilisation

### Dans le formulaire de création de produit

1. **Upload des images** : Uploadez vos images de produit comme d'habitude
2. **Analyse IA** : Cliquez sur le bouton "Analyser avec l'IA" qui apparaît après l'upload
3. **Révision des suggestions** : Le panel d'analyse s'ouvre avec les suggestions de l'IA
4. **Application** : Cliquez sur "Appliquer les suggestions" pour remplir automatiquement les champs

### Fonctionnalités du panel d'analyse

- **Analyse en temps réel** : L'IA analyse les images et propose des informations
- **Score de confiance** : Chaque suggestion inclut un score de confiance (0-100%)
- **Prévisualisation** : Vous pouvez voir toutes les suggestions avant de les appliquer
- **Réanalyse** : Possibilité de relancer l'analyse si les résultats ne conviennent pas
- **Application sélective** : Vous pouvez choisir quelles suggestions appliquer

## Architecture technique

### Services

#### `GeminiService` (`src/lib/gemini.ts`)
- Service principal pour l'interaction avec l'API Gemini
- Méthodes d'analyse d'images individuelles et multiples
- Parsing et validation des réponses JSON
- Combinaison de résultats d'analyses multiples

#### `useImageAnalysis` (`src/hooks/useImageAnalysis.tsx`)
- Hook React personnalisé pour gérer l'état de l'analyse
- Gestion des états de chargement, erreurs et résultats
- Intégration avec les notifications toast

### Composants

#### `ImageAnalysisPanel` (`src/components/ImageAnalysisPanel.tsx`)
- Interface utilisateur pour l'analyse IA
- Affichage des résultats avec score de confiance
- Actions d'application et de réanalyse
- Design responsive et animations

#### `MediaUploader` (modifié)
- Ajout du bouton "Analyser avec l'IA"
- Intégration avec le panel d'analyse
- Gestion des fichiers pour l'analyse

## Personnalisation

### Options d'analyse

Vous pouvez personnaliser l'analyse en modifiant les options dans `ImageAnalysisOptions` :

```typescript
interface ImageAnalysisOptions {
  includePrice?: boolean;      // Inclure l'estimation de prix
  includeBrand?: boolean;     // Inclure la détection de marque
  includeCategory?: boolean; // Inclure la catégorisation
  language?: 'fr' | 'en';    // Langue de la réponse
}
```

### Prompt d'analyse

Le prompt d'analyse peut être modifié dans `GeminiService.buildAnalysisPrompt()` pour :
- Changer le format de réponse
- Ajouter des instructions spécifiques
- Modifier les catégories disponibles
- Ajuster le niveau de détail

### Catégories supportées

Les catégories actuellement supportées sont :
- `electronics` - Électronique
- `fashion` - Mode & Accessoires
- `home` - Maison & Jardin
- `sports` - Sports & Loisirs
- `beauty` - Beauté & Santé
- `books` - Livres & Médias
- `toys` - Jouets & Jeux
- `other` - Autres

## Gestion des erreurs

### Types d'erreurs gérées

1. **Erreurs d'API** : Problèmes de connexion avec Gemini
2. **Erreurs de parsing** : Réponses JSON invalides
3. **Erreurs de validation** : Images non supportées
4. **Erreurs de quota** : Limites d'API dépassées

### Messages d'erreur

Tous les messages d'erreur sont affichés via des notifications toast et sont en français pour une meilleure expérience utilisateur.

## Performance

### Optimisations

- **Analyse en parallèle** : Les images multiples sont analysées simultanément
- **Cache des résultats** : Les résultats sont mis en cache pendant la session
- **Compression d'images** : Les images sont compressées avant l'envoi à l'API
- **Gestion des timeouts** : Timeouts appropriés pour éviter les blocages

### Limites

- **Taille des images** : Maximum 10MB par image
- **Nombre d'images** : Maximum 8 images par analyse
- **Types supportés** : JPG, PNG, WebP uniquement
- **Quota API** : Respecter les limites de l'API Gemini

## Sécurité

### Protection des données

- **Pas de stockage** : Les images ne sont pas stockées côté serveur
- **Transmission sécurisée** : Utilisation de HTTPS pour l'API
- **Validation** : Validation stricte des types de fichiers
- **Nettoyage** : Nettoyage automatique des URLs temporaires

### Clé API

- **Variables d'environnement** : La clé API est stockée dans les variables d'environnement
- **Pas d'exposition** : La clé n'est jamais exposée dans le code client
- **Rotation** : Possibilité de rotation des clés API

## Tests

### Tests recommandés

1. **Test avec différents types de produits**
2. **Test avec images de qualité variable**
3. **Test avec plusieurs images**
4. **Test des cas d'erreur**
5. **Test de performance avec de gros fichiers**

### Scénarios de test

- Produit électronique avec marque visible
- Produit de mode sans marque
- Produit artisanal unique
- Images de mauvaise qualité
- Images avec texte en plusieurs langues

## Maintenance

### Monitoring

- Surveiller l'utilisation de l'API Gemini
- Monitorer les taux d'erreur
- Analyser les performances d'analyse
- Collecter les retours utilisateurs

### Mises à jour

- Mise à jour régulière du SDK Gemini
- Amélioration des prompts d'analyse
- Ajout de nouvelles catégories
- Optimisation des performances

## Support

Pour toute question ou problème lié à l'intégration Gemini :

1. Vérifiez la configuration de la clé API
2. Consultez les logs de la console
3. Testez avec des images simples
4. Vérifiez les quotas de l'API Gemini
