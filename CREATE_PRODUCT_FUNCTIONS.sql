-- Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION generate_unique_slug(input_name TEXT, table_name TEXT, slug_column TEXT DEFAULT 'slug')
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Convertir le nom en slug (minuscules, remplacer espaces par tirets, supprimer caractères spéciaux)
    base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(input_name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Vérifier si le slug existe déjà
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I = $1', table_name, slug_column) INTO counter USING base_slug;
    
    IF counter = 0 THEN
        RETURN base_slug;
    END IF;
    
    -- Ajouter un numéro si le slug existe déjà
    LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
        
        EXECUTE format('SELECT COUNT(*) FROM %I WHERE %I = $1', table_name, slug_column) INTO counter USING final_slug;
        
        EXIT WHEN counter = 0;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer un produit
CREATE OR REPLACE FUNCTION create_product(
    p_seller_id UUID,
    p_name TEXT,
    p_description TEXT,
    p_price NUMERIC,
    p_category_id UUID DEFAULT NULL,
    p_brand_id UUID DEFAULT NULL,
    p_short_description TEXT DEFAULT NULL,
    p_sku TEXT DEFAULT NULL,
    p_compare_price NUMERIC DEFAULT NULL,
    p_cost_price NUMERIC DEFAULT NULL,
    p_weight NUMERIC DEFAULT NULL,
    p_dimensions JSONB DEFAULT NULL,
    p_status CHARACTER VARYING DEFAULT 'active',
    p_inventory_tracking BOOLEAN DEFAULT TRUE,
    p_inventory_quantity INTEGER DEFAULT 0,
    p_allow_backorder BOOLEAN DEFAULT FALSE,
    p_requires_shipping BOOLEAN DEFAULT TRUE,
    p_taxable BOOLEAN DEFAULT TRUE,
    p_tags TEXT[] DEFAULT NULL,
    p_meta_title CHARACTER VARYING DEFAULT NULL,
    p_meta_description TEXT DEFAULT NULL,
    p_video_url TEXT DEFAULT NULL,
    p_primary_image_url TEXT DEFAULT NULL,
    p_images JSONB DEFAULT '[]'::jsonb
)
RETURNS UUID AS $$
DECLARE
    product_id UUID;
    product_slug TEXT;
BEGIN
    -- Générer un slug unique
    product_slug := generate_unique_slug(p_name, 'products', 'slug');
    
    -- Insérer le produit
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
        cost_price,
        weight,
        dimensions,
        status,
        inventory_tracking,
        inventory_quantity,
        allow_backorder,
        requires_shipping,
        taxable,
        tags,
        meta_title,
        meta_description,
        video_url,
        primary_image_url,
        images,
        created_at,
        updated_at
    ) VALUES (
        p_seller_id,
        p_category_id,
        p_brand_id,
        p_name,
        product_slug,
        p_description,
        p_short_description,
        p_sku,
        p_price,
        p_compare_price,
        p_cost_price,
        p_weight,
        p_dimensions,
        p_status,
        p_inventory_tracking,
        p_inventory_quantity,
        p_allow_backorder,
        p_requires_shipping,
        p_taxable,
        p_tags,
        p_meta_title,
        p_meta_description,
        p_video_url,
        p_primary_image_url,
        p_images,
        NOW(),
        NOW()
    ) RETURNING id INTO product_id;
    
    RETURN product_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer des variantes de produit
CREATE OR REPLACE FUNCTION create_product_variants(
    p_product_id UUID,
    p_variants JSONB
)
RETURNS VOID AS $$
DECLARE
    variant JSONB;
    variant_name TEXT;
    variant_options JSONB;
    option_value TEXT;
BEGIN
    -- Parcourir chaque variante
    FOR variant IN SELECT * FROM jsonb_array_elements(p_variants)
    LOOP
        variant_name := variant->>'name';
        variant_options := variant->'options';
        
        -- Insérer chaque option de variante
        FOR option_value IN SELECT jsonb_array_elements_text(variant_options)
        LOOP
            -- Ici vous pouvez créer une table product_variants si nécessaire
            -- Pour l'instant, on stocke tout dans les tags du produit
            UPDATE products 
            SET tags = array_append(COALESCE(tags, '{}'), variant_name || ':' || option_value)
            WHERE id = p_product_id;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
