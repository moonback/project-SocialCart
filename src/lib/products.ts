import { supabase } from './supabase';

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category_id?: string;
  brand_id?: string;
  short_description?: string;
  sku?: string;
  compare_price?: number;
  cost_price?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  status?: 'draft' | 'active' | 'inactive' | 'archived';
  inventory_tracking?: boolean;
  inventory_quantity?: number;
  allow_backorder?: boolean;
  requires_shipping?: boolean;
  taxable?: boolean;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  video_url?: string;
  primary_image_url?: string;
  images?: string[];
  variants?: ProductVariant[];
}

export interface Product {
  id: string;
  seller_id: string;
  category_id?: string;
  brand_id?: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  sku?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  status: 'draft' | 'active' | 'inactive' | 'archived';
  inventory_tracking: boolean;
  inventory_quantity: number;
  allow_backorder: boolean;
  requires_shipping: boolean;
  taxable: boolean;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  video_url?: string;
  primary_image_url?: string;
  images: string[];
  likes_count: number;
  views_count: number;
  sales_count: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  seller?: {
    id: string;
    username: string;
    avatar_url?: string;
    email: string;
    loyalty_points: number;
    is_seller: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
}

export class ProductService {
  // Upload des fichiers média
  static async uploadMedia(files: File[], videoFile?: File | null): Promise<{
    images: string[];
    videoUrl?: string;
    primaryImageUrl?: string;
  }> {
    try {
      const uploadedImages: string[] = [];
      let videoUrl: string | undefined;
      let primaryImageUrl: string | undefined;

      // Upload des images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        uploadedImages.push(publicUrl);
        
        // La première image devient l'image principale
        if (i === 0) {
          primaryImageUrl = publicUrl;
        }
      }

      // Upload de la vidéo si fournie
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, videoFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          videoUrl = publicUrl;
        }
      }

      return {
        images: uploadedImages,
        videoUrl,
        primaryImageUrl
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Erreur lors de l\'upload des médias');
    }
  }

  // Créer un produit
  static async createProduct(data: CreateProductData, sellerId: string): Promise<Product> {
    try {
      // Préparer les tags avec les variantes
      const tags: string[] = [];
      
      // Ajouter les variantes aux tags
      if (data.variants && data.variants.length > 0) {
        data.variants.forEach(variant => {
          if (variant.name && variant.options.length > 0) {
            variant.options.forEach(option => {
              if (option.trim()) {
                tags.push(`${variant.name}:${option.trim()}`);
              }
            });
          }
        });
      }

      // Appeler la fonction PostgreSQL
      const { data: productId, error } = await supabase.rpc('create_product', {
        p_seller_id: sellerId,
        p_name: data.name,
        p_description: data.description,
        p_price: data.price,
        p_category_id: data.category_id || null,
        p_brand_id: data.brand_id || null,
        p_short_description: data.short_description || null,
        p_sku: data.sku || null,
        p_compare_price: data.compare_price || null,
        p_cost_price: data.cost_price || null,
        p_weight: data.weight || null,
        p_dimensions: data.dimensions || null,
        p_status: data.status || 'active',
        p_inventory_tracking: data.inventory_tracking !== false,
        p_inventory_quantity: data.inventory_quantity || 0,
        p_allow_backorder: data.allow_backorder || false,
        p_requires_shipping: data.requires_shipping !== false,
        p_taxable: data.taxable !== false,
        p_tags: tags.length > 0 ? tags : null,
        p_meta_title: data.meta_title || null,
        p_meta_description: data.meta_description || null,
        p_video_url: data.video_url || null,
        p_primary_image_url: data.primary_image_url || null,
        p_images: data.images || []
      });

      if (error) {
        console.error('Error creating product:', error);
        throw new Error('Erreur lors de la création du produit');
      }

      // Récupérer le produit créé
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) {
        console.error('Error fetching created product:', fetchError);
        throw new Error('Erreur lors de la récupération du produit créé');
      }

      return product;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  }

  // Récupérer des produits suggérés basés sur une catégorie
  static async getSuggestedProducts(categoryId?: string, excludeId?: string, limit: number = 4): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey(
            id,
            username,
            avatar_url,
            email,
            loyalty_points,
            is_seller,
            is_verified,
            created_at,
            updated_at
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Exclure le produit actuel
      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      // Prioriser les produits de la même catégorie
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query.limit(limit);

      if (error) {
        console.error('Error fetching suggested products:', error);
        throw new Error('Erreur lors de la récupération des suggestions');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuggestedProducts:', error);
      throw error;
    }
  }

  // Récupérer tous les produits avec les informations utilisateur
  static async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey(
            id,
            username,
            avatar_url,
            email,
            loyalty_points,
            is_seller,
            is_verified,
            created_at,
            updated_at
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error('Erreur lors de la récupération des produits');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  // Récupérer un produit par ID avec les informations du vendeur
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey(
            id,
            username,
            avatar_url,
            email,
            loyalty_points,
            is_seller,
            is_verified,
            created_at,
            updated_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  }

  // Mettre à jour un produit
  static async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw new Error('Erreur lors de la mise à jour du produit');
      }

      return product;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  }

  // Supprimer un produit
  static async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw new Error('Erreur lors de la suppression du produit');
      }
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }

  // Incrémenter le compteur de vues
  static async incrementViews(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_product_views', {
        product_id: id
      });

      if (error) {
        console.error('Error incrementing views:', error);
        throw new Error('Erreur lors de l\'incrémentation des vues');
      }
    } catch (error) {
      console.error('Error in incrementViews:', error);
      throw error;
    }
  }
}
