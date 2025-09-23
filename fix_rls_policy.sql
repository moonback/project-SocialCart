-- =============================================
-- CORRECTION COMPLÈTE DES POLITIQUES RLS
-- =============================================

-- Supprimer toutes les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- Recréer toutes les politiques avec les bonnes permissions
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Politique plus permissive pour la création de profils
CREATE POLICY "Users can create their own profile" ON users
FOR INSERT WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL OR
    (auth.uid() IS NULL AND id IS NOT NULL)
);

CREATE POLICY "Anyone can view public user profiles" ON users
FOR SELECT USING (true);

-- =============================================
-- VÉRIFICATION DES POLITIQUES
-- =============================================

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

-- =============================================
-- VÉRIFICATION DES FONCTIONS
-- =============================================

SELECT
    routine_name as function_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_profile', 'is_username_available', 'is_email_available')
ORDER BY routine_name;

-- =============================================
-- RÉSULTATS ATTENDUS
-- =============================================

/*
RÉSULTATS ATTENDUS POUR LES POLITIQUES:
- Users can view their own profile (SELECT)
- Users can update their own profile (UPDATE)
- Users can create their own profile (INSERT) - Plus permissive
- Anyone can view public user profiles (SELECT)

RÉSULTATS ATTENDUS POUR LES FONCTIONS:
- create_user_profile (FUNCTION)
- update_user_profile (FUNCTION)
- is_username_available (FUNCTION)
- is_email_available (FUNCTION)
*/
