# Implémentation du Système de Stories Produit

## Vue d'ensemble

Le système de stories produit permet aux vendeurs de créer des contenus éphémères (24h) pour promouvoir leurs produits auprès de leurs followers. Les stories incluent des images/vidéos, des légendes, et des interactions sociales.

## Architecture

### Base de données

#### Tables principales

1. **`product_stories`** - Stocke les stories
   - `id` (UUID) - Identifiant unique
   - `seller_id` (UUID) - Référence vers l'utilisateur vendeur
   - `product_id` (UUID) - Référence vers le produit
   - `media_url` (TEXT) - URL du média (image/vidéo)
   - `media_type` (ENUM) - 'image' ou 'video'
   - `caption` (TEXT) - Légende optionnelle
   - `expires_at` (TIMESTAMP) - Date d'expiration (24h)
   - `is_active` (BOOLEAN) - Statut actif/inactif
   - `views_count` (INTEGER) - Compteur de vues

2. **`story_views`** - Suivi des vues
   - `story_id` (UUID) - Référence vers la story
   - `viewer_id` (UUID) - Référence vers l'utilisateur qui a vu
   - `viewed_at` (TIMESTAMP) - Date de visualisation

3. **`story_interactions`** - Interactions (likes, partages, clics)
   - `story_id` (UUID) - Référence vers la story
   - `user_id` (UUID) - Référence vers l'utilisateur
   - `interaction_type` (ENUM) - 'like', 'share', 'product_click'

#### Fonctions SQL

- `get_followed_users_stories()` - Récupère les stories des utilisateurs suivis
- `mark_story_as_viewed()` - Marque une story comme vue
- `create_story_interaction()` - Crée une interaction
- `cleanup_expired_stories()` - Nettoie les stories expirées
- `get_user_story_stats()` - Statistiques d'un utilisateur
- `get_popular_stories()` - Stories les plus populaires

#### Triggers et Notifications

- Notifications automatiques lors de nouvelles stories
- Notifications pour les vues, likes, partages
- Mise à jour automatique des compteurs

### Services TypeScript

#### `StoryService` (`src/lib/stories.ts`)

```typescript
class StoryService {
  // Récupérer les stories des utilisateurs suivis
  static async getFollowedUsersStories(): Promise<ProductStory[]>
  
  // Créer une nouvelle story
  static async createStory(productId, mediaUrl, mediaType, caption?)
  
  // Marquer comme vue
  static async markStoryAsViewed(storyId: string)
  
  // Créer une interaction
  static async createStoryInteraction(storyId, interactionType)
  
  // Obtenir les statistiques
  static async getStoryStats(storyId: string)
  
  // Supprimer une story
  static async deleteStory(storyId: string)
  
  // Utilitaires
  static isStoryValid(story: ProductStory): boolean
  static getTimeUntilExpiration(story: ProductStory): number
  static formatTimeRemaining(milliseconds: number): string
}
```

### Hooks React

#### `useStories` (`src/hooks/useStories.tsx`)

```typescript
interface UseStoriesReturn {
  stories: ProductStory[];
  loading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
  markStoryAsViewed: (storyId: string) => Promise<void>;
  createStoryInteraction: (storyId: string, type: 'like' | 'share' | 'product_click') => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
}
```

#### `useStoryNotifications` (`src/hooks/useStoryNotifications.tsx`)

Gère les notifications en temps réel pour les stories.

### Composants UI

#### `StoriesBar` (`src/components/StoriesBar.tsx`)

Barre horizontale affichant les stories des utilisateurs suivis avec :
- Bouton de création de story
- Avatars des vendeurs avec indicateurs de nouvelles stories
- Temps restant avant expiration
- Badge du nombre de stories

#### `StoriesFeed` (`src/components/StoriesFeed.tsx`)

Interface plein écran pour visualiser les stories :
- Navigation entre stories (swipe/clic)
- Barre de progression automatique
- Actions (like, partage, voir produit)
- Informations du vendeur et du produit
- Modal des détails du produit

#### `CreateStoryModal` (`src/components/CreateStoryModal.tsx`)

Modal en 3 étapes pour créer une story :
1. Sélection du produit
2. Upload du média (image/vidéo)
3. Ajout de la légende

#### `UserStories` (`src/components/UserStories.tsx`)

Affichage des stories d'un utilisateur dans son profil :
- Grille des stories avec aperçus
- Statistiques de chaque story
- Actions de suppression (pour ses propres stories)

#### `StoryStats` (`src/components/StoryStats.tsx`)

Statistiques détaillées des stories d'un utilisateur :
- Stories actives
- Vues totales
- Likes, partages, clics produit
- Taux d'engagement

#### `PopularStories` (`src/components/PopularStories.tsx`)

Affichage des stories les plus populaires :
- Calcul du score d'engagement
- Tri par popularité
- Informations détaillées

## Fonctionnalités

### Création de Stories

1. **Sélection du produit** - L'utilisateur choisit parmi ses produits
2. **Upload du média** - Image ou vidéo (max 50MB)
3. **Ajout de légende** - Texte optionnel (max 200 caractères)
4. **Publication** - La story est visible pendant 24h

### Visualisation

1. **Feed des stories** - Stories des utilisateurs suivis
2. **Navigation** - Swipe ou clic pour changer de story
3. **Progression automatique** - Barre de progression basée sur le temps restant
4. **Marquage automatique** - Les stories sont marquées comme vues

### Interactions

1. **Like** - Aimer une story
2. **Partage** - Partager le lien du produit
3. **Clic produit** - Accéder aux détails du produit
4. **Vue** - Comptage automatique des vues

### Notifications

- **Nouvelle story** - Notification aux followers
- **Story vue** - Notification au propriétaire
- **Story aimée** - Notification au propriétaire
- **Story partagée** - Notification au propriétaire

### Statistiques

- **Vues** - Nombre de personnes ayant vu la story
- **Engagement** - Likes, partages, clics produit
- **Taux d'engagement** - Pourcentage d'interactions par rapport aux vues
- **Stories populaires** - Tri par score d'engagement

## Sécurité

### Row Level Security (RLS)

- Les utilisateurs ne peuvent voir que les stories des personnes qu'ils suivent
- Seuls les propriétaires peuvent créer des stories pour leurs produits
- Les utilisateurs ne peuvent voir que leurs propres interactions

### Validation

- Vérification du type de fichier (image/vidéo uniquement)
- Limitation de la taille (50MB max)
- Validation de la légende (200 caractères max)
- Vérification de l'expiration (24h)

## Performance

### Optimisations

- Index sur les colonnes fréquemment utilisées
- Nettoyage automatique des stories expirées
- Pagination des résultats
- Cache des statistiques

### Monitoring

- Compteurs de vues en temps réel
- Statistiques d'engagement
- Nettoyage périodique des données anciennes

## Utilisation

### Intégration dans l'application

1. **Page d'accueil** - Ajout de la `StoriesBar`
2. **Profil utilisateur** - Ajout de `UserStories` et `StoryStats`
3. **Page découverte** - Ajout de `PopularStories`

### Déploiement

1. Exécuter les scripts SQL dans Supabase
2. Configurer les politiques RLS
3. Déployer les composants React
4. Configurer l'upload de fichiers

## Maintenance

### Nettoyage automatique

- Stories expirées marquées comme inactives
- Suppression des données anciennes (>7 jours)
- Mise à jour des compteurs

### Monitoring

- Surveillance des performances
- Alertes en cas d'erreur
- Statistiques d'utilisation

## Extensions futures

- Stories avec plusieurs médias
- Stories avec liens directs
- Stories sponsorisées
- Analytics avancées
- Intégration avec les réseaux sociaux
