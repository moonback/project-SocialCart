-- Script de configuration du système de Stories Produits
-- À exécuter dans Supabase SQL Editor

-- 1. Créer le bucket de stockage pour les stories
INSERT INTO storage.buckets (id, name, public)
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurer les politiques de stockage
CREATE POLICY "Anyone can view story files" ON storage.objects
FOR SELECT USING (bucket_id = 'stories');

CREATE POLICY "Authenticated users can upload story files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'stories' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own story files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own story files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'stories' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Exécuter le schéma principal
-- (Le contenu du fichier product_stories_schema.sql sera exécuté ici)

-- 4. Créer quelques stories d'exemple pour les tests
INSERT INTO product_stories (
  product_id,
  seller_id,
  type,
  content,
  media_url,
  thumbnail_url,
  duration,
  background_color,
  text_color,
  font_size,
  expires_at
) VALUES (
  (SELECT id FROM products LIMIT 1),
  (SELECT id FROM users WHERE is_seller = true LIMIT 1),
  'text',
  'Découvrez notre nouveau produit ! 🚀',
  NULL,
  NULL,
  5,
  '#ff6b6b',
  '#FFFFFF',
  'large',
  NOW() + INTERVAL '24 hours'
);

-- 5. Créer une story avec sondage
INSERT INTO product_stories (
  product_id,
  seller_id,
  type,
  content,
  media_url,
  thumbnail_url,
  duration,
  background_color,
  text_color,
  font_size,
  poll_options,
  poll_results,
  expires_at
) VALUES (
  (SELECT id FROM products LIMIT 1),
  (SELECT id FROM users WHERE is_seller = true LIMIT 1),
  'poll',
  'Quelle couleur préférez-vous ?',
  NULL,
  NULL,
  8,
  '#4ecdc4',
  '#FFFFFF',
  'medium',
  '["Rouge", "Bleu", "Vert", "Noir"]',
  '{}',
  NOW() + INTERVAL '24 hours'
);

-- 6. Créer une story avec quiz
INSERT INTO product_stories (
  product_id,
  seller_id,
  type,
  content,
  media_url,
  thumbnail_url,
  duration,
  background_color,
  text_color,
  font_size,
  quiz_question,
  quiz_options,
  quiz_answer,
  quiz_results,
  expires_at
) VALUES (
  (SELECT id FROM products LIMIT 1),
  (SELECT id FROM users WHERE is_seller = true LIMIT 1),
  'quiz',
  'Testez vos connaissances !',
  NULL,
  NULL,
  10,
  '#45b7d1',
  '#FFFFFF',
  'medium',
  'Quel est le matériau principal de ce produit ?',
  '["Plastique", "Métal", "Bois", "Verre"]',
  'Métal',
  '{}',
  NOW() + INTERVAL '24 hours'
);

-- 7. Vérifier que tout fonctionne
SELECT 
  'Stories créées avec succès !' as message,
  COUNT(*) as total_stories
FROM product_stories 
WHERE is_active = true;
