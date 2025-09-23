import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { SocialService } from '../lib/social';
import toast from 'react-hot-toast';

export interface SocialState {
  likedProducts: Set<string>;
  bookmarkedProducts: Set<string>;
  followingUsers: Set<string>;
  loading: boolean;
}

export interface SocialActions {
  toggleLike: (productId: string) => Promise<void>;
  toggleBookmark: (productId: string) => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  shareProduct: (productId: string, platform: string) => Promise<void>;
  recordView: (productId: string) => Promise<void>;
  addComment: (productId: string, content: string, parentId?: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;
}

export function useSocial() {
  const { user } = useAuth();
  const [state, setState] = useState<SocialState>({
    likedProducts: new Set(),
    bookmarkedProducts: new Set(),
    followingUsers: new Set(),
    loading: false
  });

  const loadUserSocialData = useCallback(async () => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Charger les produits likés
      const likedProducts = await SocialService.getUserLikedProducts(user.id);
      const likedProductIds = new Set(likedProducts.map(p => p.id));

      // Charger les produits en wishlist (avec gestion d'erreur)
      let bookmarkedProductIds = new Set<string>();
      try {
        const wishlistProducts = await SocialService.getUserWishlist(user.id);
        bookmarkedProductIds = new Set(wishlistProducts.map(p => p.id));
      } catch (wishlistError) {
        console.warn('Impossible de charger la wishlist:', wishlistError);
        // Continuer sans la wishlist
      }

      // Charger les utilisateurs suivis
      const followingUserIds = await SocialService.getUserFollowing(user.id);
      const followingUsers = new Set(followingUserIds);

      setState(prev => ({
        ...prev,
        likedProducts: likedProductIds,
        bookmarkedProducts: bookmarkedProductIds,
        followingUsers,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading user social data:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user?.id]);

  // Charger les données sociales de l'utilisateur au montage
  useEffect(() => {
    if (user?.id) {
      loadUserSocialData();
    }
  }, [user?.id, loadUserSocialData]);

  const toggleLike = useCallback(async (productId: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour liker un produit');
      return;
    }

    try {
      const isLiked = await SocialService.toggleProductLike(productId, user.id);
      
      setState(prev => {
        const newLikedProducts = new Set(prev.likedProducts);
        if (isLiked) {
          newLikedProducts.add(productId);
          toast.success('Produit liké ! ❤️');
        } else {
          newLikedProducts.delete(productId);
          toast.success('Like retiré');
        }
        return { ...prev, likedProducts: newLikedProducts };
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erreur lors du like');
    }
  }, [user?.id]);

  const toggleBookmark = useCallback(async (productId: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour sauvegarder un produit');
      return;
    }

    try {
      const isBookmarked = await SocialService.toggleWishlistItem(productId, user.id);
      
      setState(prev => {
        const newBookmarkedProducts = new Set(prev.bookmarkedProducts);
        if (isBookmarked) {
          newBookmarkedProducts.add(productId);
          toast.success('Ajouté aux favoris ! ⭐');
        } else {
          newBookmarkedProducts.delete(productId);
          toast.success('Retiré des favoris');
        }
        return { ...prev, bookmarkedProducts: newBookmarkedProducts };
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Impossible de modifier les favoris. Vérifiez votre connexion.');
    }
  }, [user?.id]);

  const toggleFollow = useCallback(async (userId: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour suivre un utilisateur');
      return;
    }

    if (!userId || userId === 'undefined') {
      toast.error('ID utilisateur invalide');
      return;
    }

    if (userId === user.id) {
      toast.error('Vous ne pouvez pas vous suivre vous-même');
      return;
    }

    try {
      const isFollowing = await SocialService.toggleFollow(user.id, userId);
      
      setState(prev => {
        const newFollowingUsers = new Set(prev.followingUsers);
        if (isFollowing) {
          newFollowingUsers.add(userId);
          toast.success('Utilisateur suivi ! 👥');
        } else {
          newFollowingUsers.delete(userId);
          toast.success('Suivi annulé');
        }
        return { ...prev, followingUsers: newFollowingUsers };
      });
      
      // Recharger les données de suivi pour s'assurer de la cohérence
      setTimeout(() => {
        loadUserSocialData();
      }, 500);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Erreur lors du suivi');
    }
  }, [user?.id, loadUserSocialData]);

  const shareProduct = useCallback(async (productId: string, platform: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour partager un produit');
      return;
    }

    try {
      await SocialService.recordProductShare(productId, user.id, platform);
      toast.success(`Produit partagé sur ${platform} ! 📤`);
    } catch (error) {
      console.error('Error sharing product:', error);
      toast.error('Erreur lors du partage');
    }
  }, [user?.id]);

  const recordView = useCallback(async (productId: string) => {
    try {
      // Générer un session ID pour les utilisateurs non connectés
      const sessionId = user?.id || `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      await SocialService.recordProductView(productId, user?.id, sessionId, {
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Error recording view:', error);
      // Ne pas afficher d'erreur pour les vues car ce n'est pas critique
    }
  }, [user?.id]);

  const addComment = useCallback(async (productId: string, content: string, parentId?: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    if (!content.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      await SocialService.addProductComment(productId, user.id, content.trim(), parentId);
      toast.success('Commentaire ajouté ! 💬');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  }, [user?.id]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      await SocialService.deleteComment(commentId, user.id);
      toast.success('Commentaire supprimé');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Erreur lors de la suppression');
    }
  }, [user?.id]);

  const toggleCommentLike = useCallback(async (commentId: string) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour liker un commentaire');
      return;
    }

    try {
      const isLiked = await SocialService.toggleCommentLike(commentId, user.id);
      toast.success(isLiked ? 'Commentaire liké ! ❤️' : 'Like retiré');
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast.error('Erreur lors du like du commentaire');
    }
  }, [user?.id]);

  // Fonctions utilitaires
  const isLiked = useCallback((productId: string) => {
    return state.likedProducts.has(productId);
  }, [state.likedProducts]);

  const isBookmarked = useCallback((productId: string) => {
    return state.bookmarkedProducts.has(productId);
  }, [state.bookmarkedProducts]);

  const isFollowing = useCallback((userId: string) => {
    return state.followingUsers.has(userId);
  }, [state.followingUsers]);

  const actions: SocialActions = useMemo(() => ({
    toggleLike,
    toggleBookmark,
    toggleFollow,
    shareProduct,
    recordView,
    addComment,
    deleteComment,
    toggleCommentLike
  }), [
    toggleLike,
    toggleBookmark,
    toggleFollow,
    shareProduct,
    recordView,
    addComment,
    deleteComment,
    toggleCommentLike
  ]);

  return {
    ...state,
    ...actions,
    isLiked,
    isBookmarked,
    isFollowing
  };
}
