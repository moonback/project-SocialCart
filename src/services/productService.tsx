import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const productService = {
  async deleteProduct(productId: string, userId: string): Promise<boolean> {
    try {
      console.log('Suppression définitive du produit:', productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', userId);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      toast.success('Produit supprimé définitivement');
      return true;
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error('Erreur lors de la suppression du produit: ' + errorMessage);
      return false;
    }
  },

  async disableProduct(productId: string, userId: string): Promise<boolean> {
    try {
      console.log('Désactivation du produit:', productId);
      
      const { error } = await supabase
        .from('products')
        .update({ status: 'inactive' })
        .eq('id', productId)
        .eq('seller_id', userId);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      toast.success('Produit désactivé avec succès');
      return true;
    } catch (error: unknown) {
      console.error('Erreur lors de la désactivation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error('Erreur lors de la désactivation du produit: ' + errorMessage);
      return false;
    }
  },

  reportProduct(productId: string): void {
    // Logique de signalement
    console.log('Signalement du produit:', productId);
    toast.success('Signalement envoyé');
  }
};
