-- Script pour Supprimer Complètement le Système de Stories
-- ===========================================================
-- ⚠️ ATTENTION : Ce script supprime TOUTES les données de stories
-- ⚠️ Cette action est IRRÉVERSIBLE

-- 1. Supprimer toutes les politiques RLS des tables de stories
DROP POLICY IF EXISTS "Stories public read" ON storage.objects;
DROP POLICY IF EXISTS "Stories seller upload" ON storage.objects;
DROP POLICY IF EXISTS "Stories owner update" ON storage.objects;
DROP POLICY IF EXISTS "Stories owner delete" ON storage.objects;

-- 2. Supprimer toutes les politiques RLS des tables de base de données (si elles existent)
DO $$
BEGIN
    -- Politiques pour product_stories
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_stories') THEN
        DROP POLICY IF EXISTS "Stories public read policy" ON product_stories;
        DROP POLICY IF EXISTS "Stories seller create policy" ON product_stories;
        DROP POLICY IF EXISTS "Stories owner update policy" ON product_stories;
        DROP POLICY IF EXISTS "Stories owner delete policy" ON product_stories;
    END IF;
    
    -- Politiques pour story_views
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_views') THEN
        DROP POLICY IF EXISTS "Story views public read policy" ON story_views;
        DROP POLICY IF EXISTS "Story views authenticated create policy" ON story_views;
    END IF;
    
    -- Politiques pour story_interactions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_interactions') THEN
        DROP POLICY IF EXISTS "Story interactions public read policy" ON story_interactions;
        DROP POLICY IF EXISTS "Story interactions authenticated create policy" ON story_interactions;
    END IF;
    
    -- Politiques pour story_analytics
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_analytics') THEN
        DROP POLICY IF EXISTS "Story analytics seller read policy" ON story_analytics;
        DROP POLICY IF EXISTS "Story analytics seller update policy" ON story_analytics;
    END IF;
END $$;

-- 3. Supprimer toutes les données des tables de stories (si elles existent)
DO $$
BEGIN
    -- Supprimer les données si les tables existent
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_analytics') THEN
        DELETE FROM story_analytics;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_interactions') THEN
        DELETE FROM story_interactions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'story_views') THEN
        DELETE FROM story_views;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_stories') THEN
        DELETE FROM product_stories;
    END IF;
END $$;

-- 4. Supprimer les tables de stories
DROP TABLE IF EXISTS story_analytics CASCADE;
DROP TABLE IF EXISTS story_interactions CASCADE;
DROP TABLE IF EXISTS story_views CASCADE;
DROP TABLE IF EXISTS product_stories CASCADE;

-- 5. Supprimer la vue stories_with_details
DROP VIEW IF EXISTS stories_with_details;

-- 6. Supprimer les fonctions RPC liées aux stories
DROP FUNCTION IF EXISTS increment_story_views(uuid, uuid);
DROP FUNCTION IF EXISTS increment_story_interactions(uuid, uuid, text);
DROP FUNCTION IF EXISTS update_story_analytics(uuid, text, integer);
DROP FUNCTION IF EXISTS increment_poll_vote(uuid, uuid, text);
DROP FUNCTION IF EXISTS increment_quiz_answer(uuid, uuid, text);

-- 7. Supprimer le bucket de stockage stories
DELETE FROM storage.buckets WHERE name = 'stories';

-- 8. Supprimer tous les fichiers du bucket stories (si des fichiers existent)
-- Note: Cette opération peut prendre du temps si beaucoup de fichiers
DO $$
DECLARE
    file_record RECORD;
BEGIN
    FOR file_record IN 
        SELECT name FROM storage.objects WHERE bucket_id = 'stories'
    LOOP
        DELETE FROM storage.objects WHERE bucket_id = 'stories' AND name = file_record.name;
    END LOOP;
END $$;

-- 9. Vérification finale - Lister les éléments restants liés aux stories
SELECT 
    'VÉRIFICATION' as check_type,
    'SUPPRESSION STORIES' as status,
    COUNT(*) as count,
    'Éléments stories restants' as details
FROM information_schema.tables 
WHERE table_name LIKE '%story%' 
   OR table_name LIKE '%stories%';

-- 10. Vérifier les buckets restants
SELECT 
    'BUCKETS RESTANTS' as check_type,
    name as bucket_name,
    CASE 
        WHEN name = 'profiles' THEN '✅ Bucket profiles conservé'
        WHEN name = 'products' THEN '✅ Bucket products conservé'
        WHEN name = 'stories' THEN '❌ Bucket stories devrait être supprimé'
        ELSE '⚠️ Bucket ' || name
    END as status
FROM storage.buckets;

-- 11. Vérifier les fonctions RPC restantes
SELECT 
    'FONCTIONS RESTANTES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune fonction story restante'
        ELSE '⚠️ ' || COUNT(*) || ' fonctions story restantes'
    END as status
FROM information_schema.routines 
WHERE routine_name LIKE '%story%' 
   OR routine_name LIKE '%stories%';

-- 12. Résumé final
SELECT 
    'RÉSUMÉ FINAL' as check_type,
    '🎉 STORIES SUPPRIMÉES' as status,
    0 as count,
    'Système de stories complètement retiré' as details;
