-- Script Sécurisé pour Supprimer les Stories
-- ===========================================
-- Ce script ne supprime que les éléments qui existent réellement

-- 1. Vérifier ce qui existe actuellement
SELECT 
    'ÉLÉMENTS EXISTANTS' as check_type,
    'VÉRIFICATION INITIALE' as status,
    COUNT(*) as count,
    'Tables stories présentes' as details
FROM information_schema.tables 
WHERE table_name LIKE '%story%' 
   OR table_name LIKE '%stories%';

-- 2. Supprimer les politiques de stockage (sans erreur si elles n'existent pas)
DROP POLICY IF EXISTS "Stories public read" ON storage.objects;
DROP POLICY IF EXISTS "Stories seller upload" ON storage.objects;
DROP POLICY IF EXISTS "Stories owner update" ON storage.objects;
DROP POLICY IF EXISTS "Stories owner delete" ON storage.objects;

-- 3. Supprimer les tables de stories (sans erreur si elles n'existent pas)
DROP TABLE IF EXISTS story_analytics CASCADE;
DROP TABLE IF EXISTS story_interactions CASCADE;
DROP TABLE IF EXISTS story_views CASCADE;
DROP TABLE IF EXISTS product_stories CASCADE;

-- 4. Supprimer la vue stories_with_details (sans erreur si elle n'existe pas)
DROP VIEW IF EXISTS stories_with_details;

-- 5. Supprimer les fonctions RPC (sans erreur si elles n'existent pas)
DROP FUNCTION IF EXISTS increment_story_views(uuid, uuid);
DROP FUNCTION IF EXISTS increment_story_interactions(uuid, uuid, text);
DROP FUNCTION IF EXISTS update_story_analytics(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_poll_vote(uuid, uuid, text);
DROP FUNCTION IF EXISTS increment_quiz_answer(uuid, uuid, text);

-- 6. Supprimer le bucket stories (sans erreur si il n'existe pas)
DELETE FROM storage.buckets WHERE name = 'stories';

-- 7. Vérification finale
SELECT 
    'RÉSULTAT FINAL' as check_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_name LIKE '%story%' OR table_name LIKE '%stories%') = 0
        THEN '🎉 STORIES SUPPRIMÉES'
        ELSE '⚠️ ÉLÉMENTS RESTANTS'
    END as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name LIKE '%story%' OR table_name LIKE '%stories%') as count,
    'Tables stories restantes' as details;

-- 8. Vérifier les buckets restants
SELECT 
    'BUCKETS RESTANTS' as check_type,
    name as bucket_name,
    CASE 
        WHEN name = 'profiles' THEN '✅ Bucket profiles conservé'
        WHEN name = 'products' THEN '✅ Bucket products conservé'
        WHEN name = 'stories' THEN '❌ Bucket stories encore présent'
        ELSE '⚠️ Bucket ' || name
    END as status
FROM storage.buckets;
