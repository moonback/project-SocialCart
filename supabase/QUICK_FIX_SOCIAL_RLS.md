# 🔧 Correction Rapide des Politiques RLS Sociales

## 🚨 Problème identifié

L'erreur `new row violates row-level security policy for table "follows"` indique que les politiques RLS ne sont pas correctement configurées pour les tables sociales.

## ⚡ Solution Rapide

### 1. Exécuter le script de correction

Dans l'éditeur SQL de Supabase, exécuter le contenu de `FIX_ALL_SOCIAL_RLS.sql` :

```sql
-- Copier-coller tout le contenu du fichier FIX_ALL_SOCIAL_RLS.sql
```

### 2. Vérifier que les corrections sont appliquées

```sql
-- Vérifier les politiques créées
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('follows', 'likes', 'comments', 'shares')
ORDER BY tablename, policyname;
```

### 3. Tester la fonctionnalité

Après avoir appliqué les corrections, tester :
- ✅ Suivre un utilisateur
- ✅ Ne plus suivre un utilisateur  
- ✅ Liker un produit
- ✅ Ajouter un commentaire

## 📋 Politiques RLS appliquées

### Table `follows`
- **SELECT** : Tout le monde peut voir les relations de suivi
- **INSERT** : Un utilisateur peut suivre d'autres utilisateurs
- **DELETE** : Un utilisateur peut arrêter de suivre

### Table `likes`
- **SELECT** : Tout le monde peut voir les likes
- **ALL** : Un utilisateur peut gérer ses propres likes

### Table `comments`
- **SELECT** : Tout le monde peut voir les commentaires
- **INSERT** : Un utilisateur peut créer des commentaires
- **UPDATE** : Un utilisateur peut modifier ses commentaires
- **DELETE** : Un utilisateur peut supprimer ses commentaires

### Table `shares`
- **SELECT** : Tout le monde peut voir les partages
- **INSERT** : Un utilisateur peut créer ses propres partages

## 🔍 Debug en cas de problème

### Vérifier l'état des tables
```sql
-- Vérifier si RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('follows', 'likes', 'comments', 'shares');
```

### Vérifier les politiques
```sql
-- Voir toutes les politiques
SELECT * FROM pg_policies WHERE tablename = 'follows';
```

### Vérifier les contraintes
```sql
-- Voir les contraintes de la table
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'follows'::regclass;
```

## 🚀 Après la correction

Les fonctionnalités sociales devraient maintenant fonctionner :
- ✅ Bouton "Suivre" dans VideoFeed
- ✅ Système de likes sur les produits
- ✅ Commentaires sur les produits
- ✅ Partage de produits

## 📞 Support

Si les problèmes persistent, vérifier :
1. Que l'utilisateur est bien connecté (`auth.uid()` n'est pas NULL)
2. Que les IDs utilisateur sont valides (pas `undefined`)
3. Que les tables existent et ont les bonnes colonnes
