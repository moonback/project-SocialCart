# Guide d'Installation - Système de Stories Produits

## 🚀 Installation Rapide

### 1. Exécuter le Schéma SQL

1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Copiez et exécutez le contenu de `supabase/product_stories_schema.sql`
4. Vérifiez qu'il n'y a pas d'erreurs

### 2. Configurer le Stockage

1. Dans Supabase Dashboard, allez dans **Storage**
2. Créez un nouveau bucket nommé `stories`
3. Activez l'accès public
4. Ou exécutez le script `scripts/setup-stories.sql`

### 3. Tester le Système

1. Démarrez l'application : `npm run dev`
2. Connectez-vous avec un compte vendeur
3. Allez sur `/stories` pour voir la page des stories
4. Créez votre première story !

## 📋 Vérifications

### Base de Données
```sql
-- Vérifier que les tables sont créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%stories%';

-- Vérifier les stories d'exemple
SELECT * FROM product_stories WHERE is_active = true;
```

### Stockage
- Bucket `stories` créé ✅
- Politiques de sécurité configurées ✅
- Accès public activé ✅

### Application
- Route `/stories` accessible ✅
- Composant `ProductStories` intégré ✅
- Navigation mise à jour ✅

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
# Ajouter dans .env si nécessaire
VITE_SUPABASE_STORIES_BUCKET=stories
VITE_STORIES_MAX_DURATION=15
VITE_STORIES_MAX_FILE_SIZE=10485760
```

### Personnalisation
- Modifier les couleurs dans `src/components/StoryCreator.tsx`
- Ajuster les durées dans `src/lib/stories.ts`
- Personnaliser les animations dans `src/components/StoriesViewer.tsx`

## 🐛 Dépannage

### Erreur "Column does not exist"
- Vérifiez que le schéma SQL a été exécuté correctement
- Assurez-vous que la table `products` a la colonne `primary_image_url`

### Erreur de Stockage
- Vérifiez que le bucket `stories` existe
- Vérifiez les politiques RLS
- Assurez-vous que l'utilisateur est authentifié

### Stories ne s'affichent pas
- Vérifiez la console pour les erreurs
- Vérifiez que les stories ne sont pas expirées
- Vérifiez les permissions RLS

## 📊 Analytics

### Voir les Statistiques
```sql
-- Statistiques globales
SELECT 
  COUNT(*) as total_stories,
  SUM(views_count) as total_views,
  SUM(interactions_count) as total_interactions
FROM product_stories 
WHERE is_active = true;

-- Stories les plus populaires
SELECT 
  ps.content,
  p.name as product_name,
  ps.views_count,
  ps.interactions_count
FROM product_stories ps
JOIN products p ON ps.product_id = p.id
WHERE ps.is_active = true
ORDER BY ps.views_count DESC
LIMIT 10;
```

## 🎯 Prochaines Étapes

1. **Créer des Stories de Test**
   - Images avec descriptions
   - Vidéos courtes
   - Sondages interactifs

2. **Optimiser les Performances**
   - Compresser les images
   - Optimiser les vidéos
   - Mettre en cache les données

3. **Ajouter des Fonctionnalités**
   - Filtres avancés
   - Recherche par hashtags
   - Stories sponsorisées

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console
2. Consultez la documentation Supabase
3. Vérifiez les permissions RLS
4. Testez avec des données d'exemple

---

🎉 **Félicitations !** Votre système de Stories Produits est maintenant opérationnel !
