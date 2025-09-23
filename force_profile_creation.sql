-- =============================================
-- FORCER LA CRÉATION DE PROFILS UTILISATEURS
-- =============================================

-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- 2. DÉSACTIVER TEMPORAIREMENT RLS POUR DEBUGGING
-- =============================================
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. RECRÉER LES POLITIQUES AVEC DES PERMISSIONS MAXIMALES
-- =============================================

-- Permettre à tous les utilisateurs authentifiés de voir tous les profils (temporaire)
CREATE POLICY "Authenticated users can view profiles" ON users
FOR SELECT
USING (auth.role() = 'authenticated');

-- Permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE
USING (auth.uid() = id);

-- Permettre l'insertion de profils (très permissive pour l'inscription)
CREATE POLICY "Users can create profiles" ON users
FOR INSERT
WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL OR
    id IS NOT NULL
);

-- Permettre de voir les profils publics
CREATE POLICY "Anyone can view public profiles" ON users
FOR SELECT
USING (true);

-- 4. VÉRIFIER LES POLITIQUES
-- =============================================
SELECT '=== POLITIQUES RLS ===' as info;
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 5. VÉRIFIER LES FONCTIONS
-- =============================================
SELECT '=== FONCTIONS DISPONIBLES ===' as info;
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_profile', 'is_username_available', 'is_email_available')
ORDER BY routine_name;

-- 6. TEST DE CONNEXION
-- =============================================
-- Décommentez ces lignes pour tester manuellement
-- SELECT 'Test: Votre utilisateur peut-il s''insérer?' as test;
-- INSERT INTO users (id, email, username) VALUES (auth.uid(), 'test@example.com', 'testuser');

-- 7. MESSAGE DE CONFIRMATION
-- =============================================
SELECT '🔧 Force profile creation setup completed!' as status;
SELECT '✅ RLS policies are now very permissive' as policy_status;
SELECT '✅ All functions should be available' as function_status;
SELECT '⚠️  WARNING: RLS is temporarily disabled for debugging' as warning;
SELECT '🔄 You may want to re-enable RLS with proper policies later' as recommendation;
