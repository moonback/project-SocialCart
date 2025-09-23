-- =============================================
-- TESTS SQL POUR VÉRIFIER L'IMPLÉMENTATION
-- =============================================

-- 1. TEST DE CRÉATION D'UN PROFIL UTILISATEUR
-- =============================================
-- Simuler la création d'un profil (remplacer auth.uid() par un UUID réel)
-- SELECT create_user_profile(
--     'test@example.com',
--     'testuser123',
--     'Test User',
--     '+33123456789'
-- );

-- 2. TEST DE VÉRIFICATION DE DISPONIBILITÉ
-- =============================================
-- Vérifier si un nom d'utilisateur est disponible
-- SELECT is_username_available('nouveau_username');

-- Vérifier si un email est disponible
-- SELECT is_email_available('nouveau@email.com');

-- 3. TEST DE MISE À JOUR DU PROFIL
-- =============================================
-- Mettre à jour le profil utilisateur (remplacer auth.uid() par un UUID réel)
-- SELECT update_user_profile(
--     'Nouveau Nom',
--     '+33987654321',
--     'Ma bio personnalisée',
--     'Paris, France',
--     'https://monsite.com',
--     'mon_instagram',
--     'mon_tiktok',
--     'https://avatar-url.com/image.jpg'
-- );

-- 4. TEST DE RECHERCHE D'UTILISATEURS
-- =============================================
-- Rechercher des utilisateurs par nom d'utilisateur
-- SELECT id, username, full_name, avatar_url, is_seller, is_verified
-- FROM users 
-- WHERE username ILIKE '%test%' 
-- ORDER BY is_verified DESC, username ASC
-- LIMIT 20;

-- Rechercher des vendeurs
-- SELECT id, username, full_name, avatar_url, bio, location
-- FROM users 
-- WHERE is_seller = TRUE 
-- AND (username ILIKE '%test%' OR full_name ILIKE '%test%')
-- ORDER BY is_verified DESC, username ASC
-- LIMIT 20;

-- 5. TEST DES POLITIQUES RLS
-- =============================================
-- Vérifier que les politiques fonctionnent
-- SELECT * FROM users; -- Devrait retourner les utilisateurs publics seulement

-- 6. TEST DES INDEX
-- =============================================
-- Vérifier que les index sont créés
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'users';

-- 7. TEST DES TRIGGERS
-- =============================================
-- Vérifier que les triggers sont actifs
-- SELECT trigger_name, event_manipulation, action_statement
-- FROM information_schema.triggers
-- WHERE event_object_table = 'users';

-- 8. STATISTIQUES DE TEST
-- =============================================
-- Compter le nombre d'utilisateurs
-- SELECT COUNT(*) as total_users FROM users;

-- Compter le nombre de vendeurs
-- SELECT COUNT(*) as total_sellers FROM users WHERE is_seller = TRUE;

-- Statistiques par mois
-- SELECT 
--     DATE_TRUNC('month', created_at) as month,
--     COUNT(*) as new_users
-- FROM users 
-- GROUP BY DATE_TRUNC('month', created_at)
-- ORDER BY month DESC;

-- =============================================
-- INSTRUCTIONS POUR LES TESTS
-- =============================================

/*
1. Exécutez d'abord le script auth_schema.sql dans Supabase
2. Testez chaque fonction individuellement
3. Vérifiez que les politiques RLS fonctionnent
4. Testez l'application React avec npm run dev
5. Créez un compte de test pour vérifier le flux complet

TESTS RECOMMANDÉS :
- Inscription avec email valide/invalide
- Inscription avec username disponible/pris
- Connexion avec bonnes/mauvaises informations
- Mise à jour du profil
- Recherche d'utilisateurs
- Vérification des messages d'erreur en français
*/
