# Composant VideoFeed - Architecture Refactorisée

## Vue d'ensemble

Le composant VideoFeed a été refactorisé en plusieurs sous-composants modulaires pour améliorer la lisibilité, la maintenabilité et les performances.

## Structure

### Hooks personnalisés

#### `useVideoPlayer` 
- **Fichier**: `src/hooks/useVideoPlayer.tsx`
- **Responsabilité**: Gestion de l'état et des actions liées aux vidéos
- **Fonctionnalités**:
  - Contrôle de lecture/pause
  - Gestion du son (mute/unmute)
  - Vitesse de lecture
  - Sauvegarde des préférences dans localStorage
  - Référence aux éléments vidéo

#### `useVideoFeedModals`
- **Fichier**: `src/hooks/useVideoFeedModals.tsx`
- **Responsabilité**: Gestion de l'état des modales
- **Fonctionnalités**:
  - États de toutes les modales (commentaires, partage, actions, etc.)
  - Actions pour ouvrir/fermer les modales
  - Fonction de fermeture globale

#### `useVideoFeedScroll`
- **Fichier**: `src/hooks/useVideoFeedScroll.tsx`
- **Responsabilité**: Gestion optimisée du scroll avec throttling
- **Fonctionnalités**:
  - Détection de changement d'index avec throttling
  - Cleanup automatique des timeouts

### Services

#### `productService`
- **Fichier**: `src/services/productService.tsx`
- **Responsabilité**: Opérations liées aux produits
- **Fonctionnalités**:
  - Suppression de produit
  - Désactivation de produit
  - Signalement de produit

### Composants

#### `VideoPlayer`
- **Fichier**: `src/components/VideoFeed/VideoPlayer.tsx`
- **Responsabilité**: Affichage et contrôle des vidéos/images
- **Props**: Configuration complète de lecture vidéo

#### `ActionButtons`
- **Fichier**: `src/components/VideoFeed/ActionButtons.tsx`
- **Responsabilité**: Boutons d'action latéraux (like, menu, avatar)
- **Props**: Actions et état des interactions sociales

#### `ProductInfo`
- **Fichier**: `src/components/VideoFeed/ProductInfo.tsx`
- **Responsabilité**: Informations produit en bas de l'écran
- **Props**: Données produit et actions d'achat

#### `ActionsMenu`
- **Fichier**: `src/components/VideoFeed/ActionsMenu.tsx`
- **Responsabilité**: Menu modal avec toutes les actions possibles
- **Props**: État des actions et callbacks

#### `DeleteConfirmModal`
- **Fichier**: `src/components/VideoFeed/DeleteConfirmModal.tsx`
- **Responsabilité**: Modal de confirmation de suppression
- **Props**: Actions de suppression/désactivation

#### `InfoPanel`
- **Fichier**: `src/components/VideoFeed/InfoPanel.tsx`
- **Responsabilité**: Panel détaillé d'informations produit
- **Props**: Données produit et actions

#### `EmptyState`
- **Fichier**: `src/components/VideoFeed/EmptyState.tsx`
- **Responsabilité**: État vide quand aucun produit n'est disponible

## Avantages de la refactorisation

### 1. **Lisibilité améliorée**
- Code divisé en composants logiques de ~100-200 lignes
- Responsabilités claires et séparées
- JSX simplifié dans le composant principal

### 2. **Maintenabilité**
- Chaque composant peut être modifié indépendamment
- Tests unitaires plus faciles à écrire
- Debugging simplifié

### 3. **Performances optimisées**
- `useCallback` et `useMemo` utilisés stratégiquement
- Hooks personnalisés pour éviter les re-renders inutiles
- Throttling du scroll optimisé

### 4. **Réutilisabilité**
- Composants modulaires réutilisables
- Hooks personnalisés réutilisables dans d'autres contextes
- Service productService réutilisable

### 5. **Séparation des préoccupations**
- Logique métier dans les services
- État global dans les hooks personnalisés
- UI pure dans les composants
- Pas de logique Supabase dans les composants

## Migration

L'ancien fichier `VideoFeed.tsx` a été sauvegardé en tant que `VideoFeed.old.tsx` et peut être supprimé une fois que la nouvelle version est validée.

## Types

Tous les composants sont entièrement typés avec TypeScript pour une meilleure sécurité de type et une meilleure expérience développeur.
