import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  searchUsers: (searchTerm: string) => Promise<User[]>;
  searchSellers: (searchTerm: string) => Promise<User[]>;
}

interface ProfileUpdateData {
  fullName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonctions de validation
const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Gestion des erreurs d'authentification
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
    case 'auth/email-already-in-use':
      toast.error('Cet email est déjà utilisé');
      break;
    case 'auth/invalid-email':
      toast.error('Email invalide');
      break;
    case 'auth/weak-password':
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      break;
    case 'auth/user-not-found':
      toast.error('Utilisateur non trouvé');
      break;
    case 'auth/wrong-password':
      toast.error('Mot de passe incorrect');
      break;
    default:
      toast.error(error.message || 'Une erreur est survenue');
  }
};

// Fonction helper pour créer le profil utilisateur
const createUserProfile = async (email: string, username: string, fullName: string | null) => {
  try {
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      user_email: email,
      user_username: username,
      user_full_name: fullName,
      user_phone: null
    });

    if (profileError) throw profileError;
    console.log('User profile created successfully');
  } catch (profileError) {
    console.warn('create_user_profile function not available, using fallback:', profileError);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { error: fallbackError } = await supabase
          .from('users')
          .insert({
            id: currentUser.id,
            email: email,
            username: username,
            full_name: fullName,
            phone: null,
            loyalty_points: 0,
            is_seller: false,
            is_verified: false
          });

        if (fallbackError) throw fallbackError;
        console.log('User profile created successfully with fallback');
      }
    } catch (fallbackError) {
      console.error('Profile creation failed:', fallbackError);
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    try {
      // Validation des données
      if (!validateEmail(email)) {
        throw new Error('Email invalide');
      }
      if (!validateUsername(username)) {
        throw new Error('Le nom d\'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres et _ uniquement)');
      }
      if (!validatePassword(password)) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Vérifier la disponibilité du nom d'utilisateur
      const isUsernameAvailable = await checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        throw new Error('Ce nom d\'utilisateur est déjà pris');
      }

      // Vérifier la disponibilité de l'email
      const isEmailAvailable = await checkEmailAvailability(email);
      if (!isEmailAvailable) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Créer le compte Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Stocker les informations pour la création du profil
        const profileData = {
          email,
          username,
          fullName: fullName || null
        };

        // Créer le profil via l'auth state change listener pour s'assurer de l'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user && profileData) {
              await createUserProfile(profileData.email, profileData.username, profileData.fullName);
              subscription.unsubscribe();
            }
          }
        );

        // Créer immédiatement le profil si la session est déjà active
        if (data.session) {
          await createUserProfile(profileData.email, profileData.username, profileData.fullName);
        }

        toast.success('Compte créé avec succès !');
      }
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('Email invalide');
      }
      if (!validatePassword(password)) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Bienvenue !');
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  // Vérifier si un nom d'utilisateur est disponible
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_username_available', {
        check_username: username
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking username availability:', error);
      // Fallback: vérifier directement dans la table users
      try {
        const { data, error: fallbackError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single();

        if (fallbackError && fallbackError.code === 'PGRST116') {
          // Username doesn't exist, so it's available
          return true;
        } else if (!fallbackError) {
          // Username exists
          return false;
        }
        throw fallbackError;
      } catch (fallbackError) {
        console.error('Fallback check also failed:', fallbackError);
        return false;
      }
    }
  };

  // Vérifier si un email est disponible
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_email_available', {
        check_email: email
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking email availability:', error);
      // Fallback: vérifier directement dans la table users
      try {
        const { data, error: fallbackError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single();

        if (fallbackError && fallbackError.code === 'PGRST116') {
          // Email doesn't exist, so it's available
          return true;
        } else if (!fallbackError) {
          // Email exists
          return false;
        }
        throw fallbackError;
      } catch (fallbackError) {
        console.error('Fallback check also failed:', fallbackError);
        return false;
      }
    }
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = async (profileData: ProfileUpdateData) => {
    try {
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
    } catch (error: any) {
      console.warn('update_user_profile function not available, using fallback:', error);
      // Fallback: mettre à jour directement dans la table
      try {
        const { error: fallbackError } = await supabase
          .from('users')
          .update({
            full_name: profileData.fullName,
            phone: profileData.phone,
            bio: profileData.bio,
            location: profileData.location,
            website_url: profileData.websiteUrl,
            instagram_handle: profileData.instagramHandle,
            tiktok_handle: profileData.tiktokHandle,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id);

        if (fallbackError) throw fallbackError;
      } catch (fallbackError) {
        console.error('Profile update fallback also failed:', fallbackError);
        handleAuthError(fallbackError);
        throw fallbackError;
      }
    }

    // Rafraîchir le profil utilisateur
    if (user) {
      await fetchUserProfile(user.id);
    }

    toast.success('Profil mis à jour avec succès');
  };

  // Rechercher des utilisateurs
  const searchUsers = async (searchTerm: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name, avatar_url, is_seller, is_verified')
        .ilike('username', `%${searchTerm}%`)
        .neq('id', user?.id)
        .order('is_verified', { ascending: false })
        .order('username')
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Rechercher des vendeurs
  const searchSellers = async (searchTerm: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name, avatar_url, bio, location')
        .eq('is_seller', true)
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .order('is_verified', { ascending: false })
        .order('username')
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching sellers:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      updateProfile,
      checkUsernameAvailability,
      checkEmailAvailability,
      searchUsers,
      searchSellers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}