import { supabase } from './supabase';

export interface SocialAction {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ProductLike extends SocialAction {}
export interface ProductShare extends SocialAction {
  platform: string;
}
export interface ProductView extends SocialAction {
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
}

export interface ProductComment {
  id: string;
  user_id: string;
  product_id: string;
  parent_id?: string;
  content: string;
  is_approved: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  replies?: ProductComment[];
}

export interface CommentLike {
  id: string;
  user_id: string;
  comment_id: string;
  created_at: string;
}

export interface SocialStats {
  likes_count: number;
  shares_count: number;
  comments_count: number;
  views_count: number;
}

export class SocialService {
  // =============================================
  // LIKES
  // =============================================

  /**
   * Ajouter ou retirer un like sur un produit
   */
  static async toggleProductLike(productId: string, userId: string): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur a déjà liké ce produit
      const { data: existingLike, error: checkError } = await supabase
        .from('product_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Retirer le like
        const { error: deleteError } = await supabase
          .from('product_likes')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (deleteError) throw deleteError;
        return false; // Like retiré
      } else {
        // Ajouter le like
        const { error: insertError } = await supabase
          .from('product_likes')
          .insert({
            user_id: userId,
            product_id: productId
          });

        if (insertError) throw insertError;
        return true; // Like ajouté
      }
    } catch (error) {
      console.error('Error toggling product like:', error);
      throw new Error('Erreur lors de la gestion du like');
    }
  }

  /**
   * Vérifier si un utilisateur a liké un produit
   */
  static async hasUserLikedProduct(productId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('product_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking product like:', error);
      return false;
    }
  }

  /**
   * Récupérer les likes d'un produit
   */
  static async getProductLikes(productId: string): Promise<ProductLike[]> {
    try {
      const { data, error } = await supabase
        .from('product_likes')
        .select(`
          *,
          user:users!product_likes_user_id_fkey(
            id,
            username,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product likes:', error);
      throw new Error('Erreur lors de la récupération des likes');
    }
  }

  // =============================================
  // SHARES
  // =============================================

  /**
   * Enregistrer un partage de produit
   */
  static async recordProductShare(
    productId: string, 
    userId: string, 
    platform: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('product_shares')
        .insert({
          user_id: userId,
          product_id: productId,
          platform
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording product share:', error);
      throw new Error('Erreur lors de l\'enregistrement du partage');
    }
  }

  /**
   * Récupérer les partages d'un produit
   */
  static async getProductShares(productId: string): Promise<ProductShare[]> {
    try {
      const { data, error } = await supabase
        .from('product_shares')
        .select(`
          *,
          user:users!product_shares_user_id_fkey(
            id,
            username,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching product shares:', error);
      throw new Error('Erreur lors de la récupération des partages');
    }
  }

  // =============================================
  // VIEWS
  // =============================================

  /**
   * Enregistrer une vue de produit
   */
  static async recordProductView(
    productId: string,
    userId?: string,
    sessionId?: string,
    metadata?: {
      ip_address?: string;
      user_agent?: string;
      referrer?: string;
    }
  ): Promise<void> {
    try {
      // Vérifier si cette vue a déjà été enregistrée récemment (éviter les doublons)
      const recentView = await this.hasRecentView(productId, userId, sessionId);
      if (recentView) return;

      const { error } = await supabase
        .from('product_views')
        .insert({
          user_id: userId || null,
          product_id: productId,
          session_id: sessionId,
          ip_address: metadata?.ip_address,
          user_agent: metadata?.user_agent,
          referrer: metadata?.referrer
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording product view:', error);
      // Ne pas lancer d'erreur pour les vues car ce n'est pas critique
    }
  }

  /**
   * Vérifier si une vue récente existe (dans les 5 dernières minutes)
   */
  private static async hasRecentView(
    productId: string,
    userId?: string,
    sessionId?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('product_views')
        .select('id')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // 5 minutes

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query.limit(1);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking recent view:', error);
      return false;
    }
  }

  // =============================================
  // COMMENTS
  // =============================================

  /**
   * Ajouter un commentaire sur un produit
   */
  static async addProductComment(
    productId: string,
    userId: string,
    content: string,
    parentId?: string
  ): Promise<ProductComment> {
    try {
      const { data, error } = await supabase
        .from('product_comments')
        .insert({
          user_id: userId,
          product_id: productId,
          content,
          parent_id: parentId || null
        })
        .select(`
          *,
          user:users!product_comments_user_id_fkey(
            id,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding product comment:', error);
      throw new Error('Erreur lors de l\'ajout du commentaire');
    }
  }

  /**
   * Récupérer les commentaires d'un produit
   */
  static async getProductComments(productId: string): Promise<ProductComment[]> {
    try {
      const { data, error } = await supabase
        .from('product_comments')
        .select(`
          *,
          user:users!product_comments_user_id_fkey(
            id,
            username,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .is('parent_id', null) // Seulement les commentaires principaux
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les réponses pour chaque commentaire
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('product_comments')
            .select(`
              *,
              user:users!product_comments_user_id_fkey(
                id,
                username,
                avatar_url
              )
            `)
            .eq('parent_id', comment.id)
            .eq('is_approved', true)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      return commentsWithReplies;
    } catch (error) {
      console.error('Error fetching product comments:', error);
      throw new Error('Erreur lors de la récupération des commentaires');
    }
  }

  /**
   * Supprimer un commentaire
   */
  static async deleteComment(commentId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('product_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Erreur lors de la suppression du commentaire');
    }
  }

  /**
   * Ajouter ou retirer un like sur un commentaire
   */
  static async toggleCommentLike(commentId: string, userId: string): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur a déjà liké ce commentaire
      const { data: existingLike, error: checkError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('comment_id', commentId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Retirer le like
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', userId)
          .eq('comment_id', commentId);

        if (deleteError) throw deleteError;
        return false; // Like retiré
      } else {
        // Ajouter le like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({
            user_id: userId,
            comment_id: commentId
          });

        if (insertError) throw insertError;
        return true; // Like ajouté
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw new Error('Erreur lors de la gestion du like du commentaire');
    }
  }

  // =============================================
  // FOLLOWS
  // =============================================

  /**
   * Suivre ou ne plus suivre un utilisateur
   */
  static async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur suit déjà
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFollow) {
        // Ne plus suivre
        const { error: deleteError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', followerId)
          .eq('following_id', followingId);

        if (deleteError) throw deleteError;
        return false; // Follow retiré
      } else {
        // Suivre
        const { error: insertError } = await supabase
          .from('follows')
          .insert({
            follower_id: followerId,
            following_id: followingId
          });

        if (insertError) throw insertError;
        return true; // Follow ajouté
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw new Error('Erreur lors de la gestion du suivi');
    }
  }

  /**
   * Vérifier si un utilisateur suit un autre utilisateur
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  // =============================================
  // WISHLIST
  // =============================================

  /**
   * Ajouter ou retirer un produit de la wishlist
   */
  static async toggleWishlistItem(productId: string, userId: string): Promise<boolean> {
    try {
      // Récupérer ou créer la wishlist par défaut
      let { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('name', 'Favoris')
        .single();

      if (wishlistError && wishlistError.code === 'PGRST116') {
        // Créer la wishlist par défaut
        const { data: newWishlist, error: createError } = await supabase
          .from('wishlists')
          .insert({
            user_id: userId,
            name: 'Favoris',
            is_public: false
          })
          .select('id')
          .single();

        if (createError) throw createError;
        wishlist = newWishlist;
      } else if (wishlistError) {
        throw wishlistError;
      }

      // Vérifier si le produit est déjà dans la wishlist
      const { data: existingItem, error: checkError } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        // Retirer de la wishlist
        const { error: deleteError } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('wishlist_id', wishlist.id)
          .eq('product_id', productId);

        if (deleteError) throw deleteError;
        return false; // Retiré de la wishlist
      } else {
        // Ajouter à la wishlist
        const { error: insertError } = await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlist.id,
            product_id: productId
          });

        if (insertError) throw insertError;
        return true; // Ajouté à la wishlist
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw new Error('Erreur lors de la gestion de la wishlist');
    }
  }

  /**
   * Vérifier si un produit est dans la wishlist
   */
  static async isInWishlist(productId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('product_id', productId)
        .eq('wishlist.user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  // =============================================
  // STATISTIQUES
  // =============================================

  /**
   * Récupérer les statistiques sociales d'un produit
   */
  static async getProductSocialStats(productId: string): Promise<SocialStats> {
    try {
      const { data, error } = await supabase.rpc('get_product_social_stats', {
        p_product_id: productId
      });

      if (error) throw error;
      return data || { likes_count: 0, shares_count: 0, comments_count: 0, views_count: 0 };
    } catch (error) {
      console.error('Error fetching social stats:', error);
      return { likes_count: 0, shares_count: 0, comments_count: 0, views_count: 0 };
    }
  }

  /**
   * Récupérer les produits likés par un utilisateur
   */
  static async getUserLikedProducts(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_likes')
        .select(`
          *,
          product:products!product_likes_product_id_fkey(
            *,
            seller:users!products_seller_id_fkey(
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(item => item.product) || [];
    } catch (error) {
      console.error('Error fetching user liked products:', error);
      throw new Error('Erreur lors de la récupération des produits likés');
    }
  }

  /**
   * Récupérer les produits dans la wishlist d'un utilisateur
   */
  static async getUserWishlist(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          wishlist:wishlist_id(
            user_id
          ),
          product:products!wishlist_items_product_id_fkey(
            *,
            seller:users!products_seller_id_fkey(
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('wishlist.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(item => item.product) || [];
    } catch (error) {
      console.error('Error fetching user wishlist:', error);
      throw new Error('Erreur lors de la récupération de la wishlist');
    }
  }
}
