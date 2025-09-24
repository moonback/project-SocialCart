# 📸 Système de Stories Produit

## Vue d'ensemble

Le système de stories produit permet aux vendeurs de créer des contenus éphémères (24h) pour promouvoir leurs produits auprès de leurs followers. Inspiré des stories Instagram/Snapchat, cette fonctionnalité améliore l'engagement et les ventes.

## ✨ Fonctionnalités

### 🎯 Pour les Vendeurs
- **Création de stories** avec images/vidéos
- **Promotion de produits** avec liens directs
- **Statistiques détaillées** (vues, likes, partages)
- **Engagement en temps réel** avec les followers

### 👥 Pour les Utilisateurs
- **Découverte de produits** via les stories des vendeurs suivis
- **Contenu éphémère** (24h) pour créer l'urgence
- **Interactions sociales** (like, partage, clic produit)
- **Notifications** pour les nouvelles stories

## 🚀 Installation

### 1. Déploiement de la Base de Données

Exécutez le script SQL dans Supabase :

```sql
-- Exécuter dans Supabase SQL Editor
\i scripts/deploy-stories.sql
```

### 2. Configuration des Variables d'Environnement

Ajoutez à votre `.env` :

```env
# Upload de fichiers (exemple avec Supabase Storage)
VITE_SUPABASE_STORAGE_BUCKET=stories-media
VITE_MAX_FILE_SIZE=52428800  # 50MB
VITE_ALLOWED_FILE_TYPES=image/*,video/*
```

### 3. Intégration dans l'Application

#### Page d'Accueil
```tsx
import { StoriesBar } from '../components/StoriesBar';
import { CreateStoryModal } from '../components/CreateStoryModal';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <StoriesBar onCreateStory={() => setShowCreateStoryModal(true)} />
      {/* Votre contenu existant */}
    </div>
  );
}
```

#### Profil Utilisateur
```tsx
import { UserStories } from '../components/UserStories';
import { StoryStats } from '../components/StoryStats';

export default function Profile() {
  return (
    <div className="space-y-6">
      <StoryStats userId={userId} isOwnProfile={isOwn} />
      <UserStories userId={userId} isOwnProfile={isOwn} />
    </div>
  );
}
```

## 📱 Utilisation

### Créer une Story

1. **Cliquer sur le bouton "+"** dans la barre des stories
2. **Sélectionner un produit** parmi vos produits
3. **Uploader un média** (image ou vidéo, max 50MB)
4. **Ajouter une légende** (optionnel, max 200 caractères)
5. **Publier** - La story sera visible pendant 24h

### Visualiser les Stories

1. **Cliquer sur l'avatar** d'un vendeur dans la barre des stories
2. **Naviguer** avec les flèches ou en swipant
3. **Interagir** avec les boutons (like, partage, voir produit)
4. **Voir les détails** du produit en cliquant sur l'icône panier

## 🎨 Composants Disponibles

### `StoriesBar`
Barre horizontale avec les stories des utilisateurs suivis
```tsx
<StoriesBar onCreateStory={handleCreateStory} />
```

### `StoriesFeed`
Interface plein écran pour visualiser les stories
```tsx
<StoriesFeed 
  onClose={handleClose}
  initialStoryIndex={0}
/>
```

### `CreateStoryModal`
Modal pour créer une nouvelle story
```tsx
<CreateStoryModal
  isOpen={isOpen}
  onClose={handleClose}
  onStoryCreated={handleStoryCreated}
/>
```

### `UserStories`
Affichage des stories d'un utilisateur
```tsx
<UserStories 
  userId={userId}
  isOwnProfile={isOwn}
/>
```

### `StoryStats`
Statistiques des stories d'un utilisateur
```tsx
<StoryStats 
  userId={userId}
  isOwnProfile={isOwn}
/>
```

### `PopularStories`
Stories les plus populaires
```tsx
<PopularStories 
  limit={10}
  showHeader={true}
/>
```

## 🔧 API et Services

### `StoryService`
Service principal pour gérer les stories
```typescript
import { StoryService } from '../lib/stories';

// Récupérer les stories des utilisateurs suivis
const stories = await StoryService.getFollowedUsersStories();

// Créer une story
const story = await StoryService.createStory(
  productId,
  mediaUrl,
  'image',
  'Ma légende'
);

// Marquer comme vue
await StoryService.markStoryAsViewed(storyId);

// Créer une interaction
await StoryService.createStoryInteraction(storyId, 'like');
```

### Hooks React

#### `useStories`
```typescript
import { useStories } from '../hooks/useStories';

const { 
  stories, 
  loading, 
  error,
  refreshStories,
  markStoryAsViewed,
  createStoryInteraction,
  deleteStory
} = useStories();
```

#### `useStoryNotifications`
```typescript
import { useStoryNotifications } from '../hooks/useStoryNotifications';

const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead
} = useStoryNotifications();
```

## 📊 Statistiques et Analytics

### Métriques Disponibles
- **Vues** - Nombre de personnes ayant vu la story
- **Likes** - Nombre de likes reçus
- **Partages** - Nombre de partages
- **Clics produit** - Nombre de clics vers le produit
- **Taux d'engagement** - Pourcentage d'interactions par rapport aux vues

### Fonctions SQL Utilitaires
```sql
-- Statistiques d'un utilisateur
SELECT * FROM get_user_story_stats('user-uuid');

-- Stories populaires
SELECT * FROM get_popular_stories(10);

-- Statistiques globales
SELECT * FROM get_global_story_stats();

-- Tendances sur 7 jours
SELECT * FROM get_story_trends(7);
```

## 🔒 Sécurité

### Row Level Security (RLS)
- Les utilisateurs ne voient que les stories des personnes qu'ils suivent
- Seuls les propriétaires peuvent créer des stories pour leurs produits
- Les utilisateurs ne peuvent voir que leurs propres interactions

### Validation
- **Type de fichier** : Images et vidéos uniquement
- **Taille** : Maximum 50MB
- **Légende** : Maximum 200 caractères
- **Expiration** : 24h automatique

## 🚀 Performance

### Optimisations
- **Index** sur les colonnes fréquemment utilisées
- **Nettoyage automatique** des stories expirées
- **Pagination** des résultats
- **Cache** des statistiques

### Monitoring
- Compteurs de vues en temps réel
- Statistiques d'engagement
- Nettoyage périodique des données anciennes

## 🔔 Notifications

### Types de Notifications
- **Nouvelle story** - Notifie les followers
- **Story vue** - Notifie le propriétaire
- **Story aimée** - Notifie le propriétaire
- **Story partagée** - Notifie le propriétaire

### Configuration
Les notifications sont automatiquement créées via des triggers SQL et peuvent être personnalisées dans le composant de notifications.

## 🛠️ Maintenance

### Nettoyage Automatique
```sql
-- Nettoyer les données anciennes
SELECT cleanup_old_story_data();

-- Nettoyer les stories expirées
SELECT cleanup_expired_stories();
```

### Surveillance
- Surveillance des performances
- Alertes en cas d'erreur
- Statistiques d'utilisation

## 🔮 Extensions Futures

### Fonctionnalités Prévues
- **Stories multiples** - Plusieurs médias par story
- **Liens directs** - Liens vers des pages spécifiques
- **Stories sponsorisées** - Promotion payante
- **Analytics avancées** - Métriques détaillées
- **Intégration réseaux sociaux** - Partage automatique

### Améliorations Techniques
- **CDN** pour les médias
- **Compression** automatique des images/vidéos
- **Cache** intelligent
- **PWA** pour les notifications push

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation complète dans `docs/PRODUCT_STORIES_IMPLEMENTATION.md`
2. Vérifiez les logs de la base de données
3. Testez avec les données de démonstration

## 📄 Licence

Ce système de stories est intégré dans votre application existante et suit les mêmes conditions de licence.
