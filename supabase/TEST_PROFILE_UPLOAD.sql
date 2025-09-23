-- Test de l'upload de photo de profil
-- =============================================

-- 1. Vérifier que l'utilisateur a bien un profil dans la table users
-- =============================================
SELECT id, email, username, avatar_url, created_at 
FROM users 
WHERE id = auth.uid()
LIMIT 1;

-- 2. Vérifier que le bucket profiles existe
-- =============================================
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'profiles';

-- 3. Vérifier les politiques de storage
-- =============================================
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%profile%';

-- 4. Test de mise à jour de l'avatar_url (simulation)
-- =============================================
-- Cette requête ne sera exécutée que si vous êtes connecté
UPDATE users 
SET avatar_url = 'https://example.com/test-avatar.jpg',
    updated_at = NOW()
WHERE id = auth.uid()
RETURNING id, username, avatar_url;
