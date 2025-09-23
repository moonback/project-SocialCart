-- =============================================
-- CORRECTION DES ERREURS DE BASE DE DONNÉES
-- =============================================

-- Vérifier et corriger les colonnes manquantes dans la table orders
-- (Si total_amount n'existe pas, utiliser total à la place)

-- Vérifier et corriger les colonnes manquantes dans la table order_items
-- (Si price n'existe pas, utiliser unit_price à la place)

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- Vérifier que les tables nécessaires existent
DO $$
BEGIN
    -- Vérifier la table orders
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        RAISE EXCEPTION 'Table orders does not exist. Please run the main database schema first.';
    END IF;

    -- Vérifier la table order_items
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
        RAISE EXCEPTION 'Table order_items does not exist. Please run the main database schema first.';
    END IF;

    -- Vérifier la table follows
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'follows') THEN
        RAISE EXCEPTION 'Table follows does not exist. Please run the main database schema first.';
    END IF;

    -- Vérifier la table reviews
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        RAISE EXCEPTION 'Table reviews does not exist. Please run the main database schema first.';
    END IF;

    RAISE NOTICE 'All required tables exist. Database structure is correct.';
END $$;
