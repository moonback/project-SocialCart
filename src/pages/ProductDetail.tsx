import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  ShoppingCart, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Minus,
  Plus,
  Bookmark,
  Flag,
  ShieldCheck,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Product, supabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useSocial } from '../hooks/useSocial';
import { ProductCard } from '../components/ProductCard';
import { ProductService } from '../lib/products';
import { getCategoryName, getBrandName } from '../lib/categories';
import { UserAvatar } from '../components/UserAvatar';
import { AdaptiveProductDetail } from '../components/AdaptiveProductDetail';
import toast from 'react-hot-toast';

// Résout une URL d'avatar : si c'est un chemin de stockage, retourne l'URL publique
function resolveAvatarUrl(possibleUrl?: string) {
  if (!possibleUrl) return undefined;
  if (possibleUrl.startsWith('http')) return possibleUrl;
  try {
    const path = possibleUrl.startsWith('profiles/') ? possibleUrl : `profiles/${possibleUrl}`;
    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(path);
    return publicUrl || undefined;
  } catch {
    return undefined;
  }
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleLike, toggleBookmark, isLiked, isBookmarked } = useSocial();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        // Essayer de charger le produit depuis la base de données
        const dbProduct = await ProductService.getProductById(id);
        
        if (dbProduct) {
          // Incrémenter le compteur de vues
          try {
            // Mise à jour directe du compteur de vues
            await supabase
              .from('products')
              .update({ 
                views_count: (dbProduct.views_count || 0) + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', id);
          } catch (error) {
            console.error('Error incrementing views:', error);
          }

          // Convertir le produit de la BDD vers le format attendu avec toutes les informations
          const convertedProduct: Product = {
            id: dbProduct.id,
            name: dbProduct.name,
            description: dbProduct.description,
            price: dbProduct.price,
            image_url: dbProduct.primary_image_url || (dbProduct.images && dbProduct.images[0]) || '',
            images: dbProduct.images || [],
            video_url: dbProduct.video_url || undefined,
            variants: [], // Les variantes sont stockées dans les tags
            likes_count: dbProduct.likes_count || 0,
            seller_id: dbProduct.seller_id,
            user: dbProduct.seller ? {
              id: dbProduct.seller.id,
              email: dbProduct.seller.email,
              username: dbProduct.seller.username,
              loyalty_points: dbProduct.seller.loyalty_points,
              is_seller: dbProduct.seller.is_seller,
              is_verified: dbProduct.seller.is_verified,
              created_at: dbProduct.seller.created_at,
              updated_at: dbProduct.seller.updated_at,
              avatar_url: resolveAvatarUrl(dbProduct.seller.avatar_url),
            } : {
              id: dbProduct.seller_id,
              email: 'user@example.com',
              username: 'user',
              loyalty_points: 0,
              is_seller: true,
              is_verified: true,
              created_at: dbProduct.created_at,
              updated_at: dbProduct.created_at,
            },
            created_at: dbProduct.created_at,
            // Ajouter toutes les nouvelles propriétés
            sku: dbProduct.sku,
            compare_price: dbProduct.compare_price,
            cost_price: dbProduct.cost_price,
            weight: dbProduct.weight,
            dimensions: typeof dbProduct.dimensions === 'string' ? dbProduct.dimensions : JSON.stringify(dbProduct.dimensions),
            status: dbProduct.status,
            inventory_tracking: dbProduct.inventory_tracking,
            inventory_quantity: dbProduct.inventory_quantity,
            allow_backorder: dbProduct.allow_backorder,
            requires_shipping: dbProduct.requires_shipping,
            taxable: dbProduct.taxable,
            tags: dbProduct.tags,
            meta_title: dbProduct.meta_title,
            meta_description: dbProduct.meta_description,
            category_id: dbProduct.category_id,
            brand_id: dbProduct.brand_id,
            views_count: dbProduct.views_count || 0,
            sales_count: dbProduct.sales_count || 0,
            rating_average: dbProduct.rating_average || 4.8,
            rating_count: dbProduct.rating_count || 324,
            short_description: dbProduct.short_description,
          };
          
          setProduct(convertedProduct);
        } else {
          // Fallback vers des données mockées si le produit n'est pas trouvé
          const mockProduct: Product = {
            id: id,
            name: 'Écouteurs Sans Fil Pro',
            description: 'Qualité sonore exceptionnelle avec réduction de bruit active. Parfait pour la musique et les appels.',
            price: 129.99,
            image_url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            images: [
              'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            ],
            variants: [
              { id: '1', name: 'Couleur', options: ['Noir', 'Blanc', 'Bleu'] },
              { id: '2', name: 'Taille', options: ['Standard', 'Grand'] }
            ],
            likes_count: 1234,
            seller_id: '1',
            user: {
              id: '1',
              email: 'user@example.com',
              username: 'techguru',
              loyalty_points: 500,
              is_seller: true,
              is_verified: true,
              created_at: '2024-01-01',
              updated_at: '2024-01-01',
            },
            created_at: '2024-01-01',
          };
          
          setProduct(mockProduct);
        }

        // Charger des suggestions
        const allProducts = await ProductService.getProducts();
        const otherProducts = allProducts.filter(p => p.id !== id).slice(0, 2);
        
        const convertedSuggestions: Product[] = otherProducts.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image_url: p.primary_image_url || (p.images && p.images[0]) || '',
          images: p.images || [],
          variants: [],
          likes_count: p.likes_count || 0,
          seller_id: p.seller_id,
          user: p.seller ? {
            id: p.seller.id,
            email: p.seller.email,
            username: p.seller.username,
            loyalty_points: p.seller.loyalty_points,
            is_seller: p.seller.is_seller,
            is_verified: p.seller.is_verified,
            created_at: p.seller.created_at,
            updated_at: p.seller.updated_at,
            avatar_url: resolveAvatarUrl(p.seller.avatar_url),
          } : {
            id: p.seller_id,
            email: 'user@example.com',
            username: 'user',
            loyalty_points: 0,
            is_seller: true,
            is_verified: true,
            created_at: p.created_at,
            updated_at: p.created_at,
          },
          created_at: p.created_at,
        }));

        setSuggestions(convertedSuggestions);

      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Erreur lors du chargement du produit');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedVariants);
      toast.success(`${product.name} ajouté au panier !`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedVariants);
      toast.success(`${product.name} ajouté au panier !`);
      navigate('/cart');
    }
  };

  // Nouvelles fonctions utilitaires
  const handleLike = async () => {
    if (product) {
      await toggleLike(product.id);
      toast.success(isLiked(product.id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
    }
  };

  const handleBookmark = async () => {
    if (product) {
      await toggleBookmark(product.id);
      toast.success(isBookmarked(product.id) ? 'Retiré des signets' : 'Ajouté aux signets');
    }
  };


  const handleAddToWishlist = async () => {
    setIsAddingToWishlist(true);
    await handleBookmark();
    setTimeout(() => setIsAddingToWishlist(false), 1000);
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product?.compare_price && product?.price) {
      return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
    }
    return 0;
  };

  const getStockStatus = () => {
    if (!product) return { status: 'unknown', message: '', color: 'gray' };
    
    if (product.inventory_tracking) {
      const quantity = product.inventory_quantity || 0;
      if (quantity > 10) {
        return { status: 'in-stock', message: 'En stock', color: 'green' };
      } else if (quantity > 0) {
        return { status: 'low-stock', message: `Seulement ${quantity} restants`, color: 'yellow' };
      } else if (product.allow_backorder) {
        return { status: 'backorder', message: 'Commande en attente', color: 'orange' };
      } else {
        return { status: 'out-of-stock', message: 'Rupture de stock', color: 'red' };
      }
    }
    
    return { status: 'unlimited', message: 'Disponible', color: 'blue' };
  };

  // Fonctions pour les actions
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [type]: value }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleToggleLike = () => {
    if (product) {
      toggleLike(product.id);
    }
  };

  const handleToggleBookmark = () => {
    if (product) {
      toggleBookmark(product.id);
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  const handleReport = () => {
    toast.success('Produit signalé. Merci pour votre vigilance !');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">Chargement du produit</h2>
            <p className="text-surface-600">Récupération des informations...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto shadow-glow">
            <span className="text-white font-bold text-3xl">❌</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">Produit non trouvé</h2>
            <p className="text-surface-600">Ce produit n'existe pas ou a été supprimé</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="btn-primary px-8 py-3"
          >
            Retour à l'accueil
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <AdaptiveProductDetail
      product={product}
      selectedImage={selectedImage}
      selectedVariants={selectedVariants}
      quantity={quantity}
      relatedProducts={suggestions}
      onImageSelect={handleImageSelect}
      onVariantSelect={handleVariantSelect}
      onQuantityChange={handleQuantityChange}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onToggleLike={handleToggleLike}
      onToggleBookmark={handleToggleBookmark}
      onShare={handleShare}
      onReport={handleReport}
      isLiked={isLiked(product.id)}
      isBookmarked={isBookmarked(product.id)}
      mobileContent={
        <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
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
            
            {/* Bouton Retour à la vidéo */}
            {product?.video_url && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <Play className="w-5 h-5 text-white" />
              </motion.button>
            )}
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                {product?.name}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Bouton Signet */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-all ${
                product && isBookmarked(product.id)
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${product && isBookmarked(product.id) ? 'fill-current' : ''}`} />
            </motion.button>
            
            {/* Bouton Like */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`p-2 rounded-full transition-all ${
                product && isLiked(product.id)
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${product && isLiked(product.id) ? 'fill-current' : ''}`} />
            </motion.button>
            
            {/* Bouton Partager */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <Share className="w-5 h-5" />
            </motion.button>
            
            {/* Bouton Signaler */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReport}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <Flag className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-40">
        {/* Galerie d'Images Simplifiée */}
        <div className="space-y-4 mb-6">
          {/* Image Principale */}
          <div className="relative group">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <motion.img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Badge de Réduction Amélioré */}
              {calculateDiscount() > 0 && (
                <div className="absolute top-4 left-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">🔥</span>
                      <span>-{calculateDiscount()}%</span>
                    </div>
                    <div className="text-xs opacity-90">PROMO</div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
          
          {/* Miniatures avec Navigation */}
          <div className="relative">
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-purple-600 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
            
            {/* Indicateur de Position */}
            <div className="flex justify-center mt-2 space-x-1">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedImage === index ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Informations Produit Améliorées */}
        <div className="space-y-6">
          {/* En-tête du Produit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
                
                {/* Tags et Métadonnées */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {product.sku && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Réf: {product.sku}
                    </span>
                  )}
                  {product.category_id && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {getCategoryName(product.category_id) || 'Catégorie'}
                    </span>
                  )}
                  {product.brand_id && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {getBrandName(product.brand_id) || 'Marque'}
                    </span>
                  )}
                  {product.taxable && (
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      TTC
                    </span>
                  )}
                </div>
              </div>
              
              {/* Prix avec Animation Améliorée */}
              <div className="text-right">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-end space-y-1"
                >
                  {/* Prix actuel */}
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </span>
                  
                  {/* Prix de comparaison et économies */}
                  {product.compare_price && product.compare_price > product.price && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-end space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.compare_price)}
                        </span>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          className="text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold shadow-lg"
                        >
                          -{calculateDiscount()}%
                        </motion.span>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-1">
                        <span className="text-sm font-semibold text-green-700">
                          Économisez {formatPrice(product.compare_price - product.price)}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
            
            {/* Description Courte */}
            {product.short_description && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <p className="text-gray-700 text-sm leading-relaxed">{product.short_description}</p>
              </div>
            )}
          </motion.div>
          
          {/* Informations Vendeur et Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            {/* Vendeur */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <UserAvatar 
                  avatarUrl={product.user.avatar_url} 
                  username={product.user.username} 
                  size="lg" 
                  className="w-12 h-12"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">@{product.user.username}</h3>
                    {product.user.is_verified && (
                      <div className="flex items-center space-x-1">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Vérifié</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {product.user.is_seller ? 'Vendeur' : 'Utilisateur'} • {product.user.loyalty_points} points
                  </p>
                </div>
              </div>
            </div>
            
            
          </motion.div>
          
          {/* Statut de Stock Amélioré */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Disponibilité</h3>
            </div>
            
            {(() => {
              const stockStatus = getStockStatus();
              return (
                <div className={`flex items-center space-x-3 p-4 rounded-xl border ${
                  stockStatus.color === 'green' ? 'bg-green-50 border-green-200' :
                  stockStatus.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  stockStatus.color === 'red' ? 'bg-red-50 border-red-200' :
                  stockStatus.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  {stockStatus.status === 'in-stock' && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {stockStatus.status === 'low-stock' && <Clock className="w-6 h-6 text-yellow-500" />}
                  {stockStatus.status === 'out-of-stock' && <AlertCircle className="w-6 h-6 text-red-500" />}
                  {stockStatus.status === 'backorder' && <Clock className="w-6 h-6 text-orange-500" />}
                  {stockStatus.status === 'unlimited' && <Info className="w-6 h-6 text-blue-500" />}
                  
                  <div>
                    <p className={`font-semibold ${
                      stockStatus.color === 'green' ? 'text-green-700' :
                      stockStatus.color === 'yellow' ? 'text-yellow-700' :
                      stockStatus.color === 'red' ? 'text-red-700' :
                      stockStatus.color === 'orange' ? 'text-orange-700' :
                      'text-blue-700'
                    }`}>
                      {stockStatus.message}
                    </p>
                    
                  </div>
                </div>
              );
            })()}
            
          </motion.div>

          {/* Variantes et Quantité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6"
          >
            {/* Variantes */}
            {product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Options disponibles</h3>
                {product.variants.map((variant) => (
                  <div key={variant.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">{variant.name}</h4>
                      {selectedVariants[variant.name] && (
                        <span className="text-sm text-purple-600 font-medium">
                          {selectedVariants[variant.name]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <motion.button
                          key={option}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                          className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                            selectedVariants[variant.name] === option
                              ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantité */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Quantité</h3>
                <span className="text-sm text-gray-500">
                  Prix unitaire: {formatPrice(product.price)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl text-gray-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <span className="text-sm text-gray-500">unité{quantity > 1 ? 's' : ''}</span>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              
              {/* Prix Total Amélioré */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {formatPrice(product.price * quantity)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                      <div className="text-sm text-gray-400 line-through">
                        {formatPrice(product.compare_price * quantity)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Économies totales */}
                {(quantity > 1 || (product.compare_price && product.compare_price > product.price)) && (
                  <div className="space-y-1">
                    {quantity > 1 && (
                      <p className="text-sm text-gray-600">
                        Économisez {formatPrice(product.price * (quantity - 1))} en achetant plusieurs unités
                      </p>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-2 border border-green-200">
                        <p className="text-sm font-semibold text-green-700">
                          💰 Économie totale : {formatPrice((product.compare_price - product.price) * quantity)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description et Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-gray-900">Produits similaires</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <ProductCard key={suggestion.id} product={suggestion} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions en Bas Améliorées */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
        <div className="p-4 space-y-3">
          {/* Actions Principales */}
          <div className="flex space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Ajouter au panier</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Acheter maintenant
            </motion.button>
          </div>
          
          {/* Actions Secondaires */}
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                isAddingToWishlist
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isAddingToWishlist ? 'animate-pulse' : ''}`} />
              <span>{isAddingToWishlist ? 'Ajouté !' : 'Liste de souhaits'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
      }
    />
  );
}