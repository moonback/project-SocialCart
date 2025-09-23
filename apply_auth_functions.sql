-- =============================================
-- APPLIQUER UNIQUEMENT LES FONCTIONS D'AUTH
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

-- =============================================
-- VÉRIFICATION DES FONCTIONS
-- =============================================

-- Test de vérification
SELECT 'Functions created successfully!' as status;

-- Vérifier que les fonctions existent
SELECT
    routine_name as function_name,
    routine_type as type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_profile', 'is_username_available', 'is_email_available')
ORDER BY routine_name;
