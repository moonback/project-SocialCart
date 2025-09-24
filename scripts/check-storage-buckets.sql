-- Script pour vérifier et créer les buckets de stockage
-- =====================================================

-- 1. Vérifier les buckets existants
SELECT 
  'BUCKETS EXISTANTS' as check_type,
  name as bucket_name,
  CASE 
    WHEN name = 'profiles' THEN '✅ Bucket profiles'
    WHEN name = 'products' THEN '✅ Bucket products'
    WHEN name = 'stories' THEN '✅ Bucket stories'
    ELSE '⚠️ Bucket ' || name
  END as status
FROM storage.buckets;

-- 2. Vérifier les politiques RLS pour le bucket profiles
SELECT 
  'POLITIQUES PROFILES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUNE POLITIQUE'
    ELSE '✅ ' || COUNT(*) || ' politiques'
  END as status
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
AND policyname LIKE '%profiles%';

-- 3. Vérifier les politiques RLS pour le bucket products
SELECT 
  'POLITIQUES PRODUCTS' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUNE POLITIQUE'
    ELSE '✅ ' || COUNT(*) || ' politiques'
  END as status
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
AND policyname LIKE '%products%';

-- 4. Vérifier les politiques RLS pour le bucket stories
SELECT 
  'POLITIQUES STORIES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUNE POLITIQUE'
    ELSE '✅ ' || COUNT(*) || ' politiques'
  END as status
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' 
AND policyname LIKE '%stories%';

-- 5. Créer le bucket profiles s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE name = 'profiles'
);

-- 6. Créer le bucket products s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'products',
  'products',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE name = 'products'
);

-- 7. Créer le bucket stories s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 
  'stories',
  'stories',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE name = 'stories'
);

-- 8. Créer les politiques RLS pour le bucket profiles
DO $$
BEGIN
  -- Politique pour permettre la lecture publique
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Profiles public read'
  ) THEN
    CREATE POLICY "Profiles public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');
  END IF;

  -- Politique pour permettre l'upload aux utilisateurs authentifiés
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Profiles authenticated upload'
  ) THEN
    CREATE POLICY "Profiles authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'profiles' AND auth.role() = 'authenticated'
    );
  END IF;

  -- Politique pour permettre la mise à jour aux propriétaires
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Profiles owner update'
  ) THEN
    CREATE POLICY "Profiles owner update" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- 9. Créer les politiques RLS pour le bucket products
DO $$
BEGIN
  -- Politique pour permettre la lecture publique
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Products public read'
  ) THEN
    CREATE POLICY "Products public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');
  END IF;

  -- Politique pour permettre l'upload aux vendeurs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Products seller upload'
  ) THEN
    CREATE POLICY "Products seller upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'products' AND auth.role() = 'authenticated' 
      AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_seller = true)
    );
  END IF;
END $$;

-- 10. Créer les politiques RLS pour le bucket stories
DO $$
BEGIN
  -- Politique pour permettre la lecture publique
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Stories public read'
  ) THEN
    CREATE POLICY "Stories public read" ON storage.objects
    FOR SELECT USING (bucket_id = 'stories');
  END IF;

  -- Politique pour permettre l'upload aux vendeurs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' 
    AND policyname = 'Stories seller upload'
  ) THEN
    CREATE POLICY "Stories seller upload" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'stories' AND auth.role() = 'authenticated' 
      AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_seller = true)
    );
  END IF;
END $$;

-- 11. Résultat final
SELECT 
  'RÉSUMÉ' as check_type,
  '🎉 BUCKETS CONFIGURÉS' as status,
  COUNT(*) as count,
  'Buckets de stockage disponibles' as details
FROM storage.buckets 
WHERE name IN ('profiles', 'products', 'stories');
