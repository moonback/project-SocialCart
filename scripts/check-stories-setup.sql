-- Script de vérification du système de Stories
-- À exécuter dans Supabase SQL Editor pour vérifier l'installation

-- 1. Vérifier les tables
SELECT 
  'Tables Stories' as check_type,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ OK'
    ELSE '❌ MANQUANTES'
  END as status,
  COUNT(*) as found_count,
  string_agg(table_name, ', ') as tables_found
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('product_stories', 'story_views', 'story_analytics');

-- 2. Vérifier les politiques RLS
SELECT 
  'Politiques RLS' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ OK'
    ELSE '❌ MANQUANTES'
  END as status,
  COUNT(*) as found_count,
  string_agg(tablename || ':' || policyname, ', ') as policies_found
FROM pg_policies 
WHERE tablename IN ('product_stories', 'story_views', 'story_analytics');

-- 3. Vérifier les fonctions RPC
SELECT 
  'Fonctions RPC' as check_type,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ OK'
    ELSE '❌ MANQUANTES'
  END as status,
  COUNT(*) as found_count,
  string_agg(proname, ', ') as functions_found
FROM pg_proc 
WHERE proname IN ('increment_story_views', 'increment_story_interactions', 'increment_poll_vote', 'increment_quiz_answer');

-- 4. Vérifier les contraintes
SELECT 
  'Contraintes' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ OK'
    ELSE '❌ MANQUANTES'
  END as status,
  COUNT(*) as found_count,
  string_agg(constraint_name, ', ') as constraints_found
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name IN ('product_stories', 'story_views', 'story_analytics')
AND constraint_type = 'FOREIGN KEY';

-- 5. Vérifier les index
SELECT 
  'Index' as check_type,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ OK'
    ELSE '❌ MANQUANTES'
  END as status,
  COUNT(*) as found_count,
  string_agg(indexname, ', ') as indexes_found
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('product_stories', 'story_views', 'story_analytics');

-- 6. Résumé final
SELECT 
  'RÉSUMÉ' as check_type,
  CASE 
    WHEN (
      (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('product_stories', 'story_views', 'story_analytics')) = 3
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('product_stories', 'story_views', 'story_analytics')) > 0
      AND (SELECT COUNT(*) FROM pg_proc WHERE proname IN ('increment_story_views', 'increment_story_interactions', 'increment_poll_vote', 'increment_quiz_answer')) >= 4
    ) THEN '🎉 INSTALLATION COMPLÈTE'
    ELSE '⚠️ INSTALLATION INCOMPLÈTE'
  END as status,
  0 as found_count,
  'Vérifiez les résultats ci-dessus' as details;
