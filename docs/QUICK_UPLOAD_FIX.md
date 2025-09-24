# 🚀 Correction Rapide - Problèmes d'Upload

## Problème Identifié
- ❌ "Utilisateur non sélectionné"
- ❌ Upload ne fonctionne pas
- ❌ Erreur `storage.policies` n'existe pas

## ✅ Solutions Appliquées

### 1. Vérifications d'Authentification
- Ajout de vérifications dans `ProfileImageUploader`
- Affichage d'erreur si utilisateur non connecté
- Interface visuelle claire

### 2. Script de Configuration Corrigé
- `scripts/simple-storage-setup.sql` - Version simplifiée
- Compatible avec toutes les versions Supabase
- Création automatique des buckets et politiques

## 🔧 Étapes de Correction

### Étape 1: Exécuter le Script de Configuration
```sql
-- Dans Supabase SQL Editor
-- Copier et exécuter le contenu de scripts/simple-storage-setup.sql
```

### Étape 2: Vérifier l'Authentification
1. Se connecter avec un compte valide
2. Aller sur la page de profil
3. Vérifier que l'upload d'image est disponible

### Étape 3: Tester l'Upload
1. Cliquer sur l'image de profil
2. Sélectionner une image (JPEG, PNG, WebP, GIF)
3. Vérifier que l'upload fonctionne

## 📋 Checklist de Vérification

### ✅ Authentification
- [ ] Utilisateur connecté
- [ ] User ID disponible
- [ ] Pas d'erreur "Non connecté"

### ✅ Buckets Supabase
- [ ] Bucket `profiles` créé
- [ ] Bucket `products` créé
- [ ] Bucket `stories` créé
- [ ] Politiques RLS configurées

### ✅ Interface
- [ ] Upload d'image visible
- [ ] Sélection de fichier fonctionne
- [ ] Validation du fichier
- [ ] Upload vers Supabase
- [ ] Image mise à jour

## 🐛 Messages d'Erreur Courants

### "Utilisateur non connecté"
**Solution** : Se connecter avec un compte valide

### "Erreur d'upload: [message]"
**Solution** : 
1. Vérifier que les buckets existent
2. Exécuter le script de configuration
3. Vérifier les permissions

### "Fichier trop volumineux"
**Solution** : 
- Images de profil : max 5MB
- Images de produits : max 10MB
- Stories : max 50MB

### "Type de fichier non supporté"
**Solution** : Utiliser JPEG, PNG, WebP ou GIF

## 🚨 Dépannage d'Urgence

### Si l'upload ne fonctionne toujours pas :

1. **Vérifier la console** (F12)
   ```javascript
   console.log('User:', user);
   console.log('User ID:', user?.id);
   ```

2. **Vérifier les buckets** dans Supabase Dashboard
   - Aller dans Storage
   - Vérifier que les buckets existent

3. **Vérifier les politiques** dans Supabase Dashboard
   - Aller dans Authentication > Policies
   - Vérifier les politiques de stockage

4. **Tester avec un fichier simple**
   - Image JPEG < 1MB
   - Nom de fichier simple (ex: test.jpg)

## 📞 Support

Si les problèmes persistent :
1. Vérifier les logs dans la console
2. Vérifier la configuration Supabase
3. Tester avec un compte vendeur (`is_seller = true`)

## 🎯 Résultat Attendu

Après correction :
- ✅ Upload d'image de profil fonctionnel
- ✅ Upload d'images de produits fonctionnel
- ✅ Upload de stories fonctionnel
- ✅ Interface utilisateur claire
- ✅ Messages d'erreur informatifs
