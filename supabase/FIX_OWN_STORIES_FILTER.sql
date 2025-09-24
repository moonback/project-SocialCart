-- =============================================
-- CORRECTION : EXCLURE SES PROPRES STORIES DU FEED
-- =============================================

-- Problème : Les stories de l'utilisateur apparaissent dans son propre feed
-- Solution : Ajouter une condition pour exclure ses propres stories

-- Mettre à jour la fonction get_followed_users_stories
CREATE OR REPLACE FUNCTION get_followed_users_stories(user_uuid uuid)
RETURNS TABLE (
  story_id uuid,
  seller_id uuid,
  seller_username character varying,
  seller_avatar_url text,
  product_id uuid,
  product_name character varying,
  product_image_url text,
  product_price numeric,
  media_url text,
  media_type character varying,
  caption text,
  expires_at timestamp with time zone,
  views_count integer,
  created_at timestamp with time zone,
  is_viewed boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id as story_id,
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
  FROM public.product_stories ps
  JOIN public.users u ON ps.seller_id = u.id
  JOIN public.products p ON ps.product_id = p.id
  LEFT JOIN public.story_views sv ON ps.id = sv.story_id AND sv.viewer_id = user_uuid
  WHERE ps.is_active = true 
    AND ps.expires_at > now()
    AND ps.seller_id != user_uuid  -- ✅ CORRECTION : Exclure ses propres stories
    AND EXISTS (
      SELECT 1 FROM public.follows f 
      WHERE f.follower_id = user_uuid 
      AND f.following_id = ps.seller_id
    )
  ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VÉRIFICATION
-- =============================================

-- Vérifier que la fonction a été mise à jour
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'get_followed_users_stories'
AND routine_schema = 'public';

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CORRECTION APPLIQUÉE !';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'La fonction get_followed_users_stories a été mise à jour';
  RAISE NOTICE 'Vos propres stories ne apparaîtront plus dans votre feed';
  RAISE NOTICE '========================================';
END $$;
