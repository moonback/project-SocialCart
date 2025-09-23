# 📚 Documentation API - SocialCart

## Vue d'ensemble

SocialCart utilise **Supabase** comme Backend-as-a-Service, fournissant une API REST et GraphQL complète avec authentification, base de données PostgreSQL, et stockage de fichiers.

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
  "avatar_url": "https://new-avatar.com/image.jpg"
}
```

### Rechercher des utilisateurs

```typescript
GET /rest/v1/users?username=ilike.%{search_term}%
Authorization: Bearer <access_token>
```

## 🛍️ Produits

### Récupérer tous les produits

```typescript
GET /rest/v1/products?select=*,user:users(*),images:product_images(*)
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
    "user": {
      "id": "uuid",
      "username": "seller123",
      "avatar_url": "https://..."
    },
    "images": [
      {
        "id": "uuid",
        "url": "https://image1.com",
        "alt": "Image 1"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Récupérer un produit par ID

```typescript
GET /rest/v1/products?id=eq.{product_id}&select=*,user:users(*),images:product_images(*),variants:product_variants(*)
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
  "status": "active"
}
```

### Mettre à jour un produit

```typescript
PATCH /rest/v1/products?id=eq.{product_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nom mis à jour",
  "price": 59.99
}
```

### Supprimer un produit

```typescript
DELETE /rest/v1/products?id=eq.{product_id}
Authorization: Bearer <access_token>
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

## ❤️ Interactions Sociales

### Liker un produit

```typescript
POST /rest/v1/likes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": "uuid",
  "user_id": "uuid"
}
```

### Récupérer les likes d'un produit

```typescript
GET /rest/v1/likes?product_id=eq.{product_id}&select=*,user:users(username,avatar_url)
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
POST /rest/v1/comments
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
GET /rest/v1/comments?product_id=eq.{product_id}&select=*,user:users(username,avatar_url)
```

## 📁 Stockage de fichiers

### Upload d'image

```typescript
// Via Supabase Storage
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${productId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: true
  });

// Récupérer l'URL publique
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(`products/${productId}/${fileName}`);
```

### Upload de vidéo

```typescript
const { data, error } = await supabase.storage
  .from('product-videos')
  .upload(`products/${productId}/${fileName}`, videoFile, {
    cacheControl: '3600',
    upsert: true
  });
```

### Supprimer un fichier

```typescript
const { error } = await supabase.storage
  .from('product-images')
  .remove([`products/${productId}/${fileName}`]);
```

## 🔍 Recherche et Filtres

### Rechercher des produits

```typescript
GET /rest/v1/products?name=ilike.%{search_term}%&select=*,user:users(*)
```

### Filtrer par catégorie

```typescript
GET /rest/v1/products?category_id=eq.{category_id}&select=*
```

### Filtrer par prix

```typescript
GET /rest/v1/products?price=gte.{min_price}&price=lte.{max_price}
```

### Trier les résultats

```typescript
GET /rest/v1/products?order=price.desc&select=*
GET /rest/v1/products?order=created_at.desc&select=*
```

## 📊 Analytics et Métriques

### Récupérer les statistiques d'un produit

```typescript
GET /rest/v1/product_stats?product_id=eq.{product_id}
```

**Réponse :**
```json
[
  {
    "product_id": "uuid",
    "views_count": 1250,
    "likes_count": 89,
    "shares_count": 23,
    "comments_count": 15,
    "purchases_count": 7
  }
]
```

### Récupérer les statistiques utilisateur

```typescript
GET /rest/v1/user_stats?user_id=eq.{user_id}
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
    { event: 'INSERT', schema: 'public', table: 'likes' },
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
    { event: 'INSERT', schema: 'public', table: 'comments' },
    (payload) => {
      console.log('Nouveau commentaire:', payload.new);
      // Ajouter le commentaire à la liste
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

## 📝 Codes d'erreur

### Codes d'erreur courants

| Code | Description | Solution |
|------|-------------|----------|
| `23505` | Violation de contrainte unique | Vérifier l'unicité (email, username) |
| `23503` | Violation de clé étrangère | Vérifier l'existence des relations |
| `42501` | Permission refusée | Vérifier les politiques RLS |
| `42P01` | Table inexistante | Vérifier le nom de la table |
| `42601` | Erreur de syntaxe SQL | Vérifier la requête |

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

---

Cette documentation couvre l'ensemble des API disponibles dans SocialCart. Pour plus de détails sur des endpoints spécifiques, consultez la [documentation Supabase officielle](https://supabase.com/docs/guides/api).