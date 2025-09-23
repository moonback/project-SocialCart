-- =============================================
-- REQUÊTES SQL POUR AUTHENTIFICATION
-- =============================================

-- 1. CRÉATION DE LA TABLE USERS (si pas encore créée)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    loyalty_points INTEGER DEFAULT 0,
    is_seller BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    location VARCHAR(100),
    website_url TEXT,
    instagram_handle VARCHAR(50),
    tiktok_handle VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POLITIQUES RLS POUR L'AUTHENTIFICATION
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- Politique pour voir son propre profil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Politique pour mettre à jour son propre profil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Politique pour créer un nouveau profil (inscription) - Plus permissive
CREATE POLICY "Users can create their own profile" ON users
FOR INSERT WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL OR
    (auth.uid() IS NULL AND id IS NOT NULL)
);

-- Politique pour voir les profils publics (pour les vendeurs)
CREATE POLICY "Anyone can view public user profiles" ON users
FOR SELECT USING (true);

-- 3. FONCTIONS UTILITAIRES POUR L'AUTHENTIFICATION
-- =============================================

-- Fonction pour créer un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION create_user_profile(
    user_email TEXT,
    user_username TEXT,
    user_full_name TEXT DEFAULT NULL,
    user_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insérer le nouvel utilisateur
    INSERT INTO users (
        id,
        email,
        username,
        full_name,
        phone,
        loyalty_points,
        is_seller,
        is_verified
    ) VALUES (
        auth.uid(),
        user_email,
        user_username,
        user_full_name,
        user_phone,
        0,
        FALSE,
        FALSE
    ) RETURNING id INTO new_user_id;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le profil utilisateur
CREATE OR REPLACE FUNCTION update_user_profile(
    user_full_name TEXT DEFAULT NULL,
    user_phone TEXT DEFAULT NULL,
    user_bio TEXT DEFAULT NULL,
    user_location TEXT DEFAULT NULL,
    user_website_url TEXT DEFAULT NULL,
    user_instagram_handle TEXT DEFAULT NULL,
    user_tiktok_handle TEXT DEFAULT NULL,
    user_avatar_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users SET
        full_name = COALESCE(user_full_name, full_name),
        phone = COALESCE(user_phone, phone),
        bio = COALESCE(user_bio, bio),
        location = COALESCE(user_location, location),
        website_url = COALESCE(user_website_url, website_url),
        instagram_handle = COALESCE(user_instagram_handle, instagram_handle),
        tiktok_handle = COALESCE(user_tiktok_handle, tiktok_handle),
        avatar_url = COALESCE(user_avatar_url, avatar_url),
        updated_at = NOW()
    WHERE id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un nom d'utilisateur est disponible
CREATE OR REPLACE FUNCTION is_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users
        WHERE username = check_username
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un email est disponible
CREATE OR REPLACE FUNCTION is_email_available(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users
        WHERE email = check_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. REQUÊTES POUR L'INSCRIPTION
-- =============================================

-- Vérifier la disponibilité d'un nom d'utilisateur
-- SELECT is_username_available('mon_username');

-- Vérifier la disponibilité d'un email
-- SELECT is_email_available('mon@email.com');

-- Créer un profil utilisateur (appelé après l'inscription Supabase Auth)
-- SELECT create_user_profile('user@example.com', 'username123', 'John Doe', '+33123456789');

-- 5. REQUÊTES POUR LA CONNEXION
-- =============================================

-- Récupérer le profil utilisateur complet
-- SELECT * FROM users WHERE id = auth.uid();

-- Récupérer les informations de base pour l'affichage
-- SELECT id, username, full_name, avatar_url, loyalty_points, is_seller, is_verified 
-- FROM users WHERE id = auth.uid();

-- 6. REQUÊTES POUR LA GESTION DU PROFIL
-- =============================================

-- Mettre à jour le profil utilisateur
-- SELECT update_user_profile(
--     'Nouveau nom',
--     '+33987654321',
--     'Ma bio personnalisée',
--     'Paris, France',
--     'https://monsite.com',
--     'mon_instagram',
--     'mon_tiktok',
--     'https://avatar-url.com/image.jpg'
-- );

-- Changer le statut de vendeur
-- UPDATE users SET is_seller = TRUE WHERE id = auth.uid();

-- Ajouter des points de fidélité
-- UPDATE users SET loyalty_points = loyalty_points + 100 WHERE id = auth.uid();

-- 7. REQUÊTES POUR LA RECHERCHE D'UTILISATEURS
-- =============================================

-- Rechercher des utilisateurs par nom d'utilisateur
-- SELECT id, username, full_name, avatar_url, is_seller, is_verified
-- FROM users 
-- WHERE username ILIKE '%search_term%' 
-- AND id != auth.uid()
-- ORDER BY is_verified DESC, username ASC
-- LIMIT 20;

-- Rechercher des vendeurs
-- SELECT id, username, full_name, avatar_url, bio, location
-- FROM users 
-- WHERE is_seller = TRUE 
-- AND (username ILIKE '%search_term%' OR full_name ILIKE '%search_term%')
-- ORDER BY is_verified DESC, username ASC
-- LIMIT 20;

-- 8. STATISTIQUES UTILISATEUR
-- =============================================

-- Compter le nombre total d'utilisateurs
-- SELECT COUNT(*) as total_users FROM users;

-- Compter le nombre de vendeurs
-- SELECT COUNT(*) as total_sellers FROM users WHERE is_seller = TRUE;

-- Compter le nombre d'utilisateurs vérifiés
-- SELECT COUNT(*) as verified_users FROM users WHERE is_verified = TRUE;

-- Statistiques par mois d'inscription
-- SELECT 
--     DATE_TRUNC('month', created_at) as month,
--     COUNT(*) as new_users
-- FROM users 
-- GROUP BY DATE_TRUNC('month', created_at)
-- ORDER BY month DESC;

-- 9. TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- =============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la table users
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 10. INDEX POUR LES PERFORMANCES
-- =============================================

-- Index sur l'email pour les connexions rapides
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index sur le nom d'utilisateur pour les recherches
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index sur le statut de vendeur
CREATE INDEX IF NOT EXISTS idx_users_is_seller ON users(is_seller);

-- Index sur la date de création pour les statistiques
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Index composite pour les recherches de vendeurs
CREATE INDEX IF NOT EXISTS idx_users_seller_search ON users(is_seller, is_verified, username) 
WHERE is_seller = TRUE;
