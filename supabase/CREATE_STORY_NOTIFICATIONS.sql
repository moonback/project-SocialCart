-- Fonction pour créer une notification quand une nouvelle story est créée
CREATE OR REPLACE FUNCTION notify_new_story()
RETURNS trigger AS $$
DECLARE
  follower_record RECORD;
BEGIN
  -- Récupérer tous les followers du vendeur
  FOR follower_record IN 
    SELECT follower_id FROM public.follows 
    WHERE following_id = NEW.seller_id
  LOOP
    -- Créer une notification pour chaque follower
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

-- Trigger pour déclencher la notification lors de la création d'une story
CREATE TRIGGER trigger_notify_new_story
  AFTER INSERT ON public.product_stories
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_story();

-- Fonction pour créer une notification quand une story est vue
CREATE OR REPLACE FUNCTION notify_story_viewed()
RETURNS trigger AS $$
BEGIN
  -- Créer une notification pour le propriétaire de la story
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
    'story_viewed',
    'Story vue',
    'Quelqu''un a regardé votre story',
    jsonb_build_object(
      'story_id', NEW.story_id,
      'seller_id', (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
      'seller_username', (SELECT username FROM public.users WHERE id = (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id)),
      'product_id', (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id),
      'product_name', (SELECT name FROM public.products WHERE id = (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id))
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour déclencher la notification lors de la visualisation d'une story
CREATE TRIGGER trigger_notify_story_viewed
  AFTER INSERT ON public.story_views
  FOR EACH ROW
  EXECUTE FUNCTION notify_story_viewed();

-- Fonction pour créer une notification quand une story est likée
CREATE OR REPLACE FUNCTION notify_story_liked()
RETURNS trigger AS $$
BEGIN
  -- Créer une notification pour le propriétaire de la story
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
    'story_liked',
    'Story aimée',
    'Quelqu''un a aimé votre story',
    jsonb_build_object(
      'story_id', NEW.story_id,
      'seller_id', (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
      'seller_username', (SELECT username FROM public.users WHERE id = (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id)),
      'product_id', (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id),
      'product_name', (SELECT name FROM public.products WHERE id = (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id))
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour déclencher la notification lors du like d'une story
CREATE TRIGGER trigger_notify_story_liked
  AFTER INSERT ON public.story_interactions
  FOR EACH ROW
  WHEN (NEW.interaction_type = 'like')
  EXECUTE FUNCTION notify_story_liked();

-- Fonction pour créer une notification quand une story est partagée
CREATE OR REPLACE FUNCTION notify_story_shared()
RETURNS trigger AS $$
BEGIN
  -- Créer une notification pour le propriétaire de la story
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
    'story_shared',
    'Story partagée',
    'Quelqu''un a partagé votre story',
    jsonb_build_object(
      'story_id', NEW.story_id,
      'seller_id', (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id),
      'seller_username', (SELECT username FROM public.users WHERE id = (SELECT seller_id FROM public.product_stories WHERE id = NEW.story_id)),
      'product_id', (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id),
      'product_name', (SELECT name FROM public.products WHERE id = (SELECT product_id FROM public.product_stories WHERE id = NEW.story_id))
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour déclencher la notification lors du partage d'une story
CREATE TRIGGER trigger_notify_story_shared
  AFTER INSERT ON public.story_interactions
  FOR EACH ROW
  WHEN (NEW.interaction_type = 'share')
  EXECUTE FUNCTION notify_story_shared();

-- Fonction pour obtenir les statistiques des stories d'un utilisateur
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

-- Fonction pour obtenir les stories les plus populaires
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
