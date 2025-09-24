-- Script minimal pour créer les fonctions essentielles des stories
-- À exécuter dans Supabase SQL Editor

-- ========================================
-- 1. CRÉER LES TABLES SI ELLES N'EXISTENT PAS
-- ========================================

-- Table product_stories
CREATE TABLE IF NOT EXISTS public.product_stories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  product_id uuid NOT NULL,
  media_url text NOT NULL,
  media_type character varying NOT NULL CHECK (media_type IN ('image', 'video')),
  caption text,
  expires_at timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_stories_pkey PRIMARY KEY (id),
  CONSTRAINT product_stories_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT product_stories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Table story_views
CREATE TABLE IF NOT EXISTS public.story_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL,
  viewer_id uuid NOT NULL,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT story_views_pkey PRIMARY KEY (id),
  CONSTRAINT story_views_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.product_stories(id) ON DELETE CASCADE,
  CONSTRAINT story_views_viewer_id_fkey FOREIGN KEY (viewer_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_story_view UNIQUE (story_id, viewer_id)
);

-- Table story_interactions
CREATE TABLE IF NOT EXISTS public.story_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL,
  user_id uuid NOT NULL,
  interaction_type character varying NOT NULL CHECK (interaction_type IN ('like', 'share', 'product_click')),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT story_interactions_pkey PRIMARY KEY (id),
  CONSTRAINT story_interactions_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.product_stories(id) ON DELETE CASCADE,
  CONSTRAINT story_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_story_interaction UNIQUE (story_id, user_id, interaction_type)
);

-- ========================================
-- 2. CRÉER LES FONCTIONS ESSENTIELLES
-- ========================================

-- Fonction pour marquer une story comme vue
CREATE OR REPLACE FUNCTION mark_story_as_viewed(story_uuid uuid, user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.story_views (story_id, viewer_id)
  VALUES (story_uuid, user_uuid)
  ON CONFLICT (story_id, viewer_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer une interaction avec une story
CREATE OR REPLACE FUNCTION create_story_interaction(
  story_uuid uuid, 
  user_uuid uuid, 
  interaction_type_param character varying
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.story_interactions (story_id, user_id, interaction_type)
  VALUES (story_uuid, user_uuid, interaction_type_param)
  ON CONFLICT (story_id, user_id, interaction_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les stories des utilisateurs suivis
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
    AND ps.seller_id != user_uuid  -- Exclure ses propres stories
    AND EXISTS (
      SELECT 1 FROM public.follows f 
      WHERE f.follower_id = user_uuid 
      AND f.following_id = ps.seller_id
    )
  ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 3. CONFIGURER RLS (PERMISSIF POUR LE DÉVELOPPEMENT)
-- ========================================

-- Désactiver RLS temporairement pour éviter les erreurs
ALTER TABLE public.product_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CRÉER LE BUCKET STORAGE
-- ========================================

-- Créer le bucket pour les médias des stories
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stories-media',
  'stories-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 5. MESSAGE DE CONFIRMATION
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SETUP MINIMAL STORIES TERMINÉ !';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables créées: product_stories, story_views, story_interactions';
  RAISE NOTICE 'Fonctions créées: mark_story_as_viewed, create_story_interaction, get_followed_users_stories';
  RAISE NOTICE 'RLS désactivé temporairement';
  RAISE NOTICE 'Bucket storage créé: stories-media';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Vous pouvez maintenant tester les stories !';
  RAISE NOTICE '========================================';
END $$;
