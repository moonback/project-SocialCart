-- Script Simplifié pour Configurer le Stockage Supabase
-- =====================================================

-- 1. Créer le bucket profiles
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

-- 2. Créer le bucket products
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

-- 3. Créer le bucket stories
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

-- 4. Activer RLS sur storage.objects si pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Politiques pour profiles
CREATE POLICY IF NOT EXISTS "Profiles public read" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY IF NOT EXISTS "Profiles authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Profiles owner update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Politiques pour products
CREATE POLICY IF NOT EXISTS "Products public read" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Products seller upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND auth.role() = 'authenticated' 
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_seller = true)
);

-- 7. Politiques pour stories
CREATE POLICY IF NOT EXISTS "Stories public read" ON storage.objects
FOR SELECT USING (bucket_id = 'stories');

CREATE POLICY IF NOT EXISTS "Stories seller upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories' AND auth.role() = 'authenticated' 
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_seller = true)
);

-- 8. Vérification finale
SELECT 
  'BUCKETS CRÉÉS' as status,
  COUNT(*) as count,
  'Buckets de stockage disponibles' as details
FROM storage.buckets 
WHERE name IN ('profiles', 'products', 'stories');

-- 9. Vérification des politiques
SELECT 
  'POLITIQUES CRÉÉES' as status,
  COUNT(*) as count,
  'Politiques RLS configurées' as details
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
