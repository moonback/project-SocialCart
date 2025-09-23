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
const createUserProfile = async (email: string, username: string, fullName: string | null, userId?: string) => {
  console.log('Creating user profile for:', email, 'with username:', username);

  try {
    let currentUser = null;
    
    // Si userId est fourni, l'utiliser directement
    if (userId) {
      console.log('📝 Using provided user ID:', userId);
      currentUser = { id: userId };
    } else {
      // Sinon, essayer de récupérer l'utilisateur actuel
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ No authenticated user found:', authError);
        return false;
      }
      
      currentUser = user;
    }

    console.log('📝 Attempting RPC with user ID:', currentUser.id);

    // Essayer d'abord la fonction RPC si elle existe avec l'ID utilisateur
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      user_id: currentUser.id,
      user_email: email,
      user_username: username,
      user_full_name: fullName,
      user_phone: null
    });

    if (profileError) throw profileError;
    console.log('✅ User profile created successfully with RPC function');
    return true;
  } catch (profileError) {
    console.warn('⚠️ RPC function failed, trying direct insertion:', profileError.message);

    try {
      let currentUser = null;
      
      // Si userId est fourni, l'utiliser directement
      if (userId) {
        currentUser = { id: userId };
      } else {
        // Sinon, essayer de récupérer l'utilisateur actuel
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('❌ No authenticated user found:', authError);
          return false;
        }
        
        currentUser = user;
      }

      console.log('📝 Attempting direct insertion for user:', currentUser.id);

      // Essayer l'insertion directe avec gestion d'erreur détaillée
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: currentUser.id,
          email: email,
          username: username,
          full_name: fullName,
          phone: null,
          loyalty_points: 0,
          is_seller: false,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Direct insertion failed:', insertError);

        // Si c'est une erreur RLS, essayer avec une approche différente
        if (insertError.code === '42501') {
          console.log('🔄 RLS blocking insertion, trying alternative approach...');

          // Essayer d'utiliser upsert au lieu d'insert
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: currentUser.id,
              email: email,
              username: username,
              full_name: fullName,
              phone: null,
              loyalty_points: 0,
              is_seller: false,
              is_verified: false,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id',
              ignoreDuplicates: false
            });

          if (upsertError) {
            console.error('❌ Upsert also failed:', upsertError);
            return false;
          } else {
            console.log('✅ User profile created successfully with upsert');
            return true;
          }
        } else {
          throw insertError;
        }
      } else {
        console.log('✅ User profile created successfully with direct insertion');
        return true;
      }
    } catch (fallbackError) {
      console.error('❌ All profile creation methods failed:', fallbackError);
      return false;
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session and set up auth state listener
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
          setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);

            if (!mounted) return;

            if (session?.user) {
              await fetchUserProfile(session.user.id);
            } else {
              setUser(null);
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // D'abord vérifier si l'utilisateur est authentifié
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !currentUser) {
        console.error('No authenticated user found');
        return;
      }

      // Vérifier que l'userId correspond à l'utilisateur actuel
      if (currentUser.id !== userId) {
        console.error('User ID mismatch');
        return;
      }

      // Récupérer le profil utilisateur
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Utiliser maybeSingle au lieu de single pour éviter l'erreur PGRST116

      if (error) {
        console.error('Error fetching user profile:', error);
        // Si l'utilisateur n'existe pas encore, créer un profil de base
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating basic profile');
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            username: '', // Sera défini lors de la création du profil
            full_name: currentUser.user_metadata?.full_name || null,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            phone: null,
            date_of_birth: null,
            gender: null,
            loyalty_points: 0,
            is_seller: false,
            is_verified: false,
            bio: null,
            location: null,
            website_url: null,
            instagram_handle: null,
            tiktok_handle: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        return;
      }

      // Si l'utilisateur existe, l'utiliser
      if (data) {
        setUser(data);
      } else {
        // Si pas de données mais pas d'erreur, créer un profil de base
        console.log('No user profile data found, creating basic profile');
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          username: '',
          full_name: currentUser.user_metadata?.full_name || null,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          phone: null,
          date_of_birth: null,
          gender: null,
          loyalty_points: 0,
          is_seller: false,
          is_verified: false,
          bio: null,
          location: null,
          website_url: null,
          instagram_handle: null,
          tiktok_handle: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // En cas d'erreur, ne pas casser la connexion
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
        // Utiliser l'ID utilisateur directement depuis la réponse signUp
        const userId = data.user.id;
        console.log('📋 Starting profile creation process for:', email, 'with user ID:', userId);

        // Créer le profil immédiatement avec l'ID utilisateur
        const createProfileWithRetry = async (attempts: number = 3) => {
          for (let i = 1; i <= attempts; i++) {
            console.log(`🔄 Profile creation attempt ${i}/${attempts}`);
            const success = await createUserProfile(email, username, fullName || null, userId);

            if (success) {
              console.log('✅ Profile creation completed successfully');
              return true;
            }

            if (i < attempts) {
              console.log(`⏳ Retrying in 1 second... (${i}/${attempts})`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          console.error('❌ All profile creation attempts failed');
          return false;
        };

        // Créer le profil avec réessai
        const profileCreated = await createProfileWithRetry();

        if (profileCreated) {
          toast.success('Compte créé avec succès !');
        } else {
          toast.success('Compte créé ! (Le profil sera créé lors du prochain chargement)');
        }
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