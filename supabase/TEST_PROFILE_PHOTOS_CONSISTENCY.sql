-- Test de cohérence des photos de profil
-- =============================================

-- 1. Vérifier que tous les utilisateurs ont des avatar_url cohérents
-- =============================================
SELECT 
  id, 
  username, 
  email, 
  avatar_url,
  CASE 
    WHEN avatar_url IS NULL THEN 'Pas de photo'
    WHEN avatar_url LIKE '%unsplash%' THEN 'Photo par défaut'
    WHEN avatar_url LIKE '%supabase%' THEN 'Photo uploadée'
    ELSE 'Photo externe'
  END as photo_type,
  updated_at
FROM users 
ORDER BY updated_at DESC;

-- 2. Compter les types de photos
-- =============================================
SELECT 
  CASE 
    WHEN avatar_url IS NULL THEN 'Pas de photo'
    WHEN avatar_url LIKE '%unsplash%' THEN 'Photo par défaut'
    WHEN avatar_url LIKE '%supabase%' THEN 'Photo uploadée'
    ELSE 'Photo externe'
  END as photo_type,
  COUNT(*) as count
FROM users 
GROUP BY 
  CASE 
    WHEN avatar_url IS NULL THEN 'Pas de photo'
    WHEN avatar_url LIKE '%unsplash%' THEN 'Photo par défaut'
    WHEN avatar_url LIKE '%supabase%' THEN 'Photo uploadée'
    ELSE 'Photo externe'
  END;

-- 3. Vérifier les URLs de photos récentes
-- =============================================
SELECT 
  username,
  avatar_url,
  updated_at
FROM users 
WHERE avatar_url IS NOT NULL 
  AND updated_at > NOW() - INTERVAL '1 day'
ORDER BY updated_at DESC;
