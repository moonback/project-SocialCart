-- =============================================
-- CORRECTION DE LA PERSISTENCE DE SESSION
-- =============================================

-- 1. SUPPRIMER LES POLITIQUES EXISTANTES QUI BLOQUENT L'ACCÈS
-- =============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view public user profiles" ON users;

-- 2. RECRÉER LES POLITIQUES AVEC LES BONNES PERMISSIONS
-- =============================================

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT
USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur profil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE
USING (auth.uid() = id);

-- Politique pour permettre la création de profils (plus permissive pour l'inscription)
CREATE POLICY "Users can create their own profile" ON users
FOR INSERT
WITH CHECK (
    auth.uid() = id OR
    auth.uid() IS NOT NULL
);

-- Politique pour voir les profils publics (vendeurs, etc.)
CREATE POLICY "Anyone can view public user profiles" ON users
FOR SELECT
USING (true);

-- 3. VÉRIFICATION DES POLITIQUES
-- =============================================

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

-- 4. TEST DE CONNEXION (si vous êtes connecté)
-- =============================================

-- Ce test ne fonctionnera que si vous êtes authentifié
-- SELECT 'Test: Pouvez-vous voir votre profil?' as test;
-- SELECT id, email, username FROM users WHERE id = auth.uid();

-- 5. MESSAGE DE CONFIRMATION
-- =============================================
SELECT '✅ Politiques RLS corrigées avec succès !' as status;
SELECT '✅ La persistance de session devrait maintenant fonctionner' as info1;
SELECT '✅ Les utilisateurs authentifiés peuvent accéder à leur profil' as info2;
SELECT '✅ Les politiques sont plus permissives pour l''inscription' as info3;
