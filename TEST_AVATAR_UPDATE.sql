-- Test de mise à jour de l'avatar_url
-- =============================================

-- 1. Vérifier l'état actuel de l'utilisateur
SELECT id, username, email, avatar_url, updated_at 
FROM users 
WHERE id = auth.uid();

-- 2. Simuler une mise à jour de l'avatar_url
UPDATE users 
SET avatar_url = 'https://tcjtlvmrndjcfexlaffk.supabase.co/storage/v1/object/public/profiles/profiles/profile-test.jpg',
    updated_at = NOW()
WHERE id = auth.uid()
RETURNING id, username, avatar_url, updated_at;

-- 3. Vérifier que la mise à jour a bien été effectuée
SELECT id, username, email, avatar_url, updated_at 
FROM users 
WHERE id = auth.uid();
