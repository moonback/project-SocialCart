-- =============================================
-- DÉSACTIVATION COMPLÈTE DE RLS
-- =============================================

-- 1. DÉSACTIVER RLS POUR TOUTES LES TABLES
-- =============================================

-- Désactiver RLS pour la table users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Désactiver RLS pour d'autres tables si elles existent
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- 2. SUPPRIMER TOUTES LES POLITIQUES RLS
-- =============================================

-- Supprimer toutes les politiques de la table users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- Supprimer les politiques d'autres tables si elles existent
-- DROP POLICY IF EXISTS "Products policy" ON products;
-- DROP POLICY IF EXISTS "Orders policy" ON orders;
-- DROP POLICY IF EXISTS "Cart items policy" ON cart_items;

-- 3. VÉRIFIER QUE RLS EST DÉSACTIVÉ
-- =============================================
SELECT '=== ÉTAT RLS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'products', 'orders', 'cart_items')
ORDER BY tablename;

-- 4. VÉRIFIER QU'AUCUNE POLITIQUE N'EXISTE
-- =============================================
SELECT '=== POLITIQUES RLS ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN ('users', 'products', 'orders', 'cart_items')
ORDER BY tablename, policyname;

-- 5. TEST D'ACCÈS LIBRE
-- =============================================
SELECT '=== TEST D\'ACCÈS ===' as info;
SELECT 
    COUNT(*) as total_users,
    'Accès libre à tous les utilisateurs' as access_status
FROM users;

-- 6. MESSAGE DE CONFIRMATION
-- =============================================
SELECT '🚫 RLS COMPLÈTEMENT DÉSACTIVÉ !' as status;
SELECT '⚠️  ATTENTION: Accès libre à toutes les données' as warning;
SELECT '🔓 Tous les utilisateurs peuvent voir/modifier tout' as info1;
SELECT '📊 Vérifiez les résultats ci-dessus' as info2;
SELECT '🚀 Votre application fonctionne sans restrictions' as ready;
