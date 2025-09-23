-- Script de test pour vérifier la création de produits

-- 1. Vérifier que RLS est désactivé
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '❌ RLS est activé - PROBLÈME!'
    ELSE '✅ RLS est désactivé - OK!'
  END as status
FROM pg_tables 
WHERE tablename = 'products' AND schemaname = 'public';

-- 2. Vérifier que les fonctions existent
SELECT 
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name IN ('create_product', 'generate_unique_slug') THEN '✅ Fonction trouvée'
    ELSE '❌ Fonction manquante'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('create_product', 'generate_unique_slug');

-- 3. Vérifier que le bucket de stockage existe
SELECT 
  id,
  name,
  public,
  CASE 
    WHEN id = 'products' THEN '✅ Bucket products trouvé'
    ELSE '❌ Bucket products manquant'
  END as status
FROM storage.buckets 
WHERE id = 'products';

-- 4. Tester la création d'un produit (remplacez 'your-user-id' par un ID utilisateur réel)
-- SELECT create_product(
--   'your-user-id-here'::uuid,
--   'Produit de Test',
--   'Ceci est un produit de test pour vérifier le bon fonctionnement de la création de produits.',
--   19.99
-- );

-- 5. Vérifier les politiques de stockage
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%products%';

-- 6. Vérifier la structure de la table products
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
