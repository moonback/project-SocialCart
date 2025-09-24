-- Table des Stories Produits
CREATE TABLE IF NOT EXISTS product_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'text', 'poll', 'quiz')),
  content TEXT NOT NULL,
  media_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 5, -- en secondes
  background_color VARCHAR(7) DEFAULT '#000000',
  text_color VARCHAR(7) DEFAULT '#FFFFFF',
  font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  
  -- Données pour les sondages
  poll_options JSONB,
  poll_results JSONB DEFAULT '{}',
  
  -- Données pour les quiz
  quiz_question TEXT,
  quiz_options JSONB,
  quiz_answer TEXT,
  quiz_results JSONB DEFAULT '{}',
  
  -- Statistiques
  views_count INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Index
  CONSTRAINT valid_expires_at CHECK (expires_at > created_at)
);

-- Table des vues/interactions des stories
CREATE TABLE IF NOT EXISTS story_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES product_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interaction_type VARCHAR(20) CHECK (interaction_type IN ('view', 'poll_vote', 'quiz_answer', 'swipe_up')),
  interaction_data JSONB,
  
  -- Contrainte unique pour éviter les doublons
  UNIQUE(story_id, user_id, interaction_type)
);

-- Table des analytics des stories
CREATE TABLE IF NOT EXISTS story_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES product_stories(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  interaction_rate DECIMAL(5,2) DEFAULT 0.00,
  swipe_up_rate DECIMAL(5,2) DEFAULT 0.00,
  poll_participation_rate DECIMAL(5,2),
  quiz_completion_rate DECIMAL(5,2),
  demographics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_product_stories_product_id ON product_stories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stories_seller_id ON product_stories(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_stories_active ON product_stories(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_product_stories_created_at ON product_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_user_id ON story_views(user_id);
CREATE INDEX IF NOT EXISTS idx_story_analytics_story_id ON story_analytics(story_id);

-- Fonctions RPC pour les statistiques
CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE product_stories
  SET views_count = views_count + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_story_interactions(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE product_stories
  SET interactions_count = interactions_count + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_poll_vote(story_id UUID, option TEXT)
RETURNS void AS $$
DECLARE
  current_results JSONB;
BEGIN
  SELECT poll_results INTO current_results
  FROM product_stories
  WHERE id = story_id;
  
  IF current_results IS NULL THEN
    current_results := '{}';
  END IF;
  
  current_results := jsonb_set(
    current_results,
    ARRAY[option],
    COALESCE((current_results->>option)::integer, 0) + 1
  );
  
  UPDATE product_stories
  SET poll_results = current_results
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_quiz_answer(story_id UUID, answer TEXT)
RETURNS void AS $$
DECLARE
  current_results JSONB;
BEGIN
  SELECT quiz_results INTO current_results
  FROM product_stories
  WHERE id = story_id;
  
  IF current_results IS NULL THEN
    current_results := '{}';
  END IF;
  
  current_results := jsonb_set(
    current_results,
    ARRAY[answer],
    COALESCE((current_results->>answer)::integer, 0) + 1
  );
  
  UPDATE product_stories
  SET quiz_results = current_results
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les analytics
CREATE OR REPLACE FUNCTION update_story_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO story_analytics (story_id, total_views, unique_viewers, updated_at)
  VALUES (
    NEW.story_id,
    (SELECT views_count FROM product_stories WHERE id = NEW.story_id),
    (SELECT COUNT(DISTINCT user_id) FROM story_views WHERE story_id = NEW.story_id),
    NOW()
  )
  ON CONFLICT (story_id) DO UPDATE SET
    total_views = EXCLUDED.total_views,
    unique_viewers = EXCLUDED.unique_viewers,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_story_analytics
  AFTER INSERT ON story_views
  FOR EACH ROW
  EXECUTE FUNCTION update_story_analytics();

-- Politiques RLS
ALTER TABLE product_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_analytics ENABLE ROW LEVEL SECURITY;

-- Politiques pour product_stories
CREATE POLICY "Anyone can view active stories" ON product_stories
  FOR SELECT USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Sellers can create stories for their products" ON product_stories
  FOR INSERT WITH CHECK (
    auth.uid() = seller_id AND 
    EXISTS (SELECT 1 FROM products WHERE id = product_id AND seller_id = auth.uid())
  );

CREATE POLICY "Sellers can update their own stories" ON product_stories
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own stories" ON product_stories
  FOR DELETE USING (auth.uid() = seller_id);

-- Politiques pour story_views
CREATE POLICY "Anyone can view story views" ON story_views
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create story views" ON story_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own story views" ON story_views
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour story_analytics
CREATE POLICY "Sellers can view analytics for their stories" ON story_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM product_stories 
      WHERE id = story_id AND seller_id = auth.uid()
    )
  );

-- Fonction pour nettoyer les stories expirées (à exécuter périodiquement)
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  UPDATE product_stories
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Vue pour les stories avec informations complètes
CREATE OR REPLACE VIEW stories_with_details AS
SELECT 
  ps.*,
  p.name as product_name,
  p.price as product_price,
  p.image_url as product_image,
  u.username as seller_username,
  u.avatar_url as seller_avatar,
  u.is_verified as seller_verified,
  CASE 
    WHEN ps.expires_at < NOW() THEN 'expired'
    WHEN ps.expires_at < NOW() + INTERVAL '1 hour' THEN 'expiring_soon'
    ELSE 'active'
  END as status
FROM product_stories ps
JOIN products p ON ps.product_id = p.id
JOIN users u ON ps.seller_id = u.id
WHERE ps.is_active = true;
