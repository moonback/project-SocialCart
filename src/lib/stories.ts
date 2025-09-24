import { supabase } from './supabase';

export interface ProductStory {
  id: string;
  product_id: string;
  seller_id: string;
  type: 'image' | 'video' | 'text' | 'poll' | 'quiz';
  content: string;
  media_url?: string;
  thumbnail_url?: string;
  duration: number; // en secondes
  background_color?: string;
  text_color?: string;
  font_size?: 'small' | 'medium' | 'large';
  poll_options?: string[];
  poll_results?: Record<string, number>;
  quiz_question?: string;
  quiz_options?: string[];
  quiz_answer?: string;
  quiz_results?: Record<string, number>;
  views_count: number;
  interactions_count: number;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  
  // Relations
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    seller_id: string;
  };
  seller?: {
    id: string;
    username: string;
    avatar_url?: string;
    is_verified: boolean;
  };
}

export interface StoryView {
  id: string;
  story_id: string;
  user_id: string;
  viewed_at: string;
  interaction_type?: 'view' | 'poll_vote' | 'quiz_answer' | 'swipe_up';
  interaction_data?: any;
}

export interface StoryAnalytics {
  story_id: string;
  total_views: number;
  unique_viewers: number;
  completion_rate: number;
  interaction_rate: number;
  swipe_up_rate: number;
  poll_participation_rate?: number;
  quiz_completion_rate?: number;
  demographics: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
  };
}

export class StoryService {
  // Créer une nouvelle story
  static async createStory(storyData: Omit<ProductStory, 'id' | 'created_at' | 'expires_at' | 'views_count' | 'interactions_count' | 'is_active'>): Promise<ProductStory> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24h

    const { data, error } = await supabase
      .from('product_stories')
      .insert({
        ...storyData,
        expires_at: expiresAt.toISOString(),
        views_count: 0,
        interactions_count: 0,
        is_active: true
      })
      .select(`
        *,
        product:products(id, name, price, primary_image_url, seller_id),
        seller:users!product_stories_seller_id_fkey(id, username, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Récupérer les stories actives d'un produit
  static async getProductStories(productId: string): Promise<ProductStory[]> {
    const { data, error } = await supabase
      .from('product_stories')
      .select(`
        *,
        product:products(id, name, price, primary_image_url, seller_id),
        seller:users!product_stories_seller_id_fkey(id, username, avatar_url, is_verified)
      `)
      .eq('product_id', productId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Récupérer toutes les stories actives
  static async getAllActiveStories(): Promise<ProductStory[]> {
    const { data, error } = await supabase
      .from('product_stories')
      .select(`
        *,
        product:products(id, name, price, primary_image_url, seller_id),
        seller:users!product_stories_seller_id_fkey(id, username, avatar_url, is_verified)
      `)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Marquer une story comme vue
  static async markStoryAsViewed(storyId: string, userId: string): Promise<void> {
    // Vérifier si déjà vue
    const { data: existingView } = await supabase
      .from('story_views')
      .select('id')
      .eq('story_id', storyId)
      .eq('user_id', userId)
      .single();

    if (existingView) return; // Déjà vue

    // Ajouter la vue
    await supabase
      .from('story_views')
      .insert({
        story_id: storyId,
        user_id: userId,
        viewed_at: new Date().toISOString(),
        interaction_type: 'view'
      });

    // Incrémenter le compteur de vues
    await supabase.rpc('increment_story_views', { story_id: storyId });
  }

  // Participer à un sondage
  static async voteInPoll(storyId: string, userId: string, option: string): Promise<void> {
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        user_id: userId,
        viewed_at: new Date().toISOString(),
        interaction_type: 'poll_vote',
        interaction_data: { option }
      });

    if (error) throw error;

    // Mettre à jour les résultats du sondage
    await supabase.rpc('increment_poll_vote', { 
      story_id: storyId, 
      option: option 
    });
  }

  // Répondre à un quiz
  static async answerQuiz(storyId: string, userId: string, answer: string): Promise<void> {
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        user_id: userId,
        viewed_at: new Date().toISOString(),
        interaction_type: 'quiz_answer',
        interaction_data: { answer }
      });

    if (error) throw error;

    // Mettre à jour les résultats du quiz
    await supabase.rpc('increment_quiz_answer', { 
      story_id: storyId, 
      answer: answer 
    });
  }

  // Swipe up (action sur le produit)
  static async swipeUp(storyId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        user_id: userId,
        viewed_at: new Date().toISOString(),
        interaction_type: 'swipe_up'
      });

    if (error) throw error;

    // Incrémenter les interactions
    await supabase.rpc('increment_story_interactions', { story_id: storyId });
  }

  // Récupérer les analytics d'une story
  static async getStoryAnalytics(storyId: string): Promise<StoryAnalytics> {
    const { data, error } = await supabase
      .from('story_analytics')
      .select('*')
      .eq('story_id', storyId)
      .single();

    if (error) throw error;
    return data;
  }

  // Supprimer une story
  static async deleteStory(storyId: string): Promise<void> {
    const { error } = await supabase
      .from('product_stories')
      .update({ is_active: false })
      .eq('id', storyId);

    if (error) throw error;
  }

  // Nettoyer les stories expirées
  static async cleanupExpiredStories(): Promise<void> {
    const { error } = await supabase
      .from('product_stories')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
  }
}
