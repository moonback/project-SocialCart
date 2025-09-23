-- Test de création de produit avec catégories et marques
-- =============================================

-- 1. Vérifier que les catégories et marques existent
-- =============================================
SELECT 'Catégories disponibles:' as info, name, slug FROM categories WHERE is_active = true ORDER BY name;
SELECT 'Marques disponibles:' as info, name, slug FROM brands WHERE is_active = true ORDER BY name;

-- 2. Tester la fonction de création de produit avec une catégorie valide
-- =============================================
-- Cette requête ne sera exécutée que si vous êtes connecté
SELECT create_product(
    p_seller_id := auth.uid(),
    p_name := 'Test Product',
    p_description := 'Produit de test avec catégorie et marque',
    p_price := 29.99,
    p_category_id := '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    p_brand_id := '660e8400-e29b-41d4-a716-446655440001',   -- Apple
    p_short_description := 'Test',
    p_sku := 'TEST-001',
    p_status := 'active',
    p_inventory_tracking := true,
    p_inventory_quantity := 10,
    p_allow_backorder := false,
    p_requires_shipping := true,
    p_taxable := true,
    p_tags := ARRAY['#electronics', '#apple', '#test'],
    p_meta_title := 'Test Product',
    p_meta_description := 'Produit de test',
    p_video_url := null,
    p_primary_image_url := 'https://example.com/test.jpg',
    p_images := ARRAY['https://example.com/test.jpg']
) as product_id;

-- 3. Vérifier que le produit a été créé avec les bonnes catégories et marques
-- =============================================
SELECT 
    p.id,
    p.name,
    p.price,
    c.name as category_name,
    b.name as brand_name,
    p.tags,
    p.created_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.seller_id = auth.uid()
ORDER BY p.created_at DESC
LIMIT 5;

-- 4. Test avec des valeurs nulles (pas de catégorie/marque)
-- =============================================
SELECT create_product(
    p_seller_id := auth.uid(),
    p_name := 'Test Product Sans Catégorie',
    p_description := 'Produit de test sans catégorie spécifique',
    p_price := 19.99,
    p_category_id := null,
    p_brand_id := null,
    p_short_description := 'Test sans catégorie',
    p_sku := 'TEST-002',
    p_status := 'active',
    p_inventory_tracking := true,
    p_inventory_quantity := 5,
    p_allow_backorder := false,
    p_requires_shipping := true,
    p_taxable := true,
    p_tags := ARRAY['#test', '#general'],
    p_meta_title := 'Test Product Sans Catégorie',
    p_meta_description := 'Produit de test sans catégorie',
    p_video_url := null,
    p_primary_image_url := null,
    p_images := ARRAY[]::text[]
) as product_id;
