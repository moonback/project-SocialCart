-- Fonction pour incrémenter le compteur de vues d'un produit
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION increment_product_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_views(UUID) TO anon;
