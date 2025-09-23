-- Script pour créer 10 produits fictifs avec images et vidéos
-- UID du vendeur: cf219999-b08b-458b-bd59-31356a4244a2
-- =============================================

-- 1. iPhone 15 Pro - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440001', -- Apple
    'iPhone 15 Pro 256GB Titanium Bleu',
    'iphone-15-pro-256gb-titanium-bleu',
    'Découvrez le nouveau iPhone 15 Pro avec son design en titane premium et ses performances exceptionnelles. Écran Super Retina XDR de 6,1 pouces, puce A17 Pro, système de caméra Pro avec téléobjectif 3x, et résistance à l''eau IP68.',
    'iPhone 15 Pro 256GB en titane bleu avec caméra Pro et puce A17 Pro.',
    'APPLE-IP15P-256-BLEU',
    1199.99,
    1299.99,
    187.0,
    '{"length": 14.67, "width": 7.15, "height": 0.83, "unit": "cm"}',
    'active',
    true,
    25,
    ARRAY['smartphone', 'apple', 'titanium', 'bleu', 'caméra', 'pro', '256gb'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop"
    ]',
    'iPhone 15 Pro 256GB Bleu Titanium - Apple',
    'iPhone 15 Pro avec design titane, caméra Pro et puce A17 Pro. Stock limité!'
);

-- 2. Nike Air Max 270 - Sport
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440004', -- Sports & Loisirs
    '660e8400-e29b-41d4-a716-446655440003', -- Nike
    'Nike Air Max 270 Homme Noir/Blanc',
    'nike-air-max-270-homme-noir-blanc',
    'Les Nike Air Max 270 combinent style et performance avec leur technologie Air Max visible. Semelle extérieure en caoutchouc pour une durabilité maximale et une traction optimale sur tous les terrains.',
    'Chaussures Nike Air Max 270 avec technologie Air Max visible.',
    'NIKE-AM270-BLACK',
    129.99,
    159.99,
    320.0,
    '{"length": 32, "width": 12, "height": 10, "unit": "cm"}',
    'active',
    true,
    40,
    ARRAY['chaussures', 'nike', 'air max', 'sport', 'noir', 'blanc', 'running'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ]',
    'Nike Air Max 270 Noir/Blanc - Chaussures de Sport',
    'Nike Air Max 270 avec technologie Air Max. Confort et style garantis!'
);

-- 3. MacBook Pro 14" - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440001', -- Apple
    'MacBook Pro 14" M3 Pro 512GB Gris Sidéral',
    'macbook-pro-14-m3-pro-512gb-gris-sideral',
    'MacBook Pro 14 pouces avec puce M3 Pro pour des performances professionnelles exceptionnelles. Écran Liquid Retina XDR, jusqu''à 18 heures d''autonomie, et ports Thunderbolt 4.',
    'MacBook Pro 14" avec puce M3 Pro et écran Liquid Retina XDR.',
    'APPLE-MBP14-M3PRO-512',
    2199.99,
    2499.99,
    1600.0,
    '{"length": 31.26, "width": 22.12, "height": 1.55, "unit": "cm"}',
    'active',
    true,
    15,
    ARRAY['laptop', 'macbook', 'apple', 'm3 pro', 'professionnel', '512gb'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop"
    ]',
    'MacBook Pro 14" M3 Pro 512GB - Apple',
    'MacBook Pro avec puce M3 Pro et écran Liquid Retina XDR. Performance professionnelle!'
);

-- 4. Samsung Galaxy Watch 6 - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440002', -- Samsung
    'Samsung Galaxy Watch 6 44mm Noir',
    'samsung-galaxy-watch-6-44mm-noir',
    'Montre connectée Samsung Galaxy Watch 6 avec écran AMOLED Super, suivi de santé avancé, résistance à l''eau 5ATM, et autonomie jusqu''à 40 heures. Compatible Android et iOS.',
    'Montre connectée Samsung Galaxy Watch 6 avec suivi de santé avancé.',
    'SAMSUNG-GW6-44-BLACK',
    279.99,
    329.99,
    30.0,
    '{"length": 4.4, "width": 4.4, "height": 0.9, "unit": "cm"}',
    'active',
    true,
    35,
    ARRAY['montre', 'connectée', 'samsung', 'galaxy', 'santé', 'fitness', 'noir'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop"
    ]',
    'Samsung Galaxy Watch 6 44mm Noir - Montre Connectée',
    'Galaxy Watch 6 avec écran AMOLED et suivi de santé. Autonomie 40h!'
);

-- 5. Casque Sony WH-1000XM5 - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440005', -- Sony
    'Casque Sony WH-1000XM5 Réduction de Bruit Noir',
    'casque-sony-wh-1000xm5-reduction-bruit-noir',
    'Casque audio premium Sony WH-1000XM5 avec réduction de bruit leader du marché, son haute résolution, autonomie 30h, et charge rapide 3 minutes = 3h d''écoute.',
    'Casque Sony WH-1000XM5 avec réduction de bruit et son haute résolution.',
    'SONY-WH1000XM5-BLACK',
    349.99,
    399.99,
    250.0,
    '{"length": 26.5, "width": 18.5, "height": 8.0, "unit": "cm"}',
    'active',
    true,
    20,
    ARRAY['casque', 'sony', 'réduction', 'bruit', 'audio', 'noir', 'bluetooth'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop"
    ]',
    'Sony WH-1000XM5 Noir - Casque Réduction de Bruit',
    'Casque Sony avec réduction de bruit leader. Son haute résolution et 30h d''autonomie!'
);

-- 6. Adidas Ultraboost 22 - Sport
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440004', -- Sports & Loisirs
    '660e8400-e29b-41d4-a716-446655440004', -- Adidas
    'Adidas Ultraboost 22 Homme Blanc/Core Noir',
    'adidas-ultraboost-22-homme-blanc-core-noir',
    'Chaussures de running Adidas Ultraboost 22 avec technologie Boost pour un retour d''énergie optimal. Tige Primeknit+ pour un ajustement parfait et une respirabilité maximale.',
    'Chaussures Adidas Ultraboost 22 avec technologie Boost et tige Primeknit+.',
    'ADIDAS-UB22-WHITE',
    179.99,
    200.00,
    290.0,
    '{"length": 32, "width": 12, "height": 10, "unit": "cm"}',
    'active',
    true,
    30,
    ARRAY['chaussures', 'adidas', 'ultraboost', 'running', 'boost', 'blanc'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_30mb.mp4',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop"
    ]',
    'Adidas Ultraboost 22 Blanc - Chaussures de Running',
    'Ultraboost 22 avec technologie Boost. Confort et performance pour la course!'
);

-- 7. Canon EOS R6 Mark II - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440009', -- Canon
    'Canon EOS R6 Mark II Boîtier Noir',
    'canon-eos-r6-mark-ii-boitier-noir',
    'Appareil photo hybride Canon EOS R6 Mark II avec capteur CMOS 24.2MP, stabilisation d''image 5 axes, vidéo 4K 60p, et autofocus Dual Pixel CMOS AF II.',
    'Appareil photo Canon EOS R6 Mark II avec capteur 24.2MP et vidéo 4K.',
    'CANON-R6M2-BODY',
    2499.99,
    2799.99,
    588.0,
    '{"length": 13.8, "width": 9.8, "height": 8.8, "unit": "cm"}',
    'active',
    true,
    8,
    ARRAY['appareil', 'photo', 'canon', 'eos', 'hybride', '4k', 'professionnel'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_20mb.mp4',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop"
    ]',
    'Canon EOS R6 Mark II - Appareil Photo Hybride',
    'Canon EOS R6 Mark II avec capteur 24.2MP et vidéo 4K 60p. Performance pro!'
);

-- 8. PlayStation 5 - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440005', -- Sony
    'PlayStation 5 Console Standard Blanc',
    'playstation-5-console-standard-blanc',
    'Console de jeu PlayStation 5 avec lecteur Blu-ray Ultra HD, stockage SSD ultra-rapide, ray tracing en temps réel, et support du retour haptique via la manette DualSense.',
    'Console PlayStation 5 avec lecteur Blu-ray et stockage SSD ultra-rapide.',
    'SONY-PS5-STANDARD',
    499.99,
    549.99,
    4200.0,
    '{"length": 39.0, "width": 26.0, "height": 9.6, "unit": "cm"}',
    'active',
    true,
    12,
    ARRAY['console', 'jeu', 'playstation', 'ps5', 'blu-ray', 'gaming', 'blanc'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop"
    ]',
    'PlayStation 5 Console Standard - Sony',
    'Console PS5 avec lecteur Blu-ray et SSD ultra-rapide. Gaming nouvelle génération!'
);

-- 9. Dell XPS 13 - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440007', -- Dell
    'Dell XPS 13 Plus 9320 Intel i7 512GB Argent',
    'dell-xps-13-plus-9320-intel-i7-512gb-argent',
    'Laptop ultraportable Dell XPS 13 Plus avec processeur Intel Core i7-1260P, 16GB RAM, SSD 512GB, écran 13.4" OLED 3.5K, et design premium en aluminium.',
    'Laptop Dell XPS 13 Plus avec Intel i7, écran OLED 3.5K et design premium.',
    'DELL-XPS13P-I7-512',
    1599.99,
    1799.99,
    1270.0,
    '{"length": 29.57, "width": 19.87, "height": 1.43, "unit": "cm"}',
    'active',
    true,
    18,
    ARRAY['laptop', 'dell', 'xps', 'intel', 'i7', 'oled', 'ultraportable', 'argent'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop"
    ]',
    'Dell XPS 13 Plus Intel i7 512GB - Laptop Premium',
    'Dell XPS 13 Plus avec Intel i7 et écran OLED 3.5K. Performance et style!'
);

-- 10. HP LaserJet Pro - Électronique
INSERT INTO products (
    seller_id,
    category_id,
    brand_id,
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    compare_price,
    weight,
    dimensions,
    status,
    inventory_tracking,
    inventory_quantity,
    tags,
    video_url,
    primary_image_url,
    images,
    meta_title,
    meta_description
) VALUES (
    'cf219999-b08b-458b-bd59-31356a4244a2',
    '550e8400-e29b-41d4-a716-446655440001', -- Électronique
    '660e8400-e29b-41d4-a716-446655440008', -- HP
    'HP LaserJet Pro M404dn Imprimante Laser Noir',
    'hp-laserjet-pro-m404dn-imprimante-laser-noir',
    'Imprimante laser HP LaserJet Pro M404dn avec impression recto-verso automatique, vitesse jusqu''à 38 ppm, connectivité réseau Ethernet et USB, et toners haute capacité.',
    'Imprimante laser HP LaserJet Pro M404dn avec impression recto-verso automatique.',
    'HP-M404DN-LASER',
    199.99,
    249.99,
    7500.0,
    '{"length": 37.0, "width": 24.0, "height": 22.0, "unit": "cm"}',
    'active',
    true,
    22,
    ARRAY['imprimante', 'laser', 'hp', 'bureau', 'réseau', 'recto-verso', 'noir'],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop',
    '[
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop"
    ]',
    'HP LaserJet Pro M404dn - Imprimante Laser Professionnelle',
    'Imprimante laser HP avec impression recto-verso et connectivité réseau. Idéal bureau!'
);

-- =============================================
-- Mise à jour des statistiques des produits créés
-- =============================================

-- Ajouter quelques likes et vues pour rendre les produits plus réalistes
UPDATE products SET 
    likes_count = FLOOR(RANDOM() * 50) + 10,
    views_count = FLOOR(RANDOM() * 200) + 50,
    sales_count = FLOOR(RANDOM() * 10) + 1,
    rating_average = ROUND((RANDOM() * 2 + 3)::numeric, 1),
    rating_count = FLOOR(RANDOM() * 25) + 5
WHERE seller_id = 'cf219999-b08b-458b-bd59-31356a4244a2';

-- =============================================
-- Résumé des produits créés
-- =============================================

SELECT 
    name,
    price,
    category_id,
    brand_id,
    inventory_quantity,
    likes_count,
    views_count,
    rating_average
FROM products 
WHERE seller_id = 'cf219999-b08b-458b-bd59-31356a4244a2'
ORDER BY created_at DESC;
