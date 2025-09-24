-- =============================================
-- TEST : VÉRIFIER QUE VOS STORIES APPARAISSENT DANS LA BARRE
-- =============================================

-- Ce script teste que vos propres stories sont bien récupérées
-- pour être affichées dans la StoriesBar

-- 1. Vérifier vos propres stories actives
-- Remplacez 'your-user-uuid-here' par votre vrai UUID d'utilisateur
/*
SELECT 
  ps.id,
  ps.seller_id,
  u.username as seller_username,
  p.name as product_name,
  ps.media_type,
  ps.expires_at,
  ps.created_at,
  CASE 
    WHEN ps.expires_at > now() THEN '✅ Active'
    ELSE '❌ Expirée'
  END as status
FROM product_stories ps
JOIN users u ON ps.seller_id = u.id
JOIN products p ON ps.product_id = p.id
WHERE ps.seller_id = 'your-user-uuid-here'
  AND ps.is_active = true
ORDER BY ps.created_at DESC;
*/

-- 2. Vérifier la fonction getAllStoriesForBar (simulation)
-- Cette requête simule ce que fait la nouvelle fonction
/*
WITH followed_stories AS (
  SELECT 
    ps.id,
    ps.seller_id,
    u.username as seller_username,
    u.avatar_url as seller_avatar_url,
    ps.product_id,
    p.name as product_name,
    p.primary_image_url as product_image_url,
    p.price as product_price,
    ps.media_url,
    ps.media_type,
    ps.caption,
    ps.expires_at,
    ps.views_count,
    ps.created_at,
    CASE WHEN sv.id IS NOT NULL THEN true ELSE false END as is_viewed
  FROM product_stories ps
  JOIN users u ON ps.seller_id = u.id
  JOIN products p ON ps.product_id = p.id
  LEFT JOIN story_views sv ON ps.id = sv.story_id AND sv.viewer_id = 'your-user-uuid-here'
  WHERE ps.is_active = true 
    AND ps.expires_at > now()
    AND ps.seller_id != 'your-user-uuid-here'  -- Exclure ses propres stories
    AND EXISTS (
      SELECT 1 FROM follows f 
      WHERE f.follower_id = 'your-user-uuid-here' 
      AND f.following_id = ps.seller_id
    )
),
own_stories AS (
  SELECT 
    ps.id,
    ps.seller_id,
    u.username as seller_username,
    u.avatar_url as seller_avatar_url,
    ps.product_id,
    p.name as product_name,
    p.primary_image_url as product_image_url,
    p.price as product_price,
    ps.media_url,
    ps.media_type,
    ps.caption,
    ps.expires_at,
    ps.views_count,
    ps.created_at,
    true as is_viewed  -- Ses propres stories sont considérées comme vues
  FROM product_stories ps
  JOIN users u ON ps.seller_id = u.id
  JOIN products p ON ps.product_id = p.id
  WHERE ps.seller_id = 'your-user-uuid-here'
    AND ps.is_active = true
    AND ps.expires_at > now()
)
SELECT 
  'Suivis' as source,
  seller_username,
  product_name,
  created_at
FROM followed_stories
UNION ALL
SELECT 
  'Mes stories' as source,
  seller_username,
  product_name,
  created_at
FROM own_stories
ORDER BY created_at DESC;
*/

-- 3. Vérifier les tables nécessaires
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'product_stories' THEN '✅ Table des stories'
    WHEN table_name = 'users' THEN '✅ Table des utilisateurs'
    WHEN table_name = 'products' THEN '✅ Table des produits'
    WHEN table_name = 'follows' THEN '✅ Table des suivis'
    WHEN table_name = 'story_views' THEN '✅ Table des vues'
    ELSE 'ℹ️ Table supplémentaire'
  END as table_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('product_stories', 'users', 'products', 'follows', 'story_views')
ORDER BY table_name;

-- 4. Compter vos stories actives
-- Remplacez 'your-user-uuid-here' par votre vrai UUID d'utilisateur
/*
SELECT 
  COUNT(*) as total_stories,
  COUNT(CASE WHEN expires_at > now() THEN 1 END) as active_stories,
  COUNT(CASE WHEN expires_at <= now() THEN 1 END) as expired_stories
FROM product_stories 
WHERE seller_id = 'your-user-uuid-here'
  AND is_active = true;
*/

-- 5. Message de test
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST DES STORIES DANS LA BARRE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. Décommentez les requêtes ci-dessus';
  RAISE NOTICE '2. Remplacez ''your-user-uuid-here'' par votre UUID';
  RAISE NOTICE '3. Vérifiez que vos stories apparaissent';
  RAISE NOTICE '4. Vos stories devraient maintenant être visibles dans StoriesBar';
  RAISE NOTICE '========================================';
END $$;
