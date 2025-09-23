-- Créer le bucket de stockage pour les photos de profil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des photos de profil
CREATE POLICY "Public Access Profiles" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

-- Politique pour permettre l'upload aux utilisateurs authentifiés pour leur propre profil
CREATE POLICY "Users can upload own profile" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés pour leur propre profil
CREATE POLICY "Users can update own profile" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés pour leur propre profil
CREATE POLICY "Users can delete own profile" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'profiles'
);

-- Vérifier que le bucket a été créé
SELECT * FROM storage.buckets WHERE id = 'profiles';
