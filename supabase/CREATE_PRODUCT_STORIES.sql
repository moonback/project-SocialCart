-- Création de la table product_stories
CREATE TABLE public.product_stories (
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

-- Création de la table story_views pour tracker qui a vu quelle story
CREATE TABLE public.story_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL,
  viewer_id uuid NOT NULL,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT story_views_pkey PRIMARY KEY (id),
  CONSTRAINT story_views_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.product_stories(id) ON DELETE CASCADE,
  CONSTRAINT story_views_viewer_id_fkey FOREIGN KEY (viewer_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_story_view UNIQUE (story_id, viewer_id)
);

-- Création de la table story_interactions pour les likes, partages, etc.
CREATE TABLE public.story_interactions (
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

-- Index pour optimiser les requêtes
CREATE INDEX idx_product_stories_seller_id ON public.product_stories(seller_id);
CREATE INDEX idx_product_stories_expires_at ON public.product_stories(expires_at);
CREATE INDEX idx_product_stories_active ON public.product_stories(is_active);
CREATE INDEX idx_story_views_story_id ON public.story_views(story_id);
CREATE INDEX idx_story_views_viewer_id ON public.story_views(viewer_id);
CREATE INDEX idx_story_interactions_story_id ON public.story_interactions(story_id);

-- Fonction pour nettoyer automatiquement les stories expirées
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
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER trigger_update_story_views_count
  AFTER INSERT ON public.story_views
  FOR EACH ROW
  EXECUTE FUNCTION update_story_views_count();

-- RLS Policies
ALTER TABLE public.product_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions ENABLE ROW LEVEL SECURITY;

-- Policy pour les product_stories : les utilisateurs peuvent voir les stories des personnes qu'ils suivent
CREATE POLICY "Users can view stories from followed users" ON public.product_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() 
      AND following_id = seller_id
    ) OR seller_id = auth.uid()
  );

-- Policy pour créer des stories : seulement le propriétaire du produit
CREATE POLICY "Users can create stories for their products" ON public.product_stories
  FOR INSERT WITH CHECK (
    seller_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

-- Policy pour les story_views : les utilisateurs peuvent voir leurs propres vues
CREATE POLICY "Users can view their own story views" ON public.story_views
  FOR SELECT USING (viewer_id = auth.uid());

-- Policy pour créer des vues de story
CREATE POLICY "Users can create story views" ON public.story_views
  FOR INSERT WITH CHECK (viewer_id = auth.uid());

-- Policy pour les story_interactions
CREATE POLICY "Users can view their own story interactions" ON public.story_interactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create story interactions" ON public.story_interactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

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
