# 📚 Documentation API - SocialCart

## Vue d'ensemble

SocialCart utilise **Supabase** comme Backend-as-a-Service, fournissant une API REST complète avec authentification, base de données PostgreSQL, stockage de fichiers, et fonctionnalités temps réel. Cette documentation couvre tous les endpoints disponibles et leur utilisation.

## 🔐 Authentification

### Endpoints d'authentification

#### Inscription
```typescript
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "options": {
    "data": {
      "username": "johndoe",
      "full_name": "John Doe"
    }
  }
}
```

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "username": "johndoe",
      "full_name": "John Doe"
    }
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### Connexion
```typescript
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Déconnexion
```typescript
POST /auth/v1/logout
Authorization: Bearer <access_token>
```

### Hooks d'authentification

```typescript
// useAuth hook
const {
  user,           // Utilisateur connecté
  loading,        // État de chargement
  signUp,         // Fonction d'inscription
  signIn,         // Fonction de connexion
  signOut,        // Fonction de déconnexion
  updateProfile   // Mise à jour du profil
} = useAuth();
```

## 👤 Utilisateurs et Profils

### Récupérer le profil utilisateur

```typescript
GET /rest/v1/users?id=eq.{user_id}
Authorization: Bearer <access_token>
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Bio utilisateur",
    "is_seller": true,
    "is_verified": false,
    "loyalty_points": 150,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Mettre à jour le profil

```typescript
PATCH /rest/v1/users?id=eq.{user_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "John Updated",
  "bio": "Nouvelle bio",
  "avatar_url": "https://new-avatar.com/image.jpg",
  "location": "Paris, France",
  "website_url": "https://john-doe.com",
  "instagram_handle": "@johndoe",
  "tiktok_handle": "@johndoe"
}
```

### Rechercher des utilisateurs

```typescript
GET /rest/v1/users?username=ilike.%{search_term}%
Authorization: Bearer <access_token>
```

### Rechercher des vendeurs

```typescript
GET /rest/v1/users?is_seller=eq.true&username=ilike.%{search_term}%
Authorization: Bearer <access_token>
```

## 🛍️ Produits

### Récupérer tous les produits

```typescript
GET /rest/v1/products?select=*,seller:users(*),images:product_images(*)
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "description": "Description du produit",
    "price": 999.99,
    "video_url": "https://video-url.com",
    "primary_image_url": "https://image-url.com",
    "images": [
      {
        "id": "uuid",
        "url": "https://image1.com",
        "alt": "Image 1"
      }
    ],
    "seller": {
      "id": "uuid",
      "username": "seller123",
      "avatar_url": "https://..."
    },
    "likes_count": 42,
    "views_count": 1250,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Récupérer un produit par ID

```typescript
GET /rest/v1/products?id=eq.{product_id}&select=*,seller:users(*),images:product_images(*),variants:product_variants(*)
```

### Créer un produit

```typescript
POST /rest/v1/products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nouveau produit",
  "description": "Description du produit",
  "price": 49.99,
  "video_url": "https://video-url.com",
  "primary_image_url": "https://image-url.com",
  "seller_id": "user_uuid",
  "category_id": "category_uuid",
  "status": "active",
  "inventory_quantity": 10,
  "tags": ["tech", "mobile", "premium"]
}
```

### Mettre à jour un produit

```typescript
PATCH /rest/v1/products?id=eq.{product_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nom mis à jour",
  "price": 59.99,
  "inventory_quantity": 5
}
```

### Supprimer un produit

```typescript
DELETE /rest/v1/products?id=eq.{product_id}
Authorization: Bearer <access_token>
```

### Incrémenter les vues d'un produit

```typescript
POST /rest/v1/rpc/increment_product_views
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid"
}
```

## 🛒 Panier

### Récupérer le panier de l'utilisateur

```typescript
GET /rest/v1/cart_items?user_id=eq.{user_id}&select=*,product:products(*)
Authorization: Bearer <access_token>
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "product_id": "uuid",
    "quantity": 2,
    "selected_variants": {
      "size": "L",
      "color": "Blue"
    },
    "product": {
      "id": "uuid",
      "name": "T-shirt",
      "price": 29.99,
      "primary_image_url": "https://..."
    }
  }
]
```

### Ajouter un produit au panier

```typescript
POST /rest/v1/cart_items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "quantity": 1,
  "selected_variants": {
    "size": "M",
    "color": "Red"
  }
}
```

### Mettre à jour la quantité

```typescript
PATCH /rest/v1/cart_items?id=eq.{cart_item_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Supprimer du panier

```typescript
DELETE /rest/v1/cart_items?id=eq.{cart_item_id}
Authorization: Bearer <access_token>
```

## 💳 Commandes

### Créer une commande

```typescript
POST /rest/v1/orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "total": 89.97,
  "status": "pending",
  "shipping_address": {
    "full_name": "John Doe",
    "address_line_1": "123 Main St",
    "city": "Paris",
    "postal_code": "75001",
    "country": "France"
  },
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "price": 29.99,
      "selected_variants": {
        "size": "L"
      }
    }
  ]
}
```

### Récupérer les commandes de l'utilisateur

```typescript
GET /rest/v1/orders?user_id=eq.{user_id}&select=*,order_items(*,product:products(*))
Authorization: Bearer <access_token>
```

### Mettre à jour le statut d'une commande

```typescript
PATCH /rest/v1/orders?id=eq.{order_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "shipped",
  "tracking_number": "TRK123456789"
}
```

## ❤️ Interactions Sociales

### Liker un produit

```typescript
POST /rest/v1/product_likes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "user_id": "uuid"
}
```

### Retirer un like

```typescript
DELETE /rest/v1/product_likes?product_id=eq.{product_id}&user_id=eq.{user_id}
Authorization: Bearer <access_token>
```

### Récupérer les likes d'un produit

```typescript
GET /rest/v1/product_likes?product_id=eq.{product_id}&select=*,user:users(username,avatar_url)
```

### Suivre un utilisateur

```typescript
POST /rest/v1/follows
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "following_id": "uuid",
  "follower_id": "uuid"
}
```

### Récupérer les abonnements

```typescript
GET /rest/v1/follows?follower_id=eq.{user_id}&select=*,following:users!following_id(*)
Authorization: Bearer <access_token>
```

### Ajouter un commentaire

```typescript
POST /rest/v1/product_comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "content": "Super produit !",
  "parent_id": null
}
```

### Récupérer les commentaires

```typescript
GET /rest/v1/product_comments?product_id=eq.{product_id}&select=*,user:users(username,avatar_url),replies:product_comments(*)
```

### Ajouter une réponse à un commentaire

```typescript
POST /rest/v1/product_comments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "content": "Merci !",
  "parent_id": "parent_comment_uuid"
}
```

### Enregistrer un partage

```typescript
POST /rest/v1/product_shares
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "platform": "instagram"
}
```

## 📁 Stockage de fichiers

### Upload d'image

```typescript
// Via Supabase Storage
const { data, error } = await supabase.storage
  .from('products')
  .upload(`products/${productId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: true
  });

// Récupérer l'URL publique
const { data: { publicUrl } } = supabase.storage
  .from('products')
  .getPublicUrl(`products/${productId}/${fileName}`);
```

### Upload de vidéo

```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload(`products/videos/${fileName}`, videoFile, {
    cacheControl: '3600',
    upsert: true
  });
```

### Supprimer un fichier

```typescript
const { error } = await supabase.storage
  .from('products')
  .remove([`products/${productId}/${fileName}`]);
```

### Lister les fichiers d'un produit

```typescript
const { data, error } = await supabase.storage
  .from('products')
  .list(`products/${productId}/`);
```

## 🔍 Recherche et Filtres

### Rechercher des produits

```typescript
GET /rest/v1/products?name=ilike.%{search_term}%&select=*,seller:users(*)
```

### Filtrer par catégorie

```typescript
GET /rest/v1/products?category_id=eq.{category_id}&select=*
```

### Filtrer par prix

```typescript
GET /rest/v1/products?price=gte.{min_price}&price=lte.{max_price}
```

### Filtrer par vendeur

```typescript
GET /rest/v1/products?seller_id=eq.{seller_id}&select=*
```

### Trier les résultats

```typescript
GET /rest/v1/products?order=price.desc&select=*
GET /rest/v1/products?order=created_at.desc&select=*
GET /rest/v1/products?order=likes_count.desc&select=*
```

### Recherche avec pagination

```typescript
GET /rest/v1/products?select=*&range=0-9
GET /rest/v1/products?select=*&range=10-19
```

## 📊 Analytics et Métriques

### Récupérer les statistiques d'un produit

```typescript
GET /rest/v1/rpc/get_product_social_stats
Content-Type: application/json

{
  "p_product_id": "uuid"
}
```

**Réponse :**
```json
{
  "likes_count": 89,
  "shares_count": 23,
  "comments_count": 15,
  "views_count": 1250
}
```

### Récupérer les statistiques utilisateur

```typescript
GET /rest/v1/rpc/get_user_stats
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "p_user_id": "uuid"
}
```

### Enregistrer une vue de produit

```typescript
POST /rest/v1/product_views
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "session_id": "session_uuid",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

## 🎁 Système de Fidélité

### Récupérer les transactions de fidélité

```typescript
GET /rest/v1/loyalty_transactions?user_id=eq.{user_id}&order=created_at.desc
Authorization: Bearer <access_token>
```

### Attribuer des points de fidélité

```typescript
POST /rest/v1/rpc/award_loyalty_points
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "p_user_id": "uuid",
  "p_action": "like_product",
  "p_object_id": "product_uuid"
}
```

### Récupérer le solde de points

```typescript
GET /rest/v1/users?id=eq.{user_id}&select=loyalty_points
Authorization: Bearer <access_token>
```

## 🤖 Intelligence Artificielle

### Analyser une image de produit

```typescript
POST /rest/v1/rpc/analyze_product_image
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "image_data": "base64_encoded_image",
  "options": {
    "include_price": true,
    "include_brand": true,
    "include_category": true,
    "language": "fr"
  }
}
```

**Réponse :**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Smartphone Apple avec écran Super Retina XDR",
  "category": "electronics",
  "brand": "Apple",
  "price": 999.99,
  "tags": ["smartphone", "apple", "premium", "5g"],
  "confidence": 0.92
}
```

## 🔄 Real-time Subscriptions

### Écouter les nouveaux produits

```typescript
const subscription = supabase
  .channel('products')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Nouveau produit:', payload.new);
      // Mettre à jour l'UI
    }
  )
  .subscribe();
```

### Écouter les nouveaux likes

```typescript
const subscription = supabase
  .channel('likes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'product_likes' },
    (payload) => {
      console.log('Nouveau like:', payload.new);
      // Mettre à jour le compteur de likes
    }
  )
  .subscribe();
```

### Écouter les nouveaux commentaires

```typescript
const subscription = supabase
  .channel('comments')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'product_comments' },
    (payload) => {
      console.log('Nouveau commentaire:', payload.new);
      // Ajouter le commentaire à la liste
    }
  )
  .subscribe();
```

### Écouter les changements de commande

```typescript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'orders' },
    (payload) => {
      console.log('Commande mise à jour:', payload.new);
      // Mettre à jour le statut de la commande
    }
  )
  .subscribe();
```

## 🛡️ Sécurité et Permissions

### Row Level Security (RLS)

Les politiques RLS sont configurées pour chaque table :

```sql
-- Exemple pour les produits
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON products
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products" ON products
    FOR UPDATE USING (auth.uid() = seller_id);
```

### Headers d'authentification

```typescript
// Toutes les requêtes authentifiées doivent inclure :
Authorization: Bearer <access_token>

// Headers optionnels
apikey: <anon_key>
Content-Type: application/json
Prefer: return=minimal
```

### Politiques RLS principales

```sql
-- Users : Lecture publique des profils, modification de son propre profil
CREATE POLICY "Users can view profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Products : Lecture publique, modification par le vendeur
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their products" ON products FOR ALL USING (auth.uid() = seller_id);

-- Likes : Tout le monde peut liker
CREATE POLICY "Users can like products" ON product_likes FOR ALL USING (auth.uid() = user_id);

-- Comments : Lecture publique, écriture authentifiée
CREATE POLICY "Comments are viewable by everyone" ON product_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON product_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON product_comments FOR UPDATE USING (auth.uid() = user_id);
```

## 📝 Codes d'erreur

### Codes d'erreur courants

| Code | Description | Solution |
|------|-------------|----------|
| `23505` | Violation de contrainte unique | Vérifier l'unicité (email, username) |
| `23503` | Violation de clé étrangère | Vérifier l'existence des relations |
| `42501` | Permission refusée | Vérifier les politiques RLS |
| `42P01` | Table inexistante | Vérifier le nom de la table |
| `42601` | Erreur de syntaxe SQL | Vérifier la requête |
| `PGRST116` | Aucune ligne trouvée | Gérer le cas où aucun résultat |

### Gestion des erreurs

```typescript
try {
  const { data, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) {
    throw error;
  }
  
  return data;
} catch (error) {
  console.error('Erreur API:', error);
  
  // Gestion spécifique par type d'erreur
  if (error.code === '23505') {
    toast.error('Ce produit existe déjà');
  } else if (error.code === '42501') {
    toast.error('Permission refusée');
  } else if (error.code === 'PGRST116') {
    toast.error('Aucun produit trouvé');
  } else {
    toast.error('Erreur inconnue');
  }
}
```

## 🔧 Configuration Supabase

### Variables d'environnement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Configuration du client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
      'X-Client-Info': 'supabase-js-web'
    }
  }
});
```

## 📈 Performance et Optimisation

### Requêtes optimisées

```typescript
// Utiliser select pour limiter les champs
const { data } = await supabase
  .from('products')
  .select('id, name, price, primary_image_url');

// Utiliser limit pour paginer
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 9); // Première page (10 éléments)

// Utiliser des index pour les recherches
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('name', 'iphone'); // Nécessite un index GIN
```

### Mise en cache

```typescript
// Cache côté client avec React Query (recommandé)
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => ProductService.getProducts(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Requêtes complexes avec jointures

```typescript
// Feed vidéo avec informations sociales
const { data } = await supabase
  .from('products')
  .select(`
    *,
    seller:users!products_seller_id_fkey(
      id,
      username,
      avatar_url,
      is_verified
    ),
    likes:product_likes(count),
    comments:product_comments(count),
    user_like:product_likes!left(
      id
    ).filter(user_id.eq.${userId})
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

## 🔍 Exemples d'utilisation

### Service complet pour les produits

```typescript
class ProductService {
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(
          id,
          username,
          avatar_url,
          is_verified
        )
      `)
      .eq('status', 'active');

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(filters?.offset || 0, (filters?.limit || 10) - 1);

    if (error) throw error;
    return data || [];
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }
}
```

---

Cette documentation couvre l'ensemble des API disponibles dans SocialCart. Pour plus de détails sur des endpoints spécifiques, consultez la [documentation Supabase officielle](https://supabase.com/docs/guides/api).