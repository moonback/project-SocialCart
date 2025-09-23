-- =============================================
-- TABLES POUR ACTIONS SOCIALES - SHOPPING CONNECT
-- =============================================

-- 1. TABLE PRODUCT_LIKES (Likes de produits)
-- =============================================
CREATE TABLE product_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 2. TABLE PRODUCT_SHARES (Partages de produits)
-- =============================================
CREATE TABLE product_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform VARCHAR(50), -- 'facebook', 'twitter', 'instagram', 'whatsapp', 'copy_link'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE PRODUCT_VIEWS (Vues de produits)
-- =============================================
CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL pour utilisateurs anonymes
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- Pour les utilisateurs non connectés
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE PRODUCT_COMMENTS (Commentaires sur produits)
-- =============================================
CREATE TABLE product_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES product_comments(id) ON DELETE CASCADE, -- Pour les réponses
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE COMMENT_LIKES (Likes de commentaires)
-- =============================================
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES product_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

-- =============================================
-- INDEXES POUR LES PERFORMANCES
-- =============================================

-- Indexes pour product_likes
CREATE INDEX idx_product_likes_user_id ON product_likes(user_id);
CREATE INDEX idx_product_likes_product_id ON product_likes(product_id);
CREATE INDEX idx_product_likes_created_at ON product_likes(created_at);

-- Indexes pour product_shares
CREATE INDEX idx_product_shares_user_id ON product_shares(user_id);
CREATE INDEX idx_product_shares_product_id ON product_shares(product_id);
CREATE INDEX idx_product_shares_platform ON product_shares(platform);

-- Indexes pour product_views
CREATE INDEX idx_product_views_user_id ON product_views(user_id);
CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_session_id ON product_views(session_id);
CREATE INDEX idx_product_views_created_at ON product_views(created_at);

-- Indexes pour product_comments
CREATE INDEX idx_product_comments_user_id ON product_comments(user_id);
CREATE INDEX idx_product_comments_product_id ON product_comments(product_id);
CREATE INDEX idx_product_comments_parent_id ON product_comments(parent_id);
CREATE INDEX idx_product_comments_created_at ON product_comments(created_at);

-- Indexes pour comment_likes
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);

-- =============================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE DES COMPTEURS
-- =============================================

-- Fonction pour mettre à jour le compteur de likes
CREATE OR REPLACE FUNCTION update_product_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products 
        SET likes_count = GREATEST(likes_count - 1, 0) 
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour product_likes
CREATE TRIGGER trigger_update_product_likes_count
    AFTER INSERT OR DELETE ON product_likes
    FOR EACH ROW EXECUTE FUNCTION update_product_likes_count();

-- Fonction pour mettre à jour le compteur de vues
CREATE OR REPLACE FUNCTION update_product_views_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le compteur de vues (seulement pour les nouvelles vues uniques)
    UPDATE products 
    SET views_count = views_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour product_views (seulement sur INSERT)
CREATE TRIGGER trigger_update_product_views_count
    AFTER INSERT ON product_views
    FOR EACH ROW EXECUTE FUNCTION update_product_views_count();

-- Fonction pour mettre à jour le compteur de commentaires
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE product_comments 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE product_comments 
        SET likes_count = GREATEST(likes_count - 1, 0) 
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour comment_likes
CREATE TRIGGER trigger_update_comment_likes_count
    AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- =============================================
-- POLITIQUES RLS (Row Level Security)
-- =============================================

-- Activer RLS sur toutes les tables sociales
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Politiques pour product_likes
CREATE POLICY "Users can view all product likes" ON product_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON product_likes FOR ALL USING (auth.uid() = user_id);

-- Politiques pour product_shares
CREATE POLICY "Users can view all product shares" ON product_shares FOR SELECT USING (true);
CREATE POLICY "Users can create their own shares" ON product_shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour product_views
CREATE POLICY "Anyone can create product views" ON product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own views" ON product_views FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Politiques pour product_comments
CREATE POLICY "Anyone can view approved comments" ON product_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create comments" ON product_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON product_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON product_comments FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour comment_likes
CREATE POLICY "Users can view all comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment likes" ON comment_likes FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour vérifier si un utilisateur a liké un produit
CREATE OR REPLACE FUNCTION has_user_liked_product(p_user_id UUID, p_product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM product_likes 
        WHERE user_id = p_user_id AND product_id = p_product_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur suit un autre utilisateur
CREATE OR REPLACE FUNCTION is_user_following(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = p_follower_id AND following_id = p_following_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques sociales d'un produit
CREATE OR REPLACE FUNCTION get_product_social_stats(p_product_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'likes_count', COALESCE(pl.likes_count, 0),
        'shares_count', COALESCE(ps.shares_count, 0),
        'comments_count', COALESCE(pc.comments_count, 0),
        'views_count', COALESCE(pv.views_count, 0)
    ) INTO result
    FROM products p
    LEFT JOIN (
        SELECT product_id, COUNT(*) as likes_count 
        FROM product_likes 
        WHERE product_id = p_product_id 
        GROUP BY product_id
    ) pl ON p.id = pl.product_id
    LEFT JOIN (
        SELECT product_id, COUNT(*) as shares_count 
        FROM product_shares 
        WHERE product_id = p_product_id 
        GROUP BY product_id
    ) ps ON p.id = ps.product_id
    LEFT JOIN (
        SELECT product_id, COUNT(*) as comments_count 
        FROM product_comments 
        WHERE product_id = p_product_id AND is_approved = true
        GROUP BY product_id
    ) pc ON p.id = pc.product_id
    LEFT JOIN (
        SELECT product_id, COUNT(*) as views_count 
        FROM product_views 
        WHERE product_id = p_product_id 
        GROUP BY product_id
    ) pv ON p.id = pv.product_id
    WHERE p.id = p_product_id;
    
    RETURN COALESCE(result, '{"likes_count": 0, "shares_count": 0, "comments_count": 0, "views_count": 0}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =============================================

-- Insérer quelques likes de test (remplacer les UUIDs par de vrais IDs)
-- INSERT INTO product_likes (user_id, product_id) VALUES
-- ('user-uuid-1', 'product-uuid-1'),
-- ('user-uuid-2', 'product-uuid-1'),
-- ('user-uuid-1', 'product-uuid-2');

-- Insérer quelques commentaires de test
-- INSERT INTO product_comments (user_id, product_id, content) VALUES
-- ('user-uuid-1', 'product-uuid-1', 'Super produit !'),
-- ('user-uuid-2', 'product-uuid-1', 'Je recommande !');
