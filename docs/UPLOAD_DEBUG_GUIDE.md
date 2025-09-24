# Guide de Débogage - Problèmes d'Upload

## Problèmes Identifiés

### 1. "Utilisateur non sélectionné"
- **Cause** : L'utilisateur n'est pas connecté ou `userId` est undefined
- **Solution** : Vérifications ajoutées dans `ProfileImageUploader`

### 2. Upload ne fonctionne pas
- **Causes possibles** :
  - Bucket Supabase n'existe pas
  - Politiques RLS manquantes
  - Utilisateur non authentifié
  - Permissions insuffisantes

## Solutions Implémentées

### ✅ Vérifications d'Authentification
```typescript
// Dans ProfileImageUploader
if (!user || !userId) {
  setError('Utilisateur non connecté');
  return;
}
```

### ✅ Interface d'Erreur
- Affichage visuel si utilisateur non connecté
- Message d'erreur clair
- Icône d'alerte

### ✅ Script de Configuration
- `scripts/check-storage-buckets.sql`
- Création automatique des buckets
- Configuration des politiques RLS

## Étapes de Débogage

### 1. Vérifier l'Authentification
```javascript
// Dans la console du navigateur
console.log('User:', user);
console.log('User ID:', user?.id);
```

### 2. Vérifier les Buckets Supabase
```sql
-- Exécuter dans Supabase SQL Editor
-- Copier le contenu de scripts/check-storage-buckets.sql
```

### 3. Vérifier les Erreurs
- Ouvrir la console (F12)
- Chercher les erreurs d'upload
- Vérifier les messages d'erreur

### 4. Tester l'Upload
1. Se connecter avec un compte valide
2. Aller sur la page de profil
3. Cliquer sur l'upload d'image
4. Sélectionner une image
5. Vérifier les logs

## Buckets Requis

### Bucket `profiles`
- **Usage** : Photos de profil utilisateur
- **Taille max** : 5MB
- **Types** : JPEG, PNG, WebP, GIF
- **Accès** : Public en lecture, authentifié en écriture

### Bucket `products`
- **Usage** : Images et vidéos de produits
- **Taille max** : 10MB
- **Types** : JPEG, PNG, WebP, GIF, MP4, WebM
- **Accès** : Public en lecture, vendeurs en écriture

### Bucket `stories`
- **Usage** : Contenu des stories produits
- **Taille max** : 50MB
- **Types** : JPEG, PNG, WebP, GIF, MP4, WebM
- **Accès** : Public en lecture, vendeurs en écriture

## Politiques RLS

### Pour `profiles`
```sql
-- Lecture publique
CREATE POLICY "Profiles public read" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

-- Upload authentifié
CREATE POLICY "Profiles authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND auth.role() = 'authenticated'
);

-- Mise à jour propriétaire
CREATE POLICY "Profiles owner update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Tests à Effectuer

### Test 1: Authentification
- [ ] Utilisateur connecté
- [ ] User ID disponible
- [ ] Pas d'erreur "Non connecté"

### Test 2: Buckets
- [ ] Bucket `profiles` existe
- [ ] Politiques RLS configurées
- [ ] Permissions correctes

### Test 3: Upload
- [ ] Sélection de fichier fonctionne
- [ ] Validation du fichier
- [ ] Upload vers Supabase
- [ ] URL publique générée
- [ ] Mise à jour du profil

## Messages d'Erreur Courants

### "Utilisateur non connecté"
- **Solution** : Se connecter avec un compte valide

### "Erreur d'upload: [message]"
- **Solution** : Vérifier les permissions et le bucket

### "Fichier trop volumineux"
- **Solution** : Réduire la taille du fichier

### "Type de fichier non supporté"
- **Solution** : Utiliser JPEG, PNG, WebP ou GIF

## Commandes Utiles

### Vérifier les Buckets
```sql
SELECT name, public FROM storage.buckets;
```

### Vérifier les Politiques
```sql
SELECT bucket_id, name, definition FROM storage.policies;
```

### Tester l'Upload
```javascript
// Dans la console
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
// Tester l'upload...
```

## Prochaines Étapes

1. **Exécuter le script de configuration** des buckets
2. **Tester l'authentification** utilisateur
3. **Vérifier les permissions** Supabase
4. **Tester l'upload** d'image
5. **Vérifier les logs** d'erreur
