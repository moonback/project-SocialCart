# Guide d'implémentation - Authentification et Inscription

## 📋 Instructions d'installation

### 1. Configuration Supabase

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)
2. **Exécuter le script SQL** `auth_schema.sql` dans l'éditeur SQL de Supabase
3. **Configurer les variables d'environnement** dans votre projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 2. Configuration de l'authentification Supabase

Dans le dashboard Supabase :
- Aller dans **Authentication > Settings**
- Configurer les **Site URL** et **Redirect URLs**
- Activer les **Email confirmations** si souhaité

## 🔧 Utilisation des fonctions SQL

### Inscription d'un nouvel utilisateur

```typescript
// Dans votre hook useAuth.tsx
const signUp = async (email: string, password: string, username: string, fullName?: string) => {
  try {
    // 1. Créer le compte Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // 2. Créer le profil utilisateur dans notre table
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        user_email: email,
        user_username: username,
        user_full_name: fullName || null,
        user_phone: null
      });

      if (profileError) throw profileError;
      toast.success('Compte créé avec succès !');
    }
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
```

### Vérification de disponibilité

```typescript
// Vérifier si un nom d'utilisateur est disponible
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('is_username_available', {
    check_username: username
  });
  
  if (error) throw error;
  return data;
};

// Vérifier si un email est disponible
const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('is_email_available', {
    check_email: email
  });
  
  if (error) throw error;
  return data;
};
```

### Mise à jour du profil

```typescript
const updateProfile = async (profileData: {
  fullName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  avatarUrl?: string;
}) => {
  const { error } = await supabase.rpc('update_user_profile', {
    user_full_name: profileData.fullName,
    user_phone: profileData.phone,
    user_bio: profileData.bio,
    user_location: profileData.location,
    user_website_url: profileData.websiteUrl,
    user_instagram_handle: profileData.instagramHandle,
    user_tiktok_handle: profileData.tiktokHandle,
    user_avatar_url: profileData.avatarUrl
  });

  if (error) throw error;
};
```

## 🔍 Requêtes de recherche

### Recherche d'utilisateurs

```typescript
const searchUsers = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, avatar_url, is_seller, is_verified')
    .ilike('username', `%${searchTerm}%`)
    .neq('id', (await supabase.auth.getUser()).data.user?.id)
    .order('is_verified', { ascending: false })
    .order('username')
    .limit(20);

  if (error) throw error;
  return data;
};

// Recherche de vendeurs uniquement
const searchSellers = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, avatar_url, bio, location')
    .eq('is_seller', true)
    .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
    .order('is_verified', { ascending: false })
    .order('username')
    .limit(20);

  if (error) throw error;
  return data;
};
```

## 📊 Statistiques et analytics

```typescript
// Obtenir les statistiques utilisateur
const getUserStats = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('total_users:count(*)')
    .single();

  if (error) throw error;
  return data;
};

// Statistiques par mois
const getMonthlyStats = async () => {
  const { data, error } = await supabase
    .rpc('get_monthly_user_stats');

  if (error) throw error;
  return data;
};
```

## 🛡️ Sécurité et bonnes pratiques

### 1. Validation côté client
```typescript
const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### 2. Gestion des erreurs
```typescript
const handleAuthError = (error: any) => {
  switch (error.code) {
    case '23505': // Contrainte unique violée
      if (error.message.includes('username')) {
        toast.error('Ce nom d\'utilisateur est déjà pris');
      } else if (error.message.includes('email')) {
        toast.error('Cet email est déjà utilisé');
      }
      break;
    case '23514': // Contrainte de vérification violée
      toast.error('Les données fournies ne sont pas valides');
      break;
    default:
      toast.error('Une erreur est survenue');
  }
};
```

### 3. Optimisation des requêtes
```typescript
// Utiliser les index créés pour des recherches rapides
const getUsersBySellerStatus = async (isSeller: boolean) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, avatar_url')
    .eq('is_seller', isSeller)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};
```

## 🚀 Prochaines étapes

1. **Implémenter l'authentification** avec les fonctions fournies
2. **Tester les requêtes** dans l'éditeur SQL Supabase
3. **Créer les composants UI** pour l'inscription et la connexion
4. **Ajouter la validation** côté client et serveur
5. **Implémenter la gestion des sessions** et la persistance

## 📝 Notes importantes

- Les politiques RLS sont activées pour la sécurité
- Toutes les fonctions sont sécurisées avec `SECURITY DEFINER`
- Les index sont optimisés pour les performances
- Les triggers mettent à jour automatiquement `updated_at`
- La validation des données est faite au niveau de la base de données
