# Résolution des Erreurs Stories - Guide Rapide

## 🚨 Erreur 400 (Bad Request) - Tables manquantes

### Symptôme
```
POST https://tcjtlvmrndjcfexlaffk.supabase.co/rest/v1/product_stories 400 (Bad Request)
```

### Cause
Les tables de base de données pour les stories n'existent pas encore.

### Solution Rapide
1. **Aller sur `/stories`** dans votre application
2. **Cliquer sur "Configurer le Système"** (bouton vert)
3. **Attendre la configuration automatique**
4. **Cliquer sur "Lancer les Tests"** pour vérifier

### Solution Manuelle
1. Ouvrir Supabase Dashboard
2. Aller dans **SQL Editor**
3. Copier et exécuter le contenu de `supabase/product_stories_schema.sql`
4. Vérifier qu'il n'y a pas d'erreurs

## 🔧 Erreur d'Icônes PWA

### Symptôme
```
Error while trying to use the following icon from the Manifest: http://localhost:3000/icons/icon-144x144.png
```

### Solution
Cette erreur n'affecte pas les Stories. Voir `docs/PWA_ICONS_FIX.md` pour la correction complète.

## 📊 Erreur de Stockage

### Symptôme
```
Error uploading file to storage
```

### Solution
1. Aller dans Supabase Dashboard > **Storage**
2. Créer un bucket nommé `stories`
3. Activer l'accès public
4. Configurer les politiques de sécurité

## 🔐 Erreur de Permissions RLS

### Symptôme
```
Error: new row violates row-level security policy
```

### Solution
Les politiques RLS sont créées automatiquement avec le bouton "Configurer le Système".

## 🧪 Tests de Diagnostic

### Utiliser le Composant de Test
1. Aller sur `/stories`
2. Utiliser le composant de test (visible en mode développement)
3. Cliquer sur "Configurer le Système"
4. Cliquer sur "Lancer les Tests"
5. Vérifier les résultats

### Vérifications Manuelles

#### Base de Données
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%stories%';

-- Vérifier les politiques
SELECT tablename, policyname FROM pg_policies 
WHERE tablename LIKE '%stories%';
```

#### Stockage
```sql
-- Vérifier les buckets
SELECT * FROM storage.buckets WHERE id = 'stories';
```

## 🚀 Solution Complète en 3 Étapes

### Étape 1: Configuration Automatique
1. Aller sur `/stories`
2. Cliquer "Configurer le Système"
3. Attendre la fin de la configuration

### Étape 2: Test du Système
1. Cliquer "Lancer les Tests"
2. Vérifier que tous les tests passent
3. Corriger les erreurs si nécessaire

### Étape 3: Création de Stories
1. Cliquer "Créer une Story"
2. Tester la création d'une story simple
3. Vérifier l'affichage

## 📞 Support

Si les erreurs persistent :
1. Vérifier la console du navigateur
2. Vérifier les logs Supabase
3. S'assurer d'être connecté avec un compte vendeur
4. Vérifier les permissions de l'utilisateur

## ✅ Checklist de Vérification

- [ ] Tables créées (`product_stories`, `story_views`, `story_analytics`)
- [ ] Bucket `stories` créé dans Storage
- [ ] Politiques RLS configurées
- [ ] Fonctions RPC créées
- [ ] Utilisateur connecté et authentifié
- [ ] Permissions utilisateur correctes
- [ ] Tests passent avec succès

---

🎯 **Objectif** : Avoir un système de Stories entièrement fonctionnel en moins de 5 minutes !
