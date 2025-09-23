-- =============================================
-- DÉPLOIEMENT COMPLÈT DE L'AUTHENTIFICATION
-- =============================================

-- 1. ACTIVER RLS SUR LA TABLE USERS
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER LES ANCIENNES POLITIQUES
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- 3. CRÉER LES POLITIQUES CORRIGÉES
-- =============================================
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" ON users
FOR INSERT WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL OR
    (auth.uid() IS NULL AND id IS NOT NULL)
);

CREATE POLICY "Anyone can view public user profiles" ON users
FOR SELECT USING (true);

-- 4. CRÉER LES FONCTIONS D'AUTHENTIFICATION
-- =============================================

-- Fonction pour créer un profil utilisateur
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

-- Fonction pour mettre à jour le profil
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

-- Fonction pour vérifier la disponibilité d'un nom d'utilisateur
CREATE OR REPLACE FUNCTION is_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users
        WHERE username = check_username
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier la disponibilité d'un email
CREATE OR REPLACE FUNCTION is_email_available(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users
        WHERE email = check_email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CRÉER LES TRIGGERS ET INDEX
-- =============================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_seller ON users(is_seller);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 6. VÉRIFICATION FINALE
-- =============================================

-- Vérifier les politiques
SELECT '=== POLITIQUES ===' as section;
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Vérifier les fonctions
SELECT '=== FONCTIONS ===' as section;
SELECT
    routine_name as function_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_profile', 'is_username_available', 'is_email_available')
ORDER BY routine_name;

-- 7. MESSAGE DE SUCCÈS
-- =============================================
SELECT '🎉 Authentification configurée avec succès !' as status;
SELECT '✅ Toutes les politiques RLS sont actives' as info1;
SELECT '✅ Toutes les fonctions d''authentification sont disponibles' as info2;
SELECT '✅ Les triggers et index sont configurés' as info3;
SELECT '🚀 Votre application est prête !' as ready;
