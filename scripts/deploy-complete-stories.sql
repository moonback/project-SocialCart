-- Script de déploiement complet du système de stories produit
-- À exécuter dans Supabase SQL Editor dans l'ordre suivant

-- ========================================
-- 1. CRÉATION DES TABLES PRINCIPALES
-- ========================================

-- Créer la table product_stories
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

-- Créer la table story_views
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

-- Créer la table story_interactions
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
-- 2. CONFIGURATION DU STORAGE
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
-- 3. INDEX POUR LES PERFORMANCES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_product_stories_seller_id ON public.product_stories(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_stories_expires_at ON public.product_stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_product_stories_active ON public.product_stories(is_active);
CREATE INDEX IF NOT EXISTS idx_product_stories_created_at ON public.product_stories(created_at);
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON public.story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewer_id ON public.story_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_story_interactions_story_id ON public.story_interactions(story_id);
CREATE INDEX IF NOT EXISTS idx_story_interactions_created_at ON public.story_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type_created_at ON public.notifications(type, created_at);

-- ========================================
-- 4. FONCTIONS PRINCIPALES
-- ========================================

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
    AND EXISTS (
      SELECT 1 FROM public.follows f 
      WHERE f.follower_id = user_uuid 
      AND f.following_id = ps.seller_id
    )
  ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Fonction pour nettoyer les stories expirées
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  UPDATE public.product_stories 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  DELETE FROM public.story_views 
  WHERE story_id IN (
    SELECT id FROM public.product_stories 
    WHERE expires_at < now() - interval '7 days'
  );
  
  DELETE FROM public.story_interactions 
  WHERE story_id IN (
    SELECT id FROM public.product_stories 
    WHERE expires_at < now() - interval '7 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_story_stats(user_uuid uuid)
RETURNS TABLE (
  total_stories integer,
  active_stories integer,
  total_views integer,
  total_likes integer,
  total_shares integer,
  total_product_clicks integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(ps.id)::integer as total_stories,
    COUNT(CASE WHEN ps.is_active = true AND ps.expires_at > now() THEN 1 END)::integer as active_stories,
    COALESCE(SUM(ps.views_count), 0)::integer as total_views,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'like' THEN 1 END), 0)::integer as total_likes,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'share' THEN 1 END), 0)::integer as total_shares,
    COALESCE(COUNT(CASE WHEN si.interaction_type = 'product_click' THEN 1 END), 0)::integer as total_product_clicks
  FROM public.product_stories ps
  LEFT JOIN public.story_interactions si ON ps.id = si.story_id
  WHERE ps.seller_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les stories populaires
CREATE OR REPLACE FUNCTION get_popular_stories(limit_count integer DEFAULT 10)
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
  views_count integer,
  likes_count bigint,
  shares_count bigint,
  created_at timestamp with time zone
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
    ps.views_count,
    COUNT(CASE WHEN si.interaction_type = 'like' THEN 1 END) as likes_count,
    COUNT(CASE WHEN si.interaction_type = 'share' THEN 1 END) as shares_count,
    ps.created_at
  FROM public.product_stories ps
  JOIN public.users u ON ps.seller_id = u.id
  JOIN public.products p ON ps.product_id = p.id
  LEFT JOIN public.story_interactions si ON ps.id = si.story_id
  WHERE ps.is_active = true 
    AND ps.expires_at > now()
  GROUP BY ps.id, u.username, u.avatar_url, p.name, p.primary_image_url, p.price
  ORDER BY (ps.views_count + COUNT(CASE WHEN si.interaction_type = 'like' THEN 1 END) * 2 + COUNT(CASE WHEN si.interaction_type = 'share' THEN 1 END) * 3) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 5. TRIGGERS ET NOTIFICATIONS
-- ========================================

-- Trigger pour mettre à jour automatiquement le compteur de vues
CREATE OR REPLACE FUNCTION update_story_views_count()
RETURNS trigger AS $$
BEGIN
  UPDATE public.product_stories 
  SET views_count = (
    SELECT COUNT(*) 
    FROM public.story_views 
    WHERE story_id = NEW.story_id
  )
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_story_views_count ON public.story_views;
CREATE TRIGGER trigger_update_story_views_count
  AFTER INSERT ON public.story_views
  FOR EACH ROW
  EXECUTE FUNCTION update_story_views_count();

-- Fonction pour créer une notification quand une nouvelle story est créée
CREATE OR REPLACE FUNCTION notify_new_story()
RETURNS trigger AS $$
DECLARE
  follower_record RECORD;
BEGIN
  FOR follower_record IN 
    SELECT follower_id FROM public.follows 
    WHERE following_id = NEW.seller_id
  LOOP
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      follower_record.follower_id,
      'new_story',
      'Nouvelle story',
      'Un utilisateur que vous suivez a publié une nouvelle story',
      jsonb_build_object(
        'story_id', NEW.id,
        'seller_id', NEW.seller_id,
        'seller_username', (SELECT username FROM public.users WHERE id = NEW.seller_id),
        'product_id', NEW.product_id,
        'product_name', (SELECT name FROM public.products WHERE id = NEW.product_id)
      )
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_story ON public.product_stories;
CREATE TRIGGER trigger_notify_new_story
  AFTER INSERT ON public.product_stories
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_story();

-- ========================================
-- 6. POLITIQUES RLS
-- ========================================

-- Activer RLS
ALTER TABLE public.product_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions ENABLE ROW LEVEL SECURITY;

-- Politiques pour product_stories
DROP POLICY IF EXISTS "Users can view stories from followed users" ON public.product_stories;
CREATE POLICY "Users can view stories from followed users" ON public.product_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() 
      AND following_id = seller_id
    ) OR seller_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create stories for their products" ON public.product_stories;
CREATE POLICY "Users can create stories for their products" ON public.product_stories
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own stories" ON public.product_stories;
CREATE POLICY "Users can view their own stories" ON public.product_stories
  FOR SELECT USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own stories" ON public.product_stories;
CREATE POLICY "Users can update their own stories" ON public.product_stories
  FOR UPDATE USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own stories" ON public.product_stories;
CREATE POLICY "Users can delete their own stories" ON public.product_stories
  FOR DELETE USING (seller_id = auth.uid());

-- Politiques pour story_views
DROP POLICY IF EXISTS "Users can view their own story views" ON public.story_views;
CREATE POLICY "Users can view their own story views" ON public.story_views
  FOR SELECT USING (viewer_id = auth.uid());

DROP POLICY IF EXISTS "Users can create story views" ON public.story_views;
CREATE POLICY "Users can create story views" ON public.story_views
  FOR INSERT WITH CHECK (viewer_id = auth.uid());

-- Politiques pour story_interactions
DROP POLICY IF EXISTS "Users can view their own story interactions" ON public.story_interactions;
CREATE POLICY "Users can view their own story interactions" ON public.story_interactions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create story interactions" ON public.story_interactions;
CREATE POLICY "Users can create story interactions" ON public.story_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Politiques pour le storage
DROP POLICY IF EXISTS "Stories media are publicly accessible" ON storage.objects;
CREATE POLICY "Stories media are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'stories-media');

DROP POLICY IF EXISTS "Users can upload their own story media" ON storage.objects;
CREATE POLICY "Users can upload their own story media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own story media" ON storage.objects;
CREATE POLICY "Users can update their own story media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own story media" ON storage.objects;
CREATE POLICY "Users can delete their own story media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ========================================
-- 7. RÈGLES DE LOYALTY POUR LES STORIES
-- ========================================

INSERT INTO public.loyalty_rules (action, points, daily_limit, per_object) VALUES
('create_story', 5, 3, true),
('view_story', 1, 10, true),
('like_story', 2, 20, true),
('share_story', 3, 5, true),
('product_click_from_story', 2, 15, true)
ON CONFLICT (action) DO NOTHING;

-- ========================================
-- 8. DONNÉES DE TEST (OPTIONNEL)
-- ========================================

-- Créer quelques stories de test si des produits existent
DO $$
DECLARE
  test_product_id uuid;
  test_seller_id uuid;
BEGIN
  -- Récupérer un produit et son vendeur
  SELECT id, seller_id INTO test_product_id, test_seller_id
  FROM public.products 
  WHERE status = 'active' 
  LIMIT 1;
  
  IF test_product_id IS NOT NULL THEN
    -- Créer une story de test
    INSERT INTO public.product_stories (
      seller_id,
      product_id,
      media_url,
      media_type,
      caption,
      expires_at
    ) VALUES (
      test_seller_id,
      test_product_id,
      'https://picsum.photos/400/600?random=1',
      'image',
      'Découvrez ce produit incroyable ! 🔥',
      now() + interval '24 hours'
    );
    
    RAISE NOTICE 'Story de test créée avec succès';
  ELSE
    RAISE NOTICE 'Aucun produit trouvé pour créer une story de test';
  END IF;
END $$;

-- ========================================
-- 9. MESSAGE DE CONFIRMATION
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SYSTÈME DE STORIES PRODUIT DÉPLOYÉ !';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables créées: product_stories, story_views, story_interactions';
  RAISE NOTICE 'Bucket storage: stories-media';
  RAISE NOTICE 'Fonctions créées: get_followed_users_stories, mark_story_as_viewed, etc.';
  RAISE NOTICE 'Triggers configurés: notifications automatiques, compteurs';
  RAISE NOTICE 'Politiques RLS: sécurité configurée';
  RAISE NOTICE 'Index créés: performances optimisées';
  RAISE NOTICE 'Règles de loyauté: points pour les stories';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Prochaines étapes:';
  RAISE NOTICE '1. Configurer les variables d''environnement';
  RAISE NOTICE '2. Déployer les composants React';
  RAISE NOTICE '3. Tester les fonctionnalités';
  RAISE NOTICE '========================================';
END $$;
