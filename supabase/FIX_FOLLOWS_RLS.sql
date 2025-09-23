-- =============================================
-- CORRECTION DES POLITIQUES RLS POUR LA TABLE FOLLOWS
-- =============================================

-- S'assurer que la table follows existe et a les bonnes contraintes
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id) -- Empêcher l'auto-suivi
);

-- Activer RLS sur la table follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes s'il y en a (pour éviter les conflits)
DROP POLICY IF EXISTS "Users can view follows" ON follows;
DROP POLICY IF EXISTS "Users can manage follows" ON follows;
DROP POLICY IF EXISTS "Users can create follows" ON follows;
DROP POLICY IF EXISTS "Users can delete follows" ON follows;

-- Politiques RLS pour la table follows

-- 1. Lecture : Tout le monde peut voir les relations de suivi
CREATE POLICY "Users can view all follows" ON follows 
    FOR SELECT USING (true);

-- 2. Insertion : Un utilisateur peut suivre d'autres utilisateurs
CREATE POLICY "Users can create follows" ON follows 
    FOR INSERT WITH CHECK (
        auth.uid() = follower_id 
        AND follower_id != following_id
    );

-- 3. Suppression : Un utilisateur peut arrêter de suivre
CREATE POLICY "Users can delete their own follows" ON follows 
    FOR DELETE USING (auth.uid() = follower_id);

-- 4. Mise à jour : Pas de mise à jour nécessaire (on ne peut que créer/supprimer)
-- CREATE POLICY "Users can update their own follows" ON follows 
--     FOR UPDATE USING (auth.uid() = follower_id);

-- Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- =============================================
-- FONCTION UTILITAIRE POUR VÉRIFIER LE SUIVI
-- =============================================

-- Fonction pour vérifier si un utilisateur suit un autre utilisateur
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

-- =============================================
-- FONCTION POUR TOGGLE FOLLOW (UTILE POUR L'APP)
-- =============================================

-- Fonction pour suivre/ne plus suivre un utilisateur
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

-- =============================================
-- VÉRIFICATION ET TEST
-- =============================================

-- Vérifier que les politiques sont bien créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'follows';

-- Afficher les contraintes de la table
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'follows'::regclass;
