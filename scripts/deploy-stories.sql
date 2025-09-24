-- Script de déploiement complet du système de stories produit
-- À exécuter dans Supabase SQL Editor

-- 1. Créer les tables principales
\i supabase/CREATE_PRODUCT_STORIES.sql

-- 2. Créer les notifications
\i supabase/CREATE_STORY_NOTIFICATIONS.sql

-- 3. Insérer des données de test (optionnel)
-- Créer quelques stories de test pour la démonstration
INSERT INTO public.product_stories (
  seller_id,
  product_id,
  media_url,
  media_type,
  caption,
  expires_at
) VALUES (
  (SELECT id FROM public.users WHERE is_seller = true LIMIT 1),
  (SELECT id FROM public.products WHERE status = 'active' LIMIT 1),
  'https://example.com/story-image.jpg',
  'image',
  'Découvrez ce produit incroyable ! 🔥',
  now() + interval '24 hours'
);

-- 4. Créer des règles de loyauté pour les stories
INSERT INTO public.loyalty_rules (action, points, daily_limit, per_object) VALUES
('create_story', 5, 3, true),
('view_story', 1, 10, true),
('like_story', 2, 20, true),
('share_story', 3, 5, true),
('product_click_from_story', 2, 15, true)
ON CONFLICT (action) DO NOTHING;

-- 5. Créer des index supplémentaires pour les performances
CREATE INDEX IF NOT EXISTS idx_product_stories_created_at ON public.product_stories(created_at);
CREATE INDEX IF NOT EXISTS idx_story_interactions_created_at ON public.story_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type_created_at ON public.notifications(type, created_at);

-- 6. Créer une vue pour les stories avec toutes les informations
CREATE OR REPLACE VIEW public.stories_with_details AS
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
  ps.is_active,
  CASE WHEN ps.expires_at > now() THEN true ELSE false END as is_valid
FROM public.product_stories ps
JOIN public.users u ON ps.seller_id = u.id
JOIN public.products p ON ps.product_id = p.id;

-- 7. Créer une fonction pour obtenir les stories d'un utilisateur spécifique
CREATE OR REPLACE FUNCTION get_user_stories(user_uuid uuid)
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
  WHERE ps.seller_id = user_uuid
    AND ps.is_active = true 
    AND ps.expires_at > now()
  ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Créer une fonction pour nettoyer les données anciennes
CREATE OR REPLACE FUNCTION cleanup_old_story_data()
RETURNS void AS $$
BEGIN
  -- Supprimer les stories expirées depuis plus de 7 jours
  DELETE FROM public.product_stories 
  WHERE expires_at < now() - interval '7 days';
  
  -- Supprimer les vues de stories supprimées
  DELETE FROM public.story_views 
  WHERE story_id NOT IN (SELECT id FROM public.product_stories);
  
  -- Supprimer les interactions de stories supprimées
  DELETE FROM public.story_interactions 
  WHERE story_id NOT IN (SELECT id FROM public.product_stories);
  
  -- Supprimer les notifications anciennes (>30 jours)
  DELETE FROM public.notifications 
  WHERE created_at < now() - interval '30 days'
    AND type IN ('new_story', 'story_viewed', 'story_liked', 'story_shared');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Créer un job de nettoyage automatique (si pg_cron est disponible)
-- SELECT cron.schedule('cleanup-stories', '0 2 * * *', 'SELECT cleanup_old_story_data();');

-- 10. Créer des politiques RLS supplémentaires
CREATE POLICY "Users can view their own stories" ON public.product_stories
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Users can update their own stories" ON public.product_stories
  FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Users can delete their own stories" ON public.product_stories
  FOR DELETE USING (seller_id = auth.uid());

-- 11. Créer une fonction pour obtenir les statistiques globales
CREATE OR REPLACE FUNCTION get_global_story_stats()
RETURNS TABLE (
  total_stories integer,
  active_stories integer,
  total_views integer,
  total_likes integer,
  total_shares integer,
  total_users_with_stories integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ps.id)::integer as total_stories,
    COUNT(CASE WHEN ps.is_active = true AND ps.expires_at > now() THEN 1 END)::integer as active_stories,
    COALESCE(SUM(ps.views_count), 0)::integer as total_views,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'like' THEN 1 END), 0)::integer as total_likes,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'share' THEN 1 END), 0)::integer as total_shares,
    COUNT(DISTINCT ps.seller_id)::integer as total_users_with_stories
  FROM public.product_stories ps
  LEFT JOIN public.story_interactions si ON ps.id = si.story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Créer une fonction pour obtenir les tendances
CREATE OR REPLACE FUNCTION get_story_trends(days_back integer DEFAULT 7)
RETURNS TABLE (
  date date,
  stories_created integer,
  total_views integer,
  total_likes integer,
  total_shares integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.created_at::date as date,
    COUNT(ps.id)::integer as stories_created,
    COALESCE(SUM(ps.views_count), 0)::integer as total_views,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'like' THEN 1 END), 0)::integer as total_likes,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'share' THEN 1 END), 0)::integer as total_shares
  FROM public.product_stories ps
  LEFT JOIN public.story_interactions si ON ps.id = si.story_id
  WHERE ps.created_at >= now() - (days_back || ' days')::interval
  GROUP BY ps.created_at::date
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Système de stories produit déployé avec succès !';
  RAISE NOTICE 'Tables créées: product_stories, story_views, story_interactions';
  RAISE NOTICE 'Fonctions créées: get_followed_users_stories, mark_story_as_viewed, create_story_interaction, etc.';
  RAISE NOTICE 'Triggers créés: notifications automatiques, mise à jour des compteurs';
  RAISE NOTICE 'Politiques RLS configurées pour la sécurité';
  RAISE NOTICE 'Index créés pour les performances';
  RAISE NOTICE 'Vues créées: stories_with_details';
  RAISE NOTICE 'Fonctions utilitaires: cleanup_old_story_data, get_global_story_stats, get_story_trends';
END $$;
