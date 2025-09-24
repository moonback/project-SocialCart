# 🚀 Guide d'Intégration - Système de Stories Produit

## 📋 Checklist de Déploiement

### ✅ 1. Base de Données
- [ ] Exécuter `scripts/deploy-complete-stories.sql` dans Supabase SQL Editor
- [ ] Vérifier que les tables sont créées
- [ ] Vérifier que les politiques RLS sont actives
- [ ] Tester les fonctions SQL

### ✅ 2. Configuration Supabase Storage
- [ ] Vérifier que le bucket `stories-media` est créé
- [ ] Configurer les politiques de stockage
- [ ] Tester l'upload d'un fichier

### ✅ 3. Variables d'Environnement
Ajouter à votre fichier `.env` :
```env
# Supabase (déjà configuré)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stories Storage
VITE_SUPABASE_STORAGE_BUCKET=stories-media
VITE_MAX_FILE_SIZE=52428800  # 50MB
VITE_ALLOWED_FILE_TYPES=image/*,video/*

# Stories Configuration
VITE_STORY_DURATION_HOURS=24
VITE_MAX_STORY_CAPTION_LENGTH=200
VITE_STORY_COMPRESSION_QUALITY=85
```

### ✅ 4. Composants Intégrés

#### Page d'Accueil (`src/pages/Home.tsx`)
✅ **DÉJÀ INTÉGRÉ** - Les composants sont déjà ajoutés :
- `StoriesBar` - Barre des stories
- `CreateStoryModal` - Modal de création

#### Page Profil (`src/pages/Profile.tsx`)
✅ **DÉJÀ INTÉGRÉ** - Ajouté pour les vendeurs :
- `StoryStats` - Statistiques des stories
- `UserStories` - Stories de l'utilisateur

#### Nouvelle Page Découverte (`src/pages/Discover.tsx`)
✅ **CRÉÉE** - Page avec stories populaires :
- `PopularStories` - Stories les plus populaires

### ✅ 5. Services et Hooks

#### Services Créés
- ✅ `src/lib/stories.ts` - Service principal des stories
- ✅ `src/lib/storage.ts` - Service d'upload de fichiers

#### Hooks Créés
- ✅ `src/hooks/useStories.tsx` - Hook pour les stories
- ✅ `src/hooks/useStoryNotifications.tsx` - Hook pour les notifications

#### Composants Créés
- ✅ `src/components/StoriesBar.tsx` - Barre des stories
- ✅ `src/components/StoriesFeed.tsx` - Interface plein écran
- ✅ `src/components/CreateStoryModal.tsx` - Modal de création
- ✅ `src/components/UserStories.tsx` - Stories utilisateur
- ✅ `src/components/StoryStats.tsx` - Statistiques
- ✅ `src/components/PopularStories.tsx` - Stories populaires

## 🔧 Configuration Supplémentaire

### 1. Ajouter la Route de Découverte

Dans votre fichier de routes (probablement `src/App.tsx` ou `src/main.tsx`) :

```tsx
import Discover from './pages/Discover';

// Ajouter la route
<Route path="/discover" element={<Discover />} />
```

### 2. Ajouter le Lien dans la Navigation

Dans `src/components/BottomNav.tsx` ou `src/components/TopBar.tsx` :

```tsx
import { TrendingUp } from 'lucide-react';

// Ajouter un bouton de découverte
<Link to="/discover" className="flex items-center space-x-2">
  <TrendingUp className="w-5 h-5" />
  <span>Découvrir</span>
</Link>
```

### 3. Configuration du Service ProductService

Vérifiez que `src/lib/products.ts` a une méthode `getUserProducts()` :

```typescript
static async getUserProducts(): Promise<Product[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Utilisateur non authentifié');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

## 🧪 Tests et Validation

### 1. Test de Création de Story
1. Se connecter en tant que vendeur
2. Aller sur la page d'accueil
3. Cliquer sur le bouton "+" dans la barre des stories
4. Sélectionner un produit
5. Uploader une image/vidéo
6. Ajouter une légende
7. Publier la story

### 2. Test de Visualisation
1. Se connecter en tant qu'utilisateur qui suit le vendeur
2. Voir la story dans la barre des stories
3. Cliquer pour ouvrir le feed des stories
4. Naviguer entre les stories
5. Tester les interactions (like, partage, clic produit)

### 3. Test des Statistiques
1. Aller sur le profil du vendeur
2. Vérifier les statistiques des stories
3. Voir la liste des stories créées

## 🐛 Dépannage

### Problèmes Courants

#### 1. Erreur "Bucket not found"
```sql
-- Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'stories-media';
```

#### 2. Erreur de permissions RLS
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'product_stories';
```

#### 3. Upload de fichier échoue
- Vérifier la taille du fichier (< 50MB)
- Vérifier le type de fichier (image/vidéo)
- Vérifier les permissions du bucket

#### 4. Stories ne s'affichent pas
- Vérifier que l'utilisateur suit le vendeur
- Vérifier que la story n'est pas expirée
- Vérifier les politiques RLS

### Logs de Debug

Ajouter dans `src/lib/stories.ts` :
```typescript
console.log('Stories chargées:', stories);
console.log('Utilisateur actuel:', user);
```

## 📊 Monitoring

### 1. Surveillance des Performances
- Surveiller la taille du bucket storage
- Surveiller les requêtes lentes
- Surveiller l'utilisation des fonctions SQL

### 2. Surveillance des Erreurs
- Surveiller les échecs d'upload
- Surveiller les erreurs de création de stories
- Surveiller les erreurs de notifications

### 3. Analytics
- Nombre de stories créées par jour
- Taux d'engagement des stories
- Stories les plus populaires

## 🚀 Optimisations Futures

### 1. Performance
- [ ] CDN pour les médias
- [ ] Compression automatique des vidéos
- [ ] Cache des statistiques
- [ ] Pagination des stories

### 2. Fonctionnalités
- [ ] Stories avec plusieurs médias
- [ ] Stories sponsorisées
- [ ] Analytics avancées
- [ ] Intégration réseaux sociaux

### 3. UX/UI
- [ ] Animations améliorées
- [ ] Mode sombre
- [ ] Accessibilité
- [ ] PWA notifications

## 📞 Support

En cas de problème :
1. Vérifier les logs de la console
2. Vérifier les logs Supabase
3. Tester avec des données de démonstration
4. Consulter la documentation Supabase

## ✅ Validation Finale

Avant de mettre en production :
- [ ] Toutes les fonctionnalités testées
- [ ] Performance validée
- [ ] Sécurité vérifiée
- [ ] Documentation mise à jour
- [ ] Backup de la base de données

---

🎉 **Félicitations !** Votre système de stories produit est maintenant intégré et prêt à l'emploi !
