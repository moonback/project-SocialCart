-- Configuration du bucket de stockage pour les stories
-- À exécuter dans Supabase SQL Editor

-- 1. Créer le bucket pour les médias des stories
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stories-media',
  'stories-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- 2. Créer les politiques RLS pour le bucket
-- Politique pour permettre à tous les utilisateurs authentifiés de lire les fichiers
CREATE POLICY "Stories media are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'stories-media');

-- Politique pour permettre aux utilisateurs de télécharger leurs propres fichiers
CREATE POLICY "Users can upload their own story media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres fichiers
CREATE POLICY "Users can update their own story media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres fichiers
CREATE POLICY "Users can delete their own story media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'stories-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Créer une fonction pour nettoyer les fichiers orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_story_media()
RETURNS void AS $$
DECLARE
  file_record RECORD;
BEGIN
  -- Supprimer les fichiers qui ne sont plus référencés dans product_stories
  FOR file_record IN 
    SELECT name FROM storage.objects 
    WHERE bucket_id = 'stories-media'
  LOOP
    -- Vérifier si le fichier est encore référencé
    IF NOT EXISTS (
      SELECT 1 FROM public.product_stories 
      WHERE media_url LIKE '%' || file_record.name || '%'
    ) THEN
      -- Supprimer le fichier orphelin
      DELETE FROM storage.objects 
      WHERE bucket_id = 'stories-media' AND name = file_record.name;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Créer une fonction pour obtenir l'URL publique d'un fichier
CREATE OR REPLACE FUNCTION get_story_media_url(file_path text)
RETURNS text AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/stories-media/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer un trigger pour nettoyer automatiquement les fichiers lors de la suppression d'une story
CREATE OR REPLACE FUNCTION delete_story_media_file()
RETURNS trigger AS $$
DECLARE
  file_path text;
BEGIN
  -- Extraire le chemin du fichier de l'URL
  file_path := regexp_replace(OLD.media_url, '^.*stories-media/', '');
  
  -- Supprimer le fichier du storage
  DELETE FROM storage.objects 
  WHERE bucket_id = 'stories-media' AND name = file_path;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_delete_story_media_file
  BEFORE DELETE ON public.product_stories
  FOR EACH ROW
  EXECUTE FUNCTION delete_story_media_file();

-- 6. Créer une fonction pour compresser les images (optionnel)
CREATE OR REPLACE FUNCTION compress_story_image(image_url text, quality integer DEFAULT 80)
RETURNS text AS $$
BEGIN
  -- Cette fonction pourrait être implémentée avec un service externe
  -- comme Cloudinary, ImageKit, ou un service de compression personnalisé
  RETURN image_url || '?quality=' || quality;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Bucket stories-media créé avec succès !';
  RAISE NOTICE 'Politiques RLS configurées pour la sécurité';
  RAISE NOTICE 'Fonctions utilitaires créées pour la gestion des fichiers';
  RAISE NOTICE 'Trigger de nettoyage automatique configuré';
END $$;
