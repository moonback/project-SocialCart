import { supabase } from './supabase';

export type LoyaltyAction =
  | 'like_product'
  | 'comment_product'
  | 'share_product'
  | 'follow_user'
  | 'create_product';

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  action: LoyaltyAction;
  object_id?: string | null;
  points: number;
  tx_day: string; // date
  created_at: string;
}

export class LoyaltyService {
  static async awardPoints(userId: string, action: LoyaltyAction, objectId?: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('award_loyalty_points', {
        p_user_id: userId,
        p_action: action,
        p_object_id: objectId || null
      });

      if (error) throw error;
      return typeof data === 'number' ? data : 0;
    } catch (error) {
      console.error('Error awarding loyalty points:', error);
      return 0;
    }
  }

  static async getMyTransactions(): Promise<LoyaltyTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching loyalty transactions:', error);
      return [];
    }
  }
}


