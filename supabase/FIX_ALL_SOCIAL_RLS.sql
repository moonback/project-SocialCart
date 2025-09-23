-- =============================================
-- CORRECTION COMPLÈTE DES POLITIQUES RLS SOCIALES
-- =============================================

-- =============================================
-- TABLE FOLLOWS (Relations de suivi)
-- =============================================

-- Créer la table follows si elle n'existe pas
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

-- Activer RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view all follows" ON follows;
DROP POLICY IF EXISTS "Users can create follows" ON follows;
DROP POLICY IF EXISTS "Users can delete their own follows" ON follows;

-- Créer les nouvelles politiques
CREATE POLICY "Users can view all follows" ON follows 
    FOR SELECT USING (true);

CREATE POLICY "Users can create follows" ON follows 
    FOR INSERT WITH CHECK (
        auth.uid() = follower_id 
        AND follower_id != following_id
    );

CREATE POLICY "Users can delete their own follows" ON follows 
    FOR DELETE USING (auth.uid() = follower_id);

-- =============================================
-- TABLE LIKES (Likes sur produits)
-- =============================================

-- Créer la table likes si elle n'existe pas
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Activer RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON likes;

-- Créer les nouvelles politiques
CREATE POLICY "Users can view all likes" ON likes 
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON likes 
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- TABLE COMMENTS (Commentaires sur produits)
-- =============================================

-- Créer la table comments si elle n'existe pas
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 1000),
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Créer les nouvelles politiques
CREATE POLICY "Anyone can view comments" ON comments 
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments 
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TABLE SHARES (Partages de produits)
-- =============================================

-- Créer la table shares si elle n'existe pas
CREATE TABLE IF NOT EXISTS shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform VARCHAR(20) CHECK (platform IN ('instagram', 'tiktok', 'twitter', 'facebook', 'whatsapp', 'copy_link')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view all shares" ON shares;
DROP POLICY IF EXISTS "Users can create their own shares" ON shares;

-- Créer les nouvelles politiques
CREATE POLICY "Users can view all shares" ON shares 
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own shares" ON shares 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- INDEXES POUR LES PERFORMANCES
-- =============================================

-- Indexes pour follows
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- Indexes pour likes
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON likes(product_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);

-- Indexes pour comments
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON comments(product_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Indexes pour shares
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_product_id ON shares(product_id);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON shares(platform);
CREATE INDEX IF NOT EXISTS idx_shares_created_at ON shares(created_at);

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour vérifier si un utilisateur suit un autre
CREATE OR REPLACE FUNCTION is_user_following(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = p_follower_id 
        AND following_id = p_following_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour toggle follow
CREATE OR REPLACE FUNCTION toggle_follow(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_following BOOLEAN;
BEGIN
    -- Vérifier si l'utilisateur suit déjà
    SELECT EXISTS (
        SELECT 1 FROM follows 
        WHERE follower_id = p_follower_id 
        AND following_id = p_following_id
    ) INTO is_following;
    
    IF is_following THEN
        -- Ne plus suivre
        DELETE FROM follows 
        WHERE follower_id = p_follower_id 
        AND following_id = p_following_id;
        RETURN FALSE;
    ELSE
        -- Suivre
        INSERT INTO follows (follower_id, following_id) 
        VALUES (p_follower_id, p_following_id);
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur a liké un produit
CREATE OR REPLACE FUNCTION has_user_liked_product(p_user_id UUID, p_product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM likes 
        WHERE user_id = p_user_id AND product_id = p_product_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VÉRIFICATION FINALE
-- =============================================

-- Afficher toutes les politiques créées
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('follows', 'likes', 'comments', 'shares')
ORDER BY tablename, policyname;

-- Afficher les tables avec RLS activé
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename IN ('follows', 'likes', 'comments', 'shares')
AND schemaname = 'public';
