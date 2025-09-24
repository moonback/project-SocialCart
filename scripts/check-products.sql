-- Script pour vérifier et créer des produits de test
-- =====================================================

-- 1. Vérifier les produits existants
SELECT 
  'PRODUITS EXISTANTS' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUN PRODUIT'
    WHEN COUNT(*) < 5 THEN '⚠️ PEU DE PRODUITS (' || COUNT(*) || ')'
    ELSE '✅ SUFFISANT (' || COUNT(*) || ')'
  END as status
FROM products 
WHERE status = 'active';

-- 2. Vérifier les catégories
SELECT 
  'CATÉGORIES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUNE CATÉGORIE'
    ELSE '✅ ' || COUNT(*) || ' catégories'
  END as status
FROM categories;

-- 3. Vérifier les marques
SELECT 
  'MARQUES' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ AUCUNE MARQUE'
    ELSE '✅ ' || COUNT(*) || ' marques'
  END as status
FROM brands;

-- 4. Créer des produits de test si nécessaire
INSERT INTO products (
  id,
  seller_id,
  category_id,
  brand_id,
  name,
  slug,
  description,
  short_description,
  price,
  primary_image_url,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM users WHERE is_seller = true LIMIT 1),
  (SELECT id FROM categories LIMIT 1),
  (SELECT id FROM brands LIMIT 1),
  'Produit Test ' || (ROW_NUMBER() OVER ()),
  'produit-test-' || (ROW_NUMBER() OVER ()),
  'Description du produit test ' || (ROW_NUMBER() OVER ()),
  'Produit de test',
  29.99 + (ROW_NUMBER() OVER () * 10),
  'https://via.placeholder.com/400x400/6366f1/ffffff?text=Test+' || (ROW_NUMBER() OVER ()),
  'active',
  NOW(),
  NOW()
FROM generate_series(1, 5) 
WHERE (SELECT COUNT(*) FROM products WHERE status = 'active') < 5
ON CONFLICT DO NOTHING;

-- 5. Résultat final
SELECT 
  'RÉSUMÉ' as check_type,
  '🎉 PRODUITS VÉRIFIÉS' as status,
  COUNT(*) as count,
  'Produits actifs disponibles' as details
FROM products 
WHERE status = 'active';
