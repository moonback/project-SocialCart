# 🗄️ Configuration de la Base de Données - SocialCart

## Instructions pour configurer la base de données

### 1. **Désactiver RLS pour la table products**

Exécutez le script `DISABLE_RLS_FOR_PRODUCTS.sql` dans votre console Supabase SQL :

```sql
-- Désactiver RLS pour la table products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes sur products
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for users based on seller_id" ON public.products;
DROP POLICY IF EXISTS "Enable delete for users based on seller_id" ON public.products;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.products;
```

### 2. **Créer les fonctions PostgreSQL**

Exécutez le script `CREATE_PRODUCT_FUNCTIONS.sql` dans votre console Supabase SQL :

```sql
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
    p_inventory_quantity INTEGER DEFAULT 0,
    p_tags TEXT[] DEFAULT NULL,
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
        inventory_quantity,
        tags,
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
        p_compare_price,
        p_cost_price,
        p_weight,
        p_dimensions,
        'active',
        p_inventory_quantity,
        p_tags,
        p_video_url,
        p_primary_image_url,
        p_images,
        NOW(),
        NOW()
    ) RETURNING id INTO product_id;
    
    RETURN product_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. **Configurer le stockage Supabase**

Exécutez le script `SETUP_STORAGE_BUCKET.sql` dans votre console Supabase SQL :

```sql
-- Créer le bucket de stockage pour les produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des fichiers
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

### 4. **Vérifications**

#### Vérifier que RLS est désactivé :
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products' AND schemaname = 'public';
```

#### Vérifier que le bucket de stockage existe :
```sql
SELECT * FROM storage.buckets WHERE id = 'products';
```

#### Tester la création d'un produit :
```sql
SELECT create_product(
  'your-user-id-here'::uuid,
  'Test Product',
  'Description du produit test',
  29.99
);
```

### 5. **Configuration des variables d'environnement**

Assurez-vous que votre fichier `.env.local` contient :

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 6. **Test de la fonctionnalité**

1. **Démarrez l'application** : `npm run dev`
2. **Connectez-vous** à votre compte
3. **Naviguez vers "Créer"** dans la bottom navigation
4. **Remplissez le formulaire** avec :
   - Nom du produit
   - Description
   - Prix
   - Images/vidéos
   - Variantes (optionnel)
5. **Cliquez sur "Publier le produit"**

### 7. **Dépannage**

#### Si vous obtenez une erreur RLS :
- Vérifiez que RLS est bien désactivé sur la table `products`
- Exécutez à nouveau le script `DISABLE_RLS_FOR_PRODUCTS.sql`

#### Si l'upload de fichiers échoue :
- Vérifiez que le bucket `products` existe dans Supabase Storage
- Vérifiez les politiques de stockage
- Vérifiez que l'utilisateur est bien authentifié

#### Si la création de produit échoue :
- Vérifiez que la fonction `create_product` existe
- Vérifiez les logs dans la console du navigateur
- Vérifiez que tous les champs requis sont remplis

### 8. **Structure de la table products**

Votre table `products` doit contenir ces colonnes principales :
- `id` (UUID, primary key)
- `seller_id` (UUID, foreign key vers users)
- `name` (VARCHAR, requis)
- `slug` (VARCHAR, unique, généré automatiquement)
- `description` (TEXT, requis)
- `price` (NUMERIC, requis)
- `primary_image_url` (TEXT)
- `images` (JSONB array)
- `video_url` (TEXT)
- `status` (VARCHAR, default 'active')
- `tags` (TEXT array)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

**Une fois ces étapes terminées, la création de produits devrait fonctionner parfaitement !** 🚀
