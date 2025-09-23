-- Désactiver RLS pour la table products
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes sur products
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for users based on seller_id" ON public.products;
DROP POLICY IF EXISTS "Enable delete for users based on seller_id" ON public.products;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.products;

-- Vérifier que RLS est bien désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products' AND schemaname = 'public';
