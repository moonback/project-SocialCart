import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Shield,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Gift,
  Star,
  User,
  Mail,
  Phone,
  Building,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Copy,
  Download,
  RefreshCw,
  Zap,
  Award,
  Heart,
  Bookmark,
  Share,
  Flag,
  HelpCircle,
  Settings,
  Bell,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Payment() {
  const navigate = useNavigate();
  const { total, clearCart, items } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Nouveaux états pour les fonctionnalités avancées
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedInsurance, setSelectedInsurance] = useState(false);
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [showSecurityFeatures, setShowSecurityFeatures] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false);
  
  // États pour les formulaires
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [rememberCard, setRememberCard] = useState(false);
  
  // États pour l'adresse
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('France');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // États pour les options avancées
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Initialisation des données utilisateur
  useEffect(() => {
    if (user) {
      setFullName(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

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
    const insurance = selectedInsurance ? 2.99 : 0;
    return subtotal + shipping + tax + insurance - promoDiscount;
  };

  const handlePromoCode = () => {
    const validCodes = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'FIRSTORDER': 15,
      'LOYALTY': 25
    };
    
    const discount = validCodes[promoCode.toUpperCase() as keyof typeof validCodes];
    if (discount) {
      setPromoDiscount(discount);
      setIsPromoValid(true);
      toast.success(`Code promo appliqué ! -${formatPrice(discount)}`);
    } else {
      setIsPromoValid(false);
      toast.error('Code promo invalide');
    }
  };

  const handlePayment = async () => {
    if (!agreeToTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }
    
    setLoading(true);
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      setLoading(false);
      const orderNum = `CMD-${Date.now().toString().slice(-6)}`;
      setOrderNumber(orderNum);
      setEstimatedDelivery(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'));
      setShowOrderTracking(true);
      
      clearCart();
      toast.success(`Commande ${orderNum} passée avec succès !`);
      
      setTimeout(() => {
        navigate('/profile', { state: { showOrders: true } });
      }, 3000);
    }, 2000);
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success('Numéro de commande copié !');
  };

  const downloadReceipt = () => {
    toast.success('Reçu téléchargé !');
  };

  const getShippingInfo = () => {
    switch (selectedShipping) {
      case 'express':
        return { name: 'Express', time: '24h', icon: Zap };
      case 'priority':
        return { name: 'Prioritaire', time: '2-3 jours', icon: Clock };
      default:
        return { name: 'Standard', time: '3-5 jours', icon: Truck };
    }
  };

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
              <h1 className="text-lg font-semibold text-gray-900">Paiement sécurisé</h1>
              <p className="text-sm text-gray-500">Finalisez votre commande</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSecurityInfo(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <Shield className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCustomerSupport(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <HelpCircle className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-32 space-y-6">
        {/* Résumé de Commande Amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Résumé de la commande</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              {showOrderSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showOrderSummary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {/* Articles */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Détail des coûts */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className={calculateShipping() === 0 ? 'text-green-600 font-semibold' : ''}>
                      {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA (20%)</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  {selectedInsurance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assurance</span>
                      <span>{formatPrice(2.99)}</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 space-y-4">
          <h2 className="font-semibold text-gray-900">Payment Method</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border rounded-xl flex items-center space-x-3 ${
                paymentMethod === 'card' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Credit/Debit Card</span>
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-4 space-y-4">
          <h2 className="font-semibold text-gray-900">Shipping Address</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Address Line 1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {/* Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay ${(total * 1.08).toFixed(2)}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}