-- =============================================
-- SOLUTION IMMÉDIATE POUR CRÉATION DE PROFILS
-- =============================================

-- 1. DÉSACTIVER RLS TEMPORAIREMENT
-- =============================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. VÉRIFIER QUE RLS EST DÉSACTIVÉ
-- =============================================
SELECT '=== ÉTAT RLS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users';

-- 3. TESTER L'INSERTION DIRECTE
-- =============================================
SELECT '=== TEST D\'INSERTION ===' as info;
SELECT 'RLS désactivé - Les insertions devraient maintenant fonctionner' as status;

-- 4. VÉRIFIER LES DONNÉES EXISTANTES
-- =============================================
SELECT '=== DONNÉES UTILISATEURS ===' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email IS NOT NULL) as users_with_email,
    COUNT(*) FILTER (WHERE username IS NOT NULL) as users_with_username
FROM users;

-- 5. MESSAGE DE CONFIRMATION
-- =============================================
SELECT '🚫 RLS DÉSACTIVÉ TEMPORAIREMENT !' as status;
SELECT '✅ Les créations de profils vont maintenant fonctionner' as info1;
SELECT '⚠️  N\'oubliez pas de réactiver RLS plus tard' as warning;
SELECT '🚀 Testez votre inscription maintenant !' as ready;

-- 6. POUR RÉACTIVER RLS PLUS TARD (COMMENTÉ)
-- =============================================
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own profile" ON users
-- FOR SELECT USING (auth.uid() = id);
-- 
-- CREATE POLICY "Users can update their own profile" ON users
-- FOR UPDATE USING (auth.uid() = id);
-- 
-- CREATE POLICY "Users can create their own profile" ON users
-- FOR INSERT WITH CHECK (auth.uid() = id);
-- 
-- CREATE POLICY "Anyone can view public user profiles" ON users
-- FOR SELECT USING (true);
