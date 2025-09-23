import { supabase } from './supabase';
import { SocialService } from './social';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  loyalty_points: number;
  is_seller: boolean;
  is_verified: boolean;
  bio?: string;
  location?: string;
  website_url?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  memberSince: string;
  reviews: number;
  followers: number;
  following: number;
  productsLiked: number;
  productsBookmarked: number;
  productsShared: number;
  productsViewed: number;
}

export interface UserOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

export class ProfileService {
  /**
   * Récupérer le profil complet de l'utilisateur
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  /**
   * Récupérer les statistiques de l'utilisateur
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Récupérer les commandes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('user_id', userId);

      if (ordersError) throw ordersError;

      // Récupérer les follows
      const { data: followers, error: followersError } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', userId);

      if (followersError) throw followersError;

      const { data: following, error: followingError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', userId);

      if (followingError) throw followingError;

      // Récupérer les avis
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId);

      if (reviewsError) throw reviewsError;

      // Récupérer les données sociales
      const likedProducts = await SocialService.getUserLikedProducts(userId);
      const bookmarkedProducts = await SocialService.getUserWishlist(userId);

      // Calculer les totaux
      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        totalOrders,
        totalSpent,
        loyaltyPoints: 0, // Sera calculé depuis le profil utilisateur
        memberSince: new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long' 
        }),
        reviews: reviews?.length || 0,
        followers: followers?.length || 0,
        following: following?.length || 0,
        productsLiked: likedProducts.length,
        productsBookmarked: bookmarkedProducts.length,
        productsShared: 0, // À implémenter si nécessaire
        productsViewed: 0, // À implémenter si nécessaire
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
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
      };
    }
  }

  /**
   * Récupérer les commandes de l'utilisateur
   */
  static async getUserOrders(userId: string): Promise<UserOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            product:products (
              primary_image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        order_number: order.order_number || order.id,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.product?.primary_image_url
        }))
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Récupérer les produits favoris de l'utilisateur
   */
  static async getUserFavorites(userId: string): Promise<any[]> {
    try {
      return await SocialService.getUserWishlist(userId);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }
  }

  /**
   * Récupérer les produits likés de l'utilisateur
   */
  static async getUserLikedProducts(userId: string): Promise<any[]> {
    try {
      return await SocialService.getUserLikedProducts(userId);
    } catch (error) {
      console.error('Error fetching user liked products:', error);
      return [];
    }
  }

  /**
   * Calculer les succès de l'utilisateur
   */
  static async getUserAchievements(userId: string, stats: UserStats): Promise<UserAchievement[]> {
    const achievements: UserAchievement[] = [
      {
        id: 'first_order',
        title: 'Premier Achat',
        description: 'Effectuez votre première commande',
        icon: '🎉',
        earned: stats.totalOrders > 0,
        progress: Math.min(stats.totalOrders, 1),
        maxProgress: 1
      },
      {
        id: 'loyal_customer',
        title: 'Client Fidèle',
        description: 'Effectuez 10 commandes',
        icon: '🏆',
        earned: stats.totalOrders >= 10,
        progress: Math.min(stats.totalOrders, 10),
        maxProgress: 10
      },
      {
        id: 'big_spender',
        title: 'Gros Dépensier',
        description: 'Dépensez plus de 1000€',
        icon: '💰',
        earned: stats.totalSpent >= 1000,
        progress: Math.min(stats.totalSpent, 1000),
        maxProgress: 1000
      },
      {
        id: 'reviewer',
        title: 'Critique',
        description: 'Laissez 10 avis',
        icon: '⭐',
        earned: stats.reviews >= 10,
        progress: Math.min(stats.reviews, 10),
        maxProgress: 10
      },
      {
        id: 'social_butterfly',
        title: 'Papillon Social',
        description: 'Suivez 50 utilisateurs',
        icon: '👥',
        earned: stats.following >= 50,
        progress: Math.min(stats.following, 50),
        maxProgress: 50
      },
      {
        id: 'popular',
        title: 'Populaire',
        description: 'Ayez 100 abonnés',
        icon: '🌟',
        earned: stats.followers >= 100,
        progress: Math.min(stats.followers, 100),
        maxProgress: 100
      },
      {
        id: 'liker',
        title: 'Aimeur',
        description: 'Likez 50 produits',
        icon: '❤️',
        earned: stats.productsLiked >= 50,
        progress: Math.min(stats.productsLiked, 50),
        maxProgress: 50
      },
      {
        id: 'collector',
        title: 'Collectionneur',
        description: 'Sauvegardez 25 produits',
        icon: '🔖',
        earned: stats.productsBookmarked >= 25,
        progress: Math.min(stats.productsBookmarked, 25),
        maxProgress: 25
      }
    ];

    return achievements;
  }

  /**
   * Récupérer les catégories préférées de l'utilisateur
   */
  static async getUserFavoriteCategories(userId: string): Promise<string[]> {
    try {
      // Récupérer les commandes avec les catégories de produits
      const { data, error } = await supabase
        .from('orders')
        .select(`
          order_items (
            product:products (
              category:categories (name)
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Compter les catégories
      const categoryCount: { [key: string]: number } = {};
      
      (data || []).forEach(order => {
        (order.order_items || []).forEach((item: any) => {
          const categoryName = item.product?.category?.name;
          if (categoryName) {
            categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
          }
        });
      });

      // Retourner les 3 catégories les plus populaires
      return Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);
    } catch (error) {
      console.error('Error fetching favorite categories:', error);
      return ['Tech', 'Mode', 'Maison']; // Valeurs par défaut
    }
  }

  /**
   * Récupérer les données complètes du profil
   */
  static async getCompleteProfile(userId: string) {
    try {
      const [profile, stats, orders, favorites, achievements, favoriteCategories] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserStats(userId),
        this.getUserOrders(userId),
        this.getUserFavorites(userId),
        this.getUserAchievements(userId, {} as UserStats), // Stats seront passées après
        this.getUserFavoriteCategories(userId)
      ]);

      // Recalculer les achievements avec les vraies stats
      const realAchievements = await this.getUserAchievements(userId, stats);

      return {
        profile,
        stats,
        orders,
        favorites,
        achievements: realAchievements,
        favoriteCategories
      };
    } catch (error) {
      console.error('Error fetching complete profile:', error);
      throw new Error('Erreur lors de la récupération du profil complet');
    }
  }
}
