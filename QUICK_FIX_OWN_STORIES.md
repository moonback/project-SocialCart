# 🚀 Correction Rapide : Exclure ses propres stories du feed

## 🎯 Problème
Vos propres stories apparaissent dans votre feed de stories, ce qui n'est pas souhaitable.

## ✅ Solution
Ajouter une condition dans la fonction `get_followed_users_stories` pour exclure vos propres stories.

## 🔧 Étapes de correction

### 1. Exécuter le script de correction
```sql
-- Dans Supabase SQL Editor, exécutez :
\i supabase/FIX_OWN_STORIES_FILTER.sql
```

### 2. Vérifier la correction
```sql
-- Testez que la correction fonctionne :
\i supabase/TEST_STORIES_FILTER.sql
```

### 3. Redémarrer l'application
- Rafraîchissez votre application web
- Vos propres stories ne devraient plus apparaître dans le feed

## 🔍 Détails techniques

### Avant (problématique)
```sql
WHERE ps.is_active = true 
  AND ps.expires_at > now()
  AND EXISTS (
    SELECT 1 FROM public.follows f 
    WHERE f.follower_id = user_uuid 
    AND f.following_id = ps.seller_id
  )
```

### Après (corrigé)
```sql
WHERE ps.is_active = true 
  AND ps.expires_at > now()
  AND ps.seller_id != user_uuid  -- ✅ Exclure ses propres stories
  AND EXISTS (
    SELECT 1 FROM public.follows f 
    WHERE f.follower_id = user_uuid 
    AND f.following_id = ps.seller_id
  )
```

## 🧪 Test
1. Créez une story sur un de vos produits
2. Vérifiez qu'elle n'apparaît pas dans votre feed principal
3. Vérifiez qu'elle apparaît bien dans votre profil ("Mes Stories")

## 📝 Notes
- Cette correction s'applique uniquement au feed principal
- Vos stories restent visibles dans votre profil
- Les autres utilisateurs peuvent toujours voir vos stories s'ils vous suivent
