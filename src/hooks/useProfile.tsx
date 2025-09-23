import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ProfileService, UserProfile, UserStats, UserOrder, UserAchievement } from '../lib/profile';
import toast from 'react-hot-toast';

export interface ProfileData {
  profile: UserProfile | null;
  stats: UserStats;
  orders: UserOrder[];
  favorites: any[];
  achievements: UserAchievement[];
  favoriteCategories: string[];
}

export interface ProfileActions {
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

export function useProfile() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData>({
    profile: null,
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      memberSince: 'Inconnu',
      reviews: 0,
      followers: 0,
      following: 0,
      productsLiked: 0,
      productsBookmarked: 0,
      productsShared: 0,
      productsViewed: 0,
    },
    orders: [],
    favorites: [],
    achievements: [],
    favoriteCategories: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du profil au montage
  useEffect(() => {
    if (user?.id) {
      loadCompleteProfile();
    }
  }, [user?.id]);

  const loadCompleteProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const profileData = await ProfileService.getCompleteProfile(user.id);
      setData(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      toast.error('Utilisateur non connecté');
      return;
    }

    try {
      const updatedProfile = await ProfileService.updateUserProfile(user.id, updates);
      setData(prev => ({
        ...prev,
        profile: updatedProfile
      }));
      toast.success('Profil mis à jour avec succès !');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      throw err;
    }
  }, [user?.id]);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const profile = await ProfileService.getUserProfile(user.id);
      setData(prev => ({
        ...prev,
        profile
      }));
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, [user?.id]);

  const refreshStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const stats = await ProfileService.getUserStats(user.id);
      setData(prev => ({
        ...prev,
        stats
      }));
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, [user?.id]);

  const refreshOrders = useCallback(async () => {
    if (!user?.id) return;

    try {
      const orders = await ProfileService.getUserOrders(user.id);
      setData(prev => ({
        ...prev,
        orders
      }));
    } catch (err) {
      console.error('Error refreshing orders:', err);
    }
  }, [user?.id]);

  const refreshFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      const favorites = await ProfileService.getUserFavorites(user.id);
      setData(prev => ({
        ...prev,
        favorites
      }));
    } catch (err) {
      console.error('Error refreshing favorites:', err);
    }
  }, [user?.id]);

  const actions: ProfileActions = {
    updateProfile,
    refreshProfile,
    refreshStats,
    refreshOrders,
    refreshFavorites
  };

  return {
    ...data,
    loading,
    error,
    ...actions
  };
}
