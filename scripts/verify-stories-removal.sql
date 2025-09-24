-- Script de Vérification - Suppression Complète des Stories
-- ========================================================

-- 1. Vérifier les tables de stories restantes
SELECT 
    'TABLES STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune table story restante'
        ELSE '❌ ' || COUNT(*) || ' tables story restantes'
    END as status,
    STRING_AGG(table_name, ', ') as details
FROM information_schema.tables 
WHERE table_name LIKE '%story%' 
   OR table_name LIKE '%stories%';

-- 2. Vérifier les vues de stories restantes
SELECT 
    'VUES STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune vue story restante'
        ELSE '❌ ' || COUNT(*) || ' vues story restantes'
    END as status,
    STRING_AGG(table_name, ', ') as details
FROM information_schema.views 
WHERE table_name LIKE '%story%' 
   OR table_name LIKE '%stories%';

-- 3. Vérifier les fonctions RPC de stories restantes
SELECT 
    'FONCTIONS STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune fonction story restante'
        ELSE '❌ ' || COUNT(*) || ' fonctions story restantes'
    END as status,
    STRING_AGG(routine_name, ', ') as details
FROM information_schema.routines 
WHERE routine_name LIKE '%story%' 
   OR routine_name LIKE '%stories%';

-- 4. Vérifier les politiques RLS de stories restantes
SELECT 
    'POLITIQUES STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune politique story restante'
        ELSE '❌ ' || COUNT(*) || ' politiques story restantes'
    END as status,
    STRING_AGG(policyname, ', ') as details
FROM pg_policies 
WHERE policyname LIKE '%story%' 
   OR policyname LIKE '%stories%';

-- 5. Vérifier le bucket stories
SELECT 
    'BUCKET STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Bucket stories supprimé'
        ELSE '❌ Bucket stories encore présent'
    END as status,
    STRING_AGG(name, ', ') as details
FROM storage.buckets 
WHERE name = 'stories';

-- 6. Vérifier les fichiers dans le bucket stories
SELECT 
    'FICHIERS STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucun fichier story restant'
        ELSE '❌ ' || COUNT(*) || ' fichiers story restants'
    END as status,
    'Fichiers dans le bucket stories' as details
FROM storage.objects 
WHERE bucket_id = 'stories';

-- 7. Vérifier les contraintes de clés étrangères liées aux stories
SELECT 
    'CONTRAINTES STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucune contrainte story restante'
        ELSE '❌ ' || COUNT(*) || ' contraintes story restantes'
    END as status,
    STRING_AGG(constraint_name, ', ') as details
FROM information_schema.table_constraints 
WHERE constraint_name LIKE '%story%' 
   OR constraint_name LIKE '%stories%';

-- 8. Vérifier les index liés aux stories
SELECT 
    'INDEX STORIES' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucun index story restant'
        ELSE '❌ ' || COUNT(*) || ' index story restants'
    END as status,
    STRING_AGG(indexname, ', ') as details
FROM pg_indexes 
WHERE indexname LIKE '%story%' 
   OR indexname LIKE '%stories%';

-- 9. Résumé final
SELECT 
    'RÉSUMÉ FINAL' as check_type,
    CASE 
        WHEN (
            (SELECT COUNT(*) FROM information_schema.tables WHERE table_name LIKE '%story%' OR table_name LIKE '%stories%') = 0
            AND (SELECT COUNT(*) FROM information_schema.views WHERE table_name LIKE '%story%' OR table_name LIKE '%stories%') = 0
            AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_name LIKE '%story%' OR routine_name LIKE '%stories%') = 0
            AND (SELECT COUNT(*) FROM storage.buckets WHERE name = 'stories') = 0
        ) THEN '🎉 SUPPRESSION COMPLÈTE'
        ELSE '⚠️ ÉLÉMENTS RESTANTS'
    END as status,
    0 as count,
    'Vérification de la suppression des stories' as details;
