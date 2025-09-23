-- Création des tables de catégories et marques
-- =============================================

-- 1. Créer la table des catégories
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table des marques
-- =============================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insérer les catégories prédéfinies
-- =============================================
INSERT INTO categories (id, name, slug, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Électronique', 'electronics', 'Appareils électroniques et gadgets'),
('550e8400-e29b-41d4-a716-446655440002', 'Mode & Accessoires', 'fashion', 'Vêtements et accessoires de mode'),
('550e8400-e29b-41d4-a716-446655440003', 'Maison & Jardin', 'home', 'Articles pour la maison et le jardin'),
('550e8400-e29b-41d4-a716-446655440004', 'Sports & Loisirs', 'sports', 'Équipements sportifs et loisirs'),
('550e8400-e29b-41d4-a716-446655440005', 'Beauté & Santé', 'beauty', 'Produits de beauté et santé'),
('550e8400-e29b-41d4-a716-446655440006', 'Alimentation', 'food', 'Produits alimentaires et boissons'),
('550e8400-e29b-41d4-a716-446655440007', 'Livres & Médias', 'books', 'Livres, films et médias'),
('550e8400-e29b-41d4-a716-446655440008', 'Automobile', 'automotive', 'Pièces et accessoires automobiles'),
('550e8400-e29b-41d4-a716-446655440009', 'Jouets & Enfants', 'toys', 'Jouets et articles pour enfants'),
('550e8400-e29b-41d4-a716-446655440010', 'Autres', 'other', 'Autres catégories')
ON CONFLICT (id) DO NOTHING;

-- 4. Insérer les marques prédéfinies
-- =============================================
INSERT INTO brands (id, name, slug, description) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Apple', 'apple', 'Technologie Apple'),
('660e8400-e29b-41d4-a716-446655440002', 'Samsung', 'samsung', 'Électronique Samsung'),
('660e8400-e29b-41d4-a716-446655440003', 'Nike', 'nike', 'Équipements sportifs Nike'),
('660e8400-e29b-41d4-a716-446655440004', 'Adidas', 'adidas', 'Équipements sportifs Adidas'),
('660e8400-e29b-41d4-a716-446655440005', 'Sony', 'sony', 'Électronique Sony'),
('660e8400-e29b-41d4-a716-446655440006', 'LG', 'lg', 'Électronique LG'),
('660e8400-e29b-41d4-a716-446655440007', 'Dell', 'dell', 'Informatique Dell'),
('660e8400-e29b-41d4-a716-446655440008', 'HP', 'hp', 'Informatique HP'),
('660e8400-e29b-41d4-a716-446655440009', 'Canon', 'canon', 'Photographie Canon'),
('660e8400-e29b-41d4-a716-446655440010', 'Autre', 'other', 'Autres marques')
ON CONFLICT (id) DO NOTHING;

-- 5. Ajouter les contraintes de clés étrangères aux produits
-- =============================================
ALTER TABLE products 
ADD CONSTRAINT fk_products_category 
FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products 
ADD CONSTRAINT fk_products_brand 
FOREIGN KEY (brand_id) REFERENCES brands(id);

-- 6. Créer les index pour améliorer les performances
-- =============================================
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

-- 7. Activer RLS sur les nouvelles tables
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- 8. Créer les politiques RLS pour les catégories
-- =============================================
CREATE POLICY "Categories are publicly readable" ON categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" ON categories
FOR ALL USING (auth.role() = 'authenticated');

-- 9. Créer les politiques RLS pour les marques
-- =============================================
CREATE POLICY "Brands are publicly readable" ON brands
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage brands" ON brands
FOR ALL USING (auth.role() = 'authenticated');

-- 10. Vérifier que tout a été créé correctement
-- =============================================
SELECT 'Categories créées:' as status, COUNT(*) as count FROM categories;
SELECT 'Brands créées:' as status, COUNT(*) as count FROM brands;
SELECT 'Contraintes ajoutées:' as status, 
       COUNT(*) as count 
FROM information_schema.table_constraints 
WHERE constraint_name IN ('fk_products_category', 'fk_products_brand');
