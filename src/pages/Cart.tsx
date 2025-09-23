import { useState } from 'react';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Share, 
  Gift, 
  Truck, 
  Shield, 
  CreditCard, 
  CheckCircle, 
  RefreshCw,
  HelpCircle,
  Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useSocial } from '../hooks/useSocial';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toggleBookmark, isBookmarked } = useSocial();
  
  // États pour les fonctionnalités avancées
  const [promoDiscount] = useState(0);
  const [selectedShipping] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // États pour les animations
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);

  // Fonctions utilitaires
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 50) return 0;
    
    switch (selectedShipping) {
      case 'express': return 9.99;
      case 'priority': return 4.99;
      default: return 2.99;
    }
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.20; // TVA 20%
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    return subtotal + shipping + tax - promoDiscount;
  };


  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => [...prev, itemId]);
    await updateQuantity(itemId, newQuantity);
    setTimeout(() => {
      setUpdatingItems(prev => prev.filter(id => id !== itemId));
    }, 500);
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => [...prev, itemId]);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => prev.filter(id => id !== itemId));
      toast.success('Article retiré du panier');
    }, 300);
  };

  const handleAddToWishlist = async (productId: string) => {
    await toggleBookmark(productId);
    toast.success(isBookmarked(productId) ? 'Retiré des signets' : 'Ajouté aux signets');
  };

  const handleShareItem = () => {
    toast.success('Lien de partage copié !');
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulation du traitement
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/payment');
    }, 1000);
  };


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
        {/* Header Amélioré */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </motion.button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Panier</h1>
                <p className="text-sm text-gray-500">Vos articles sélectionnés</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.success('Support client à venir')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* État Vide Amélioré */}
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <ShoppingCart className="w-16 h-16 text-purple-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Votre panier est vide</h2>
              <p className="text-gray-600 leading-relaxed">
                Découvrez nos produits et ajoutez vos favoris à votre panier pour commencer vos achats
              </p>
            </div>
            
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Commencer mes achats
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.success('Recommandations à venir')}
                className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Voir les recommandations
              </motion.button>
            </div>
            
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Amélioré */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </motion.button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Panier ({items.length})</h1>
              <p className="text-sm text-gray-500">Total: {formatPrice(calculateTotal())}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success('Fonctionnalité à venir')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <Gift className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success('Support client à venir')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <HelpCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="px-3 py-1 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              Vider
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-40">
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -300, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                removingItems.includes(item.id) ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex space-x-4">
                {/* Image du Produit */}
                <div className="relative">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm"
                  />
                  {updatingItems.includes(item.id) && (
                    <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-purple-600 animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Informations du Produit */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">par @{item.product.user.username}</p>
                    </div>
                    
                    {/* Actions Rapides */}
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToWishlist(item.product.id)}
                        className={`p-2 rounded-full transition-all ${
                          isBookmarked(item.product.id)
                            ? 'bg-purple-100 text-purple-600'
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked(item.product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShareItem}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                      >
                        <Share className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Variantes */}
                  {Object.entries(item.selected_variants).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.selected_variants).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contrôles de Quantité et Prix */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      
                      <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-bold text-lg text-purple-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Checkout Améliorée */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
        <div className="p-4 space-y-4">
          {/* Résumé de Commande */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className={calculateShipping() === 0 ? 'text-green-600 font-semibold' : ''}>
                {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA (20%)</span>
              <span className="font-medium">{formatPrice(calculateTax())}</span>
            </div>
            
            {promoDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Remise</span>
                <span className="font-semibold">-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-purple-600">{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          {/* Bouton Checkout Principal */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isProcessing || items.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Finaliser la commande</span>
              </>
            )}
          </motion.button>
          
          {/* Actions Secondaires */}
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success('Options de livraison à venir')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Livraison</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success('Options cadeau à venir')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Cadeau</span>
            </motion.button>
          </div>
          
          {/* Indicateurs de Sécurité */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Garantie 30 jours</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="w-3 h-3" />
              <span>Livraison rapide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}