# 📚 API Documentation - Shopping Connect

## Vue d'Ensemble

Shopping Connect utilise **Supabase** comme Backend-as-a-Service, fournissant une API REST complète avec authentification, base de données PostgreSQL et storage. Cette documentation couvre tous les endpoints disponibles et leur utilisation.

## 🔐 Authentification

### Configuration Supabase
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);
```

### Endpoints d'Authentification

#### **Inscription Utilisateur**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      username: 'john_doe',
      full_name: 'John Doe'
    }
  }
});
```

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "username": "john_doe",
      "full_name": "John Doe"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### **Connexion Utilisateur**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### **Déconnexion**
```typescript
const { error } = await supabase.auth.signOut();
```

#### **Récupération de Mot de Passe**
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: 'https://yourapp.com/reset-password'
  }
);
```

## 👤 Gestion des Utilisateurs

### Table `users`

#### **Récupérer le Profil Utilisateur**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

**Réponse :**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "full_name": "John Doe",
  "avatar_url": "https://storage.supabase.co/...",
  "phone": "+33123456789",
  "loyalty_points": 150,
  "is_seller": true,
  "is_verified": false,
  "bio": "Passionné de mode",
  "location": "Paris, France",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### **Mettre à Jour le Profil**
```typescript
const { data, error } = await supabase
  .from('users')
  .update({
    username: 'new_username',
    bio: 'Nouvelle bio',
    location: 'Lyon, France'
  })
  .eq('id', userId);
```

#### **Upload d'Avatar**
```typescript
// 1. Upload du fichier
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('profiles')
  .upload(`avatar-${userId}-${Date.now()}.jpg`, file);

// 2. Mise à jour de l'URL
const { error } = await supabase
  .from('users')
  .update({ avatar_url: uploadData.path })
  .eq('id', userId);
```

## 🛍️ Gestion des Produits

### Table `products`

#### **Récupérer Tous les Produits**
```typescript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    seller:users!products_seller_id_fkey(
      id,
      username,
      avatar_url,
      email
    )
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "name": "T-shirt Premium",
    "description": "T-shirt en coton bio",
    "price": 29.99,
    "primary_image_url": "https://storage.supabase.co/...",
    "images": ["url1", "url2"],
    "video_url": "https://storage.supabase.co/...",
    "likes_count": 42,
    "views_count": 156,
    "sales_count": 8,
    "seller": {
      "id": "uuid",
      "username": "fashion_store",
      "avatar_url": "https://storage.supabase.co/...",
      "email": "store@example.com"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### **Récupérer un Produit par ID**
```typescript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    seller:users!products_seller_id_fkey(*),
    category:categories(*),
    brand:brands(*)
  `)
  .eq('id', productId)
  .single();
```

#### **Créer un Produit**
```typescript
const { data, error } = await supabase.rpc('create_product', {
  p_seller_id: userId,
  p_name: 'Nouveau Produit',
  p_description: 'Description du produit',
  p_price: 49.99,
  p_category_id: 'category-uuid',
  p_brand_id: 'brand-uuid',
  p_short_description: 'Description courte',
  p_sku: 'SKU-001',
  p_compare_price: 59.99,
  p_weight: 0.5,
  p_dimensions: {
    length: 30,
    width: 20,
    height: 2,
    unit: 'cm'
  },
  p_status: 'active',
  p_inventory_tracking: true,
  p_inventory_quantity: 100,
  p_allow_backorder: false,
  p_requires_shipping: true,
  p_taxable: true,
  p_tags: ['mode', 'casual', 'cotton'],
  p_meta_title: 'Titre SEO',
  p_meta_description: 'Description SEO',
  p_video_url: 'https://storage.supabase.co/...',
  p_primary_image_url: 'https://storage.supabase.co/...',
  p_images: ['url1', 'url2', 'url3']
});
```

#### **Mettre à Jour un Produit**
```typescript
const { data, error } = await supabase
  .from('products')
  .update({
    name: 'Nom mis à jour',
    price: 39.99,
    inventory_quantity: 50
  })
  .eq('id', productId)
  .eq('seller_id', userId); // Sécurité : seul le vendeur peut modifier
```

#### **Supprimer un Produit**
```typescript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)
  .eq('seller_id', userId);
```

### Recherche et Filtres

#### **Recherche par Nom**
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 't-shirt')
  .eq('status', 'active');
```

#### **Filtrage par Catégorie**
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .eq('status', 'active');
```

#### **Filtrage par Prix**
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .eq('status', 'active');
```

## 🛒 Gestion du Panier

### Table `cart` et `cart_items`

#### **Récupérer le Panier Utilisateur**
```typescript
const { data: cart, error } = await supabase
  .from('cart')
  .select(`
    *,
    cart_items(
      *,
      product:products(*)
    )
  `)
  .eq('user_id', userId)
  .single();
```

#### **Ajouter un Produit au Panier**
```typescript
// 1. Récupérer ou créer le panier
let { data: cart } = await supabase
  .from('cart')
  .select('id')
  .eq('user_id', userId)
  .single();

if (!cart) {
  const { data: newCart } = await supabase
    .from('cart')
    .insert({ user_id: userId })
    .select('id')
    .single();
  cart = newCart;
}

// 2. Ajouter l'article
const { error } = await supabase
  .from('cart_items')
  .insert({
    cart_id: cart.id,
    product_id: productId,
    quantity: 1,
    price: productPrice,
    variant_values: selectedVariants
  });
```

#### **Mettre à Jour la Quantité**
```typescript
const { error } = await supabase
  .from('cart_items')
  .update({ quantity: newQuantity })
  .eq('id', cartItemId);
```

#### **Supprimer du Panier**
```typescript
const { error } = await supabase
  .from('cart_items')
  .delete()
  .eq('id', cartItemId);
```

## 📦 Gestion des Commandes

### Table `orders` et `order_items`

#### **Créer une Commande**
```typescript
const { data, error } = await supabase.rpc('create_order', {
  p_user_id: userId,
  p_cart_items: cartItems, // Array des articles du panier
  p_shipping_address: shippingAddress,
  p_billing_address: billingAddress,
  p_payment_method: 'card'
});
```

#### **Récupérer les Commandes Utilisateur**
```typescript
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    order_items(
      *,
      product:products(*)
    )
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

#### **Mettre à Jour le Statut de Commande**
```typescript
const { error } = await supabase
  .from('orders')
  .update({ 
    status: 'shipped',
    tracking_number: 'TRK123456789',
    shipped_at: new Date().toISOString()
  })
  .eq('id', orderId);
```

## 🏷️ Gestion des Catégories et Marques

### Table `categories`

#### **Récupérer Toutes les Catégories**
```typescript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .eq('is_active', true)
  .order('sort_order');
```

### Table `brands`

#### **Récupérer Toutes les Marques**
```typescript
const { data, error } = await supabase
  .from('brands')
  .select('*')
  .eq('is_active', true)
  .order('name');
```

## 📁 Storage API

### Upload de Fichiers

#### **Upload d'Image Produit**
```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload(`products/${Date.now()}-${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

#### **Upload de Vidéo**
```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload(`products/videos/${Date.now()}-${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

#### **Récupérer l'URL Publique**
```typescript
const { data } = supabase.storage
  .from('products')
  .getPublicUrl(filePath);
```

### Gestion des Permissions Storage

#### **Politiques de Storage**
```sql
-- Lecture publique des produits
CREATE POLICY "Public read access for products" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload products" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated'
);
```

## 🔔 Notifications en Temps Réel

### Subscriptions Real-time

#### **Écouter les Nouveaux Produits**
```typescript
const subscription = supabase
  .channel('products')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'products'
  }, (payload) => {
    console.log('Nouveau produit:', payload.new);
    // Mettre à jour l'UI
  })
  .subscribe();
```

#### **Écouter les Mises à Jour de Commande**
```typescript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Commande mise à jour:', payload.new);
    // Notification utilisateur
  })
  .subscribe();
```

## 🔒 Sécurité et Permissions

### Row Level Security (RLS)

#### **Politiques Utilisateur**
```sql
-- Utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);
```

#### **Politiques Produits**
```sql
-- Lecture publique des produits actifs
CREATE POLICY "Public can view active products" ON products
FOR SELECT USING (status = 'active');

-- Vendeurs peuvent gérer leurs produits
CREATE POLICY "Sellers can manage own products" ON products
FOR ALL USING (auth.uid() = seller_id);
```

#### **Politiques Panier**
```sql
-- Utilisateurs peuvent gérer leur panier
CREATE POLICY "Users can manage own cart" ON cart
FOR ALL USING (auth.uid() = user_id);

-- Utilisateurs peuvent gérer leurs articles de panier
CREATE POLICY "Users can manage own cart items" ON cart_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cart 
    WHERE cart.id = cart_items.cart_id 
    AND cart.user_id = auth.uid()
  )
);
```

## 📊 Analytics et Métriques

### Fonctions PostgreSQL Personnalisées

#### **Statistiques Vendeur**
```sql
CREATE OR REPLACE FUNCTION get_seller_stats(seller_uuid UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'total_products', COUNT(*),
      'total_sales', COALESCE(SUM(sales_count), 0),
      'total_views', COALESCE(SUM(views_count), 0),
      'avg_rating', COALESCE(AVG(rating_average), 0)
    )
    FROM products
    WHERE seller_id = seller_uuid
  );
END;
$$ LANGUAGE plpgsql;
```

#### **Utilisation**
```typescript
const { data, error } = await supabase.rpc('get_seller_stats', {
  seller_uuid: userId
});
```

## 🚨 Gestion des Erreurs

### Codes d'Erreur Courants

| Code | Description | Solution |
|------|-------------|----------|
| `PGRST116` | Aucune ligne trouvée | Vérifier l'existence de la ressource |
| `23505` | Violation de contrainte unique | Vérifier les doublons |
| `23503` | Violation de clé étrangère | Vérifier les relations |
| `42501` | Permission refusée | Vérifier les politiques RLS |

### Exemple de Gestion d'Erreur
```typescript
try {
  const { data, error } = await supabase
    .from('products')
    .insert(productData);
    
  if (error) {
    if (error.code === '23505') {
      throw new Error('Ce produit existe déjà');
    } else if (error.code === '42501') {
      throw new Error('Permission refusée');
    } else {
      throw new Error(`Erreur: ${error.message}`);
    }
  }
  
  return data;
} catch (error) {
  console.error('Erreur API:', error);
  throw error;
}
```

## 🔧 Configuration et Variables d'Environnement

### Variables Requises
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Configuration Avancée
```typescript
const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'shopping-connect-web'
    }
  }
});
```

---

Cette documentation couvre l'ensemble des API disponibles dans Shopping Connect. Pour plus de détails sur l'implémentation, consultez le code source dans le dossier `src/lib/`.
