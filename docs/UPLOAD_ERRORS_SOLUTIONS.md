# 🔧 Solutions aux Erreurs d'Upload

## 🚨 Problèmes Courants et Solutions

### 1. "Utilisateur non connecté"
**Symptômes :**
- Message "Non connecté" affiché
- Upload impossible

**Solutions :**
```javascript
// Vérifier dans la console
console.log('User:', user);
console.log('User ID:', user?.id);
```

**Actions :**
1. Se connecter avec un compte valide
2. Rafraîchir la page
3. Vérifier que la session est active

### 2. "Erreur d'upload: [message]"
**Symptômes :**
- Erreur lors de l'upload vers Supabase
- Message d'erreur spécifique

**Solutions par type d'erreur :**

#### "Bucket not found"
```sql
-- Exécuter dans Supabase SQL Editor
-- Copier le contenu de scripts/simple-storage-setup.sql
```

#### "Permission denied"
- Vérifier que l'utilisateur est authentifié
- Pour les produits : vérifier `is_seller = true`
- Vérifier les politiques RLS

#### "File too large"
- Images de profil : max 5MB
- Images de produits : max 10MB
- Stories : max 50MB

#### "Invalid file type"
- Types supportés : JPEG, PNG, WebP, GIF
- Vidéos : MP4, WebM

### 3. "Network error" ou "Connection failed"
**Symptômes :**
- Erreur de réseau
- Timeout

**Solutions :**
1. Vérifier la connexion internet
2. Vérifier la configuration Supabase
3. Réduire la taille du fichier
4. Réessayer l'upload

## 🛠️ Outil de Diagnostic

### Utiliser le Diagnostic Upload
1. Aller sur la page de profil (`/profile`)
2. Cliquer sur "Diagnostic Upload"
3. Sélectionner un fichier de test
4. Lancer le diagnostic
5. Analyser les résultats

### Interprétation des Résultats

#### ✅ Authentification OK
- Utilisateur connecté
- ID disponible
- Permissions correctes

#### ✅ Buckets OK
- Buckets créés
- Politiques configurées
- Permissions correctes

#### ✅ Upload OK
- Test d'upload réussi
- Fichier uploadé et supprimé

#### ❌ Erreurs Détectées
- Messages d'erreur spécifiques
- Solutions recommandées

## 🔍 Débogage Avancé

### Vérifier les Buckets Supabase
```sql
-- Dans Supabase SQL Editor
SELECT name, public, file_size_limit FROM storage.buckets;
```

### Vérifier les Politiques RLS
```sql
-- Dans Supabase SQL Editor
SELECT policyname, definition FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Tester l'Upload Manuel
```javascript
// Dans la console du navigateur
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const { data, error } = await supabase.storage
  .from('profiles')
  .upload('test.jpg', file);
console.log('Upload result:', { data, error });
```

## 📋 Checklist de Vérification

### ✅ Prérequis
- [ ] Utilisateur connecté
- [ ] Buckets Supabase créés
- [ ] Politiques RLS configurées
- [ ] Connexion internet stable

### ✅ Configuration
- [ ] Bucket `profiles` pour photos de profil
- [ ] Bucket `products` pour images de produits
- [ ] Bucket `stories` pour contenu stories
- [ ] Politiques de lecture publique
- [ ] Politiques d'upload authentifié

### ✅ Test
- [ ] Upload d'image de profil
- [ ] Upload d'image de produit (si vendeur)
- [ ] Upload de story (si vendeur)
- [ ] Validation des types de fichiers
- [ ] Validation des tailles de fichiers

## 🚀 Solutions Rapides

### Si l'upload ne fonctionne toujours pas :

1. **Exécuter le script de configuration**
   ```sql
   -- Copier scripts/simple-storage-setup.sql dans Supabase SQL Editor
   ```

2. **Vérifier l'authentification**
   - Se déconnecter et se reconnecter
   - Vérifier que le compte a les bonnes permissions

3. **Tester avec un fichier simple**
   - Image JPEG < 1MB
   - Nom de fichier simple (ex: test.jpg)

4. **Vérifier les logs**
   - Console du navigateur (F12)
   - Logs Supabase Dashboard

5. **Contacter le support**
   - Partager les messages d'erreur
   - Inclure les résultats du diagnostic

## 📞 Support

### Informations à Fournir
1. Message d'erreur exact
2. Type de fichier testé
3. Taille du fichier
4. Résultats du diagnostic
5. Logs de la console

### Fichiers de Log
- Console du navigateur
- Logs Supabase
- Résultats du diagnostic upload
