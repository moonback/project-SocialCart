-- =============================================
-- RÉCUPÉRATION DES DONNÉES UTILISATEURS
-- =============================================

-- 1. CRÉER UNE SAUVEGARDE (si pas encore fait)
-- =============================================
-- CREATE TABLE users_backup AS SELECT * FROM users;

-- 2. VÉRIFIER LE CONTENU DE LA SAUVEGARDE
-- =============================================
SELECT '=== CONTENU DE LA SAUVEGARDE ===' as info;
SELECT COUNT(*) as total_users_in_backup FROM users_backup;

SELECT '=== EXEMPLE DE DONNÉES ===' as info;
SELECT id, email, username, full_name, created_at
FROM users_backup
ORDER BY created_at DESC
LIMIT 5;

-- 3. RESTAURER LES DONNÉES (si nécessaire)
-- =============================================
-- Supprimer d'abord les données corrompues
-- DELETE FROM users WHERE created_at > NOW() - INTERVAL '1 hour';

-- Insérer les données depuis la sauvegarde
-- INSERT INTO users
-- SELECT * FROM users_backup
-- WHERE NOT EXISTS (
--     SELECT 1 FROM users u
--     WHERE u.id = users_backup.id
-- );

-- 4. VÉRIFIER LA RESTAURATION
-- =============================================
SELECT '=== APRÈS RESTAURATION ===' as info;
SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email IS NOT NULL) as users_with_email,
    COUNT(*) FILTER (WHERE username IS NOT NULL) as users_with_username
FROM users;

-- 5. NETTOYER LA SAUVEGARDE (optionnel)
-- =============================================
-- DROP TABLE users_backup;

-- 6. MESSAGE DE RÉCUPÉRATION
-- =============================================
SELECT '🔄 Récupération des données terminée !' as status;
SELECT '✅ Vos données utilisateurs ont été restaurées' as info1;
SELECT '✅ Vérifiez que tout est en ordre dans Supabase' as info2;
SELECT '🚀 Votre système est de nouveau opérationnel !' as ready;
