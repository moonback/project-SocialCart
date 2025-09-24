import { supabase } from './supabase';
import { StorageService } from './storage';

export interface ProductStory {
  id: string;
  seller_id: string;
  seller_username: string;
  seller_avatar_url?: string;
  product_id: string;
  product_name: string;
  product_image_url?: string;
  product_price: number;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  expires_at: string;
  views_count: number;
  created_at: string;
  is_viewed: boolean;
}

export interface StoryInteraction {
  id: string;
  story_id: string;
  user_id: string;
  interaction_type: 'like' | 'share' | 'product_click';
  created_at: string;
}

export class StoryService {
  /**
   * Récupère toutes les stories des utilisateurs suivis
   */
  static async getFollowedUsersStories(): Promise<ProductStory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase.rpc('get_followed_users_stories', {
      user_uuid: user.id
    });

    if (error) {
      console.error('Erreur lors de la récupération des stories:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère toutes les stories pour la barre de stories (utilisateurs suivis + ses propres stories)
   */
  static async getAllStoriesForBar(): Promise<ProductStory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Récupérer les stories des utilisateurs suivis
    const followedStories = await this.getFollowedUsersStories();

    // Récupérer ses propres stories
    const { data: ownStories, error: ownError } = await supabase
      .from('product_stories')
      .select(`
        *,
        seller:users(username, avatar_url),
        product:products(name, primary_image_url, price)
      `)
      .eq('seller_id', user.id)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (ownError) {
      console.error('Erreur lors de la récupération de ses propres stories:', ownError);
    }

    const formattedOwnStories: ProductStory[] = (ownStories || []).map(story => ({
      id: story.id,
      seller_id: story.seller_id,
      seller_username: story.seller.username,
      seller_avatar_url: story.seller.avatar_url,
      product_id: story.product_id,
      product_name: story.product.name,
      product_image_url: story.product.primary_image_url,
      product_price: story.product.price,
      media_url: story.media_url,
      media_type: story.media_type,
      caption: story.caption,
      expires_at: story.expires_at,
      views_count: story.views_count,
      created_at: story.created_at,
      is_viewed: true // Ses propres stories sont considérées comme vues
    }));

    // Combiner et trier par date de création
    const allStories = [...followedStories, ...formattedOwnStories];
    return allStories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Crée une nouvelle story produit avec upload de fichier
   */
  static async createStoryWithFile(
    productId: string,
    mediaFile: File,
    caption?: string,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<ProductStory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Vérifier que l'utilisateur est le propriétaire du produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Produit non trouvé');
    }

    if (product.seller_id !== user.id) {
      throw new Error('Vous ne pouvez créer des stories que pour vos propres produits');
    }

    try {
      // Upload du fichier
      const uploadResult = await StorageService.uploadFile(mediaFile, onProgress);
      
      // Créer la story avec l'URL du fichier uploadé
      return await this.createStory(
        productId,
        uploadResult.url,
        mediaFile.type.startsWith('video/') ? 'video' : 'image',
        caption
      );
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle story produit
   */
  static async createStory(
    productId: string,
    mediaUrl: string,
    mediaType: 'image' | 'video',
    caption?: string
  ): Promise<ProductStory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Vérifier que l'utilisateur est le propriétaire du produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Produit non trouvé');
    }

    if (product.seller_id !== user.id) {
      throw new Error('Vous ne pouvez créer des stories que pour vos propres produits');
    }

    // Calculer la date d'expiration (24h)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    try {
      const { data, error } = await supabase
        .from('product_stories')
        .insert({
          seller_id: user.id,
          product_id: productId,
          media_url: mediaUrl,
          media_type: mediaType,
          caption,
          expires_at: expiresAt.toISOString()
        })
        .select(`
          *,
          seller:users(username, avatar_url),
          product:products(name, primary_image_url, price)
        `)
        .single();

      if (error) {
        console.error('Erreur lors de la création de la story:', error);
        
        // Si c'est une erreur de permissions, essayer sans les relations
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.log('Tentative de création sans relations...');
          
          const { data: simpleData, error: simpleError } = await supabase
            .from('product_stories')
            .insert({
              seller_id: user.id,
              product_id: productId,
              media_url: mediaUrl,
              media_type: mediaType,
              caption,
              expires_at: expiresAt.toISOString()
            })
            .select('*')
            .single();

          if (simpleError) {
            throw simpleError;
          }

          // Récupérer les données manuellement
          const { data: sellerData } = await supabase
            .from('users')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

          const { data: productData } = await supabase
            .from('products')
            .select('name, primary_image_url, price')
            .eq('id', productId)
            .single();

          return {
            id: simpleData.id,
            seller_id: simpleData.seller_id,
            seller_username: sellerData?.username || 'Utilisateur',
            seller_avatar_url: sellerData?.avatar_url,
            product_id: simpleData.product_id,
            product_name: productData?.name || 'Produit',
            product_image_url: productData?.primary_image_url,
            product_price: productData?.price || 0,
            media_url: simpleData.media_url,
            media_type: simpleData.media_type,
            caption: simpleData.caption,
            expires_at: simpleData.expires_at,
            views_count: simpleData.views_count,
            created_at: simpleData.created_at,
            is_viewed: false
          };
        }
        
        throw error;
      }

      return {
        id: data.id,
        seller_id: data.seller_id,
        seller_username: data.seller.username,
        seller_avatar_url: data.seller.avatar_url,
        product_id: data.product_id,
        product_name: data.product.name,
        product_image_url: data.product.primary_image_url,
        product_price: data.product.price,
        media_url: data.media_url,
        media_type: data.media_type,
        caption: data.caption,
        expires_at: data.expires_at,
        views_count: data.views_count,
        created_at: data.created_at,
        is_viewed: false
      };
    } catch (error) {
      console.error('Erreur lors de la création de la story:', error);
      throw error;
    }
  }

  /**
   * Marque une story comme vue
   */
  static async markStoryAsViewed(storyId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase.rpc('mark_story_as_viewed', {
      story_uuid: storyId,
      user_uuid: user.id
    });

    if (error) {
      console.error('Erreur lors du marquage de la story comme vue:', error);
      throw error;
    }
  }

  /**
   * Crée une interaction avec une story (like, share, product_click)
   */
  static async createStoryInteraction(
    storyId: string,
    interactionType: 'like' | 'share' | 'product_click'
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase.rpc('create_story_interaction', {
      story_uuid: storyId,
      user_uuid: user.id,
      interaction_type_param: interactionType
    });

    if (error) {
      console.error('Erreur lors de la création de l\'interaction:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une story
   */
  static async getStoryStats(storyId: string): Promise<{
    views_count: number;
    likes_count: number;
    shares_count: number;
    product_clicks_count: number;
  }> {
    const { data: story, error: storyError } = await supabase
      .from('product_stories')
      .select('views_count')
      .eq('id', storyId)
      .single();

    if (storyError) throw storyError;

    const { data: interactions, error: interactionsError } = await supabase
      .from('story_interactions')
      .select('interaction_type')
      .eq('story_id', storyId);

    if (interactionsError) throw interactionsError;

    const stats = {
      views_count: story.views_count,
      likes_count: interactions.filter(i => i.interaction_type === 'like').length,
      shares_count: interactions.filter(i => i.interaction_type === 'share').length,
      product_clicks_count: interactions.filter(i => i.interaction_type === 'product_click').length
    };

    return stats;
  }

  /**
   * Supprime une story
   */
  static async deleteStory(storyId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Vérifier que l'utilisateur est le propriétaire de la story
    const { data: story, error: storyError } = await supabase
      .from('product_stories')
      .select('seller_id')
      .eq('id', storyId)
      .single();

    if (storyError || !story) {
      throw new Error('Story non trouvée');
    }

    if (story.seller_id !== user.id) {
      throw new Error('Vous ne pouvez supprimer que vos propres stories');
    }

    const { error } = await supabase
      .from('product_stories')
      .delete()
      .eq('id', storyId);

    if (error) {
      console.error('Erreur lors de la suppression de la story:', error);
      throw error;
    }
  }

  /**
   * Nettoie les stories expirées (fonction utilitaire)
   */
  static async cleanupExpiredStories(): Promise<void> {
    const { error } = await supabase.rpc('cleanup_expired_stories');
    if (error) {
      console.error('Erreur lors du nettoyage des stories expirées:', error);
      throw error;
    }
  }

  /**
   * Vérifie si une story est encore valide (non expirée)
   */
  static isStoryValid(story: ProductStory): boolean {
    const now = new Date();
    const expiresAt = new Date(story.expires_at);
    return expiresAt > now;
  }

  /**
   * Calcule le temps restant avant expiration d'une story
   */
  static getTimeUntilExpiration(story: ProductStory): number {
    const now = new Date();
    const expiresAt = new Date(story.expires_at);
    return Math.max(0, expiresAt.getTime() - now.getTime());
  }

  /**
   * Formate le temps restant en format lisible
   */
  static formatTimeRemaining(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Expiré';
    }
  }
}
