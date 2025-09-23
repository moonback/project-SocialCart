-- Script de vérification et correction pour l'upload de photos de profil
-- =============================================

-- 1. Vérifier que la table users existe et a la colonne avatar_url
-- =============================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'avatar_url';

-- 2. Créer le bucket profiles s'il n'existe pas
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Supprimer les anciennes politiques si elles existent
-- =============================================
DROP POLICY IF EXISTS "Public Access Profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile" ON storage.objects;

-- 4. Créer les nouvelles politiques pour le bucket profiles
-- =============================================
CREATE POLICY "Public Access Profiles" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload own profile" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own profile" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own profile" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
);

-- 5. Vérifier que tout est bien configuré
-- =============================================
SELECT 'Bucket profiles créé:' as status, * FROM storage.buckets WHERE id = 'profiles';
SELECT 'Politiques créées:' as status, COUNT(*) as count FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile%';
