# Installation Manuelle - Système de Stories

## 🚨 Problème Actuel
Les erreurs 400/404/406 indiquent que le schéma de base de données n'a pas encore été exécuté.

## ✅ Solution Rapide (5 minutes)

### Étape 1: Ouvrir Supabase Dashboard
1. Aller sur [supabase.com](https://supabase.com)
2. Se connecter à votre compte
3. Sélectionner votre projet

### Étape 2: Exécuter le Schéma SQL
1. Dans le menu de gauche, cliquer sur **"SQL Editor"**
2. Cliquer sur **"New query"**
3. Copier tout le contenu du fichier `supabase/product_stories_schema.sql`
4. Coller dans l'éditeur SQL
5. Cliquer sur **"Run"** (ou Ctrl+Enter)

### Étape 3: Créer le Bucket de Stockage
1. Dans le menu de gauche, cliquer sur **"Storage"**
2. Cliquer sur **"New bucket"**
3. Nom: `stories`
4. Cocher **"Public bucket"**
5. Cliquer sur **"Create bucket"**

### Étape 4: Configurer les Politiques de Stockage
1. Dans Storage, cliquer sur le bucket `stories`
2. Aller dans l'onglet **"Policies"**
3. Cliquer sur **"New policy"**
4. Utiliser le template **"Give users access to upload files"**
5. Nom: `Allow authenticated uploads`
6. Cliquer sur **"Review"** puis **"Save policy"**

### Étape 5: Tester l'Application
1. Retourner sur votre application
2. Aller sur `/stories`
3. Cliquer sur **"Configurer le Système"**
4. Vérifier que tous les tests passent

## 📋 Vérifications

### Base de Données
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%stories%';
```

Résultat attendu:
- product_stories
- story_views  
- story_analytics

### Stockage
- Bucket `stories` visible dans Storage
- Politique d'upload configurée

### Application
- Page `/stories` accessible
- Bouton "Configurer le Système" fonctionne
- Tests passent avec succès

## 🐛 Résolution des Erreurs

### Erreur 400 (Bad Request)
- **Cause**: Tables manquantes
- **Solution**: Exécuter le schéma SQL

### Erreur 404 (Not Found)  
- **Cause**: Fonctions RPC manquantes
- **Solution**: Exécuter le schéma SQL

### Erreur 406 (Not Acceptable)
- **Cause**: Politiques RLS manquantes
- **Solution**: Exécuter le schéma SQL

### Erreur de Stockage
- **Cause**: Bucket manquant
- **Solution**: Créer le bucket `stories`

## 🎯 Test Final

Après l'installation:

1. **Créer une story de test**:
   - Aller sur `/stories`
   - Cliquer "Créer une Story"
   - Choisir "Texte"
   - Écrire "Test de story"
   - Publier

2. **Vérifier l'affichage**:
   - La story apparaît dans la grille
   - Cliquer dessus pour la voir
   - Vérifier les interactions

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifier les logs Supabase**:
   - Dashboard > Logs
   - Chercher les erreurs récentes

2. **Vérifier les permissions**:
   - S'assurer d'être connecté
   - Vérifier le rôle utilisateur

3. **Redémarrer l'application**:
   ```bash
   npm run dev
   ```

---

🎉 **Une fois terminé, votre système de Stories sera entièrement fonctionnel !**
