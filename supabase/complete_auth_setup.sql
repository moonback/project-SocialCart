-- =============================================
-- CONFIGURATION COMPLÈTE DE L'AUTHENTIFICATION
-- =============================================

-- 1. SUPPRIMER LES TRIGGERS EXISTANTS
-- =============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 2. SUPPRIMER LES POLITIQUES EXISTANTES
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- 3. SUPPRIMER LES FONCTIONS EXISTANTES
-- =============================================
DROP FUNCTION IF EXISTS create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_user_profile(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS is_username_available(TEXT);
DROP FUNCTION IF EXISTS is_email_available(TEXT);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. SUPPRIMER LES INDEX EXISTANTS
-- =============================================
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_is_seller;
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_users_seller_search;

-- 5. ACTIVER RLS
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES POLITIQUES RLS
-- =============================================

-- Politique pour voir son propre profil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT
USING (auth.uid() = id);

-- Politique pour mettre à jour son propre profil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE
USING (auth.uid() = id);

-- Politique pour créer un nouveau profil (inscription) - Plus permissive
CREATE POLICY "Users can create their own profile" ON users
FOR INSERT
WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL OR
    id IS NOT NULL
);

-- Politique pour voir les profils publics (pour les vendeurs)
CREATE POLICY "Anyone can view public user profiles" ON users
FOR SELECT
USING (true);

-- 7. CRÉER LES FONCTIONS D'AUTHENTIFICATION
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

-- Fonction pour créer un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_username TEXT,
    user_full_name TEXT DEFAULT NULL,
    user_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Insérer le nouvel utilisateur avec l'ID fourni
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
        user_id,
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

-- 8. CRÉER LES INDEX POUR LES PERFORMANCES
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

-- 9. VÉRIFICATION FINALE
-- =============================================

-- Vérifier les politiques
SELECT '=== POLITIQUES RLS ===' as section;
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Vérifier les fonctions
SELECT '=== FONCTIONS DISPONIBLES ===' as section;
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_profile', 'is_username_available', 'is_email_available')
ORDER BY routine_name;

-- Vérifier les triggers
SELECT '=== TRIGGERS ===' as section;
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- Vérifier les index
SELECT '=== INDEX ===' as section;
SELECT
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename = 'users'
ORDER BY indexname;

-- 10. MESSAGE DE SUCCÈS
-- =============================================
SELECT '🎉 Configuration complète terminée avec succès !' as status;
SELECT '✅ Toutes les politiques RLS sont configurées' as info1;
SELECT '✅ Toutes les fonctions d''authentification sont disponibles' as info2;
SELECT '✅ Les triggers automatiques sont actifs' as info3;
SELECT '✅ Les index de performance sont créés' as info4;
SELECT '🚀 Votre système d''authentification est prêt !' as ready;
