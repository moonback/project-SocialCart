# Système de Stories Produits - Documentation Complète

## Vue d'ensemble

Le système de Stories Produits permet aux vendeurs de créer du contenu éphémère (24h) pour promouvoir leurs produits. Inspiré des stories Instagram/Snapchat, il offre une expérience immersive et interactive.

## Fonctionnalités Principales

### 1. Types de Stories Supportés

#### 📸 **Image**
- Upload d'images (JPEG, PNG, WebP)
- Description personnalisée
- Durée configurable (1-15 secondes)

#### 🎥 **Vidéo**
- Upload de vidéos (MP4, WebM, MOV)
- Lecture automatique en boucle
- Contrôles de lecture (play/pause, mute/unmute)

#### 📝 **Texte**
- Messages textuels personnalisés
- Couleurs de fond et texte configurables
- Tailles de police (petite, moyenne, grande)

#### 📊 **Sondage**
- Questions interactives
- Options multiples (2-6 choix)
- Résultats en temps réel
- Participation des utilisateurs

#### ❓ **Quiz**
- Questions avec bonne réponse
- Options multiples
- Statistiques de réussite
- Engagement interactif

### 2. Fonctionnalités Interactives

#### 👆 **Swipe Up**
- Action directe vers le produit
- Navigation fluide
- Tracking des interactions

#### 👀 **Suivi des Vues**
- Compteur de vues unique
- Statistiques détaillées
- Analytics en temps réel

#### ❤️ **Interactions**
- Likes et signets
- Partage sur réseaux sociaux
- Commentaires (à venir)

### 3. Gestion du Temps

#### ⏰ **Expiration Automatique**
- Durée de vie : 24 heures
- Suppression automatique
- Nettoyage périodique

#### 📈 **Statistiques Temps Réel**
- Vues totales et uniques
- Taux de completion
- Taux d'interaction
- Démographie des viewers

## Architecture Technique

### Base de Données

#### Table `product_stories`
```sql
- id (UUID, PK)
- product_id (UUID, FK vers products)
- seller_id (UUID, FK vers users)
- type (ENUM: image, video, text, poll, quiz)
- content (TEXT)
- media_url (TEXT)
- thumbnail_url (TEXT)
- duration (INTEGER, secondes)
- background_color (VARCHAR(7))
- text_color (VARCHAR(7))
- font_size (ENUM: small, medium, large)
- poll_options (JSONB)
- poll_results (JSONB)
- quiz_question (TEXT)
- quiz_options (JSONB)
- quiz_answer (TEXT)
- quiz_results (JSONB)
- views_count (INTEGER)
- interactions_count (INTEGER)
- created_at (TIMESTAMP)
- expires_at (TIMESTAMP)
- is_active (BOOLEAN)
```

#### Table `story_views`
```sql
- id (UUID, PK)
- story_id (UUID, FK vers product_stories)
- user_id (UUID, FK vers users)
- viewed_at (TIMESTAMP)
- interaction_type (ENUM: view, poll_vote, quiz_answer, swipe_up)
- interaction_data (JSONB)
```

#### Table `story_analytics`
```sql
- id (UUID, PK)
- story_id (UUID, FK vers product_stories)
- total_views (INTEGER)
- unique_viewers (INTEGER)
- completion_rate (DECIMAL)
- interaction_rate (DECIMAL)
- swipe_up_rate (DECIMAL)
- poll_participation_rate (DECIMAL)
- quiz_completion_rate (DECIMAL)
- demographics (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Composants React

#### `StoriesViewer`
- Lecteur principal des stories
- Navigation par swipe/tap
- Contrôles de lecture
- Overlay d'informations produit

#### `StoriesGrid`
- Grille d'affichage des stories
- Filtres par type
- Recherche textuelle
- Mode grille/liste

#### `StoryCreator`
- Créateur de stories multi-étapes
- Upload de médias
- Configuration des options
- Aperçu en temps réel

#### `ProductStories`
- Stories spécifiques à un produit
- Intégration dans la page produit
- Actions contextuelles

### Hooks

#### `useStories`
- Gestion des stories
- Actions interactives
- Chargement des données

#### `useStoryCreation`
- Création de stories
- Upload de fichiers
- Validation des données

## Utilisation

### Pour les Vendeurs

1. **Créer une Story**
   - Aller sur la page du produit
   - Cliquer sur "Créer une Story"
   - Choisir le type de contenu
   - Configurer les options
   - Publier

2. **Gérer les Stories**
   - Voir les statistiques
   - Supprimer si nécessaire
   - Créer de nouvelles stories

### Pour les Utilisateurs

1. **Consulter les Stories**
   - Page dédiée `/stories`
   - Stories dans les pages produits
   - Navigation fluide

2. **Interagir**
   - Swipe up pour voir le produit
   - Participer aux sondages/quiz
   - Partager avec d'autres

## Sécurité et Permissions

### Row Level Security (RLS)
- Stories publiques en lecture
- Création limitée aux vendeurs
- Modification/suppression par le propriétaire

### Validation des Données
- Types de fichiers autorisés
- Tailles limites (10MB)
- Durée maximale (15s)
- Contenu modéré

## Performance

### Optimisations
- Lazy loading des composants
- Cache des images/vidéos
- Pagination des stories
- Compression des médias

### Monitoring
- Analytics en temps réel
- Métriques de performance
- Alertes d'erreur

## Roadmap

### Phase 1 ✅ (Actuelle)
- Types de base (image, vidéo, texte)
- Système d'interaction
- Analytics de base

### Phase 2 🔄 (En cours)
- Sondages et quiz
- Amélioration des analytics
- Optimisations performance

### Phase 3 📋 (Prévue)
- Stories collaboratives
- Effets et filtres
- Intégration IA
- Stories sponsorisées

## Support et Maintenance

### Nettoyage Automatique
- Suppression des stories expirées
- Archivage des analytics
- Optimisation de la base

### Monitoring
- Logs d'erreur
- Métriques d'usage
- Alertes système

## Conclusion

Le système de Stories Produits offre une expérience moderne et engageante pour promouvoir les produits. Avec ses fonctionnalités interactives et son système d'analytics avancé, il permet aux vendeurs de créer du contenu viral et aux utilisateurs de découvrir des produits de manière immersive.

L'architecture modulaire et extensible permet d'ajouter facilement de nouvelles fonctionnalités et d'améliorer l'expérience utilisateur.
