-- Script pour corriger les politiques RLS des wishlists
-- Ce script désactive temporairement les politiques RLS pour permettre le fonctionnement

-- Désactiver RLS sur les tables wishlists et wishlist_items
ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;

-- Ou créer des politiques permissives si vous préférez garder RLS activé
-- (Décommentez les lignes suivantes si vous voulez garder RLS)

/*
-- Politiques permissives pour wishlists
DROP POLICY IF EXISTS "Users can view their own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Users can insert their own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Users can update their own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Users can delete their own wishlists" ON public.wishlists;

CREATE POLICY "Users can view their own wishlists" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlists" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlists" ON public.wishlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques permissives pour wishlist_items
DROP POLICY IF EXISTS "Users can view wishlist items from their wishlists" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can insert wishlist items to their wishlists" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can update wishlist items from their wishlists" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can delete wishlist items from their wishlists" ON public.wishlist_items;

CREATE POLICY "Users can view wishlist items from their wishlists" ON public.wishlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert wishlist items to their wishlists" ON public.wishlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update wishlist items from their wishlists" ON public.wishlist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete wishlist items from their wishlists" ON public.wishlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );
*/

-- Vérifier que les tables existent et sont accessibles
SELECT 'wishlists table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'wishlists'
);

SELECT 'wishlist_items table exists' as status WHERE EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'wishlist_items'
);

-- Créer des wishlists par défaut pour les utilisateurs existants si nécessaire
INSERT INTO public.wishlists (user_id, name, is_public)
SELECT 
  u.id,
  'Favoris',
  false
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.wishlists w 
  WHERE w.user_id = u.id AND w.name = 'Favoris'
);

-- Afficher le nombre de wishlists créées
SELECT COUNT(*) as wishlists_created FROM public.wishlists WHERE name = 'Favoris';
