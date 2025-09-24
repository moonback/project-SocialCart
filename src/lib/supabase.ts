import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'  // Plus sécurisé pour les apps web
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

export type User = {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
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
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  video_url?: string;
  image_url: string;
  images: string[];
  variants: ProductVariant[];
  likes_count: number;
  seller_id: string;
  user: User;
  created_at: string;
  // Nouvelles propriétés ajoutées
  sku?: string;
  compare_price?: number;
  cost_price?: number;
  weight?: number;
  dimensions?: string;
  status?: string;
  inventory_tracking?: boolean;
  inventory_quantity?: number;
  allow_backorder?: boolean;
  requires_shipping?: boolean;
  taxable?: boolean;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  category_id?: string;
  brand_id?: string;
  views_count?: number;
  sales_count?: number;
  rating_average?: number;
  rating_count?: number;
  short_description?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  options: string[];
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selected_variants: Record<string, string>;
};

export type Order = {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
};