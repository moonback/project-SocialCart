import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share, 
  ShoppingCart, 
  Clock, 
  CheckCircle,
  Info,
  Minus,
  Plus,
  Bookmark,
  Flag,
  ShieldCheck,
  Play,
  Star,
  Eye,
  MessageCircle,
  TrendingUp,
  Award,
  Truck,
  RotateCcw,
  Shield,
  X,
  SquarePen
} from 'lucide-react';
import { Product } from '../../lib/supabase';
import { UserAvatar } from '../UserAvatar';
import { ProductCard } from '../ProductCard';
import { StatsPanel } from '../VideoFeed/StatsPanel';
import { getCategoryName, getBrandName } from '../../lib/categories';
import { useAuth } from '../../hooks/useAuth';

interface DesktopProductDetailProps {
  product: Product;
  selectedImage: number;
  quantity: number;
  relatedProducts: Product[];
  onImageSelect: (index: number) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  onReport: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const DesktopProductDetail: React.FC<DesktopProductDetailProps> = ({
  product,
  selectedImage,
  quantity,
  relatedProducts,
  onImageSelect,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onToggleLike,
  onToggleBookmark,
  onShare,
  onReport,
  isLiked,
  isBookmarked,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'shipping'>('description');
  const [showVideo, setShowVideo] = useState(false);

  // Vérifier si c'est le produit de l'utilisateur connecté
  const isOwner = user && product.user_id === user.id;

  // Gérer la fermeture de la vidéo avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showVideo) {
        setShowVideo(false);
      }
    };

    if (showVideo) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Restaurer le scroll
    };
  }, [showVideo]);

  // Calcul du prix avec variantes
  const finalPrice = useMemo(() => {
    const price = product.price;
    // Note: Les variantes ne sont pas encore implémentées avec les ajustements de prix
    // Cette logique sera mise à jour quand la structure des variantes sera définie
    return price;
  }, [product.price]);

  // Images disponibles
  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-12xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Galerie d'images - 6 colonnes */}
          <div className="col-span-6">
            <div className="sticky top-8">
              {/* Image principale */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {/* Badge vidéo si disponible */}
                {product.video_url && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVideo(true)}
                    className="absolute top-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white shadow-lg hover:bg-black/70 transition-colors"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                    <span className="text-sm font-medium">Vidéo</span>
                  </motion.button>
                )}

                {/* Actions flottantes */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleLike}
                    className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg transition-all ${
                      isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleBookmark}
                    className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg transition-all ${
                      isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onShare}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white shadow-lg transition-all"
                  >
                    <Share className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Miniatures */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onImageSelect(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Section sous l'image */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de ce produit</h3>
                
                {/* Description courte */}
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description.length > 200 
                    ? `${product.description.substring(0, 200)}...` 
                    : product.description}
                </p>

                {/* Informations clés */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Produit authentique</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Garantie 2 ans</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-purple-500" />
                    <span>Livraison gratuite</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <RotateCcw className="w-4 h-4 text-orange-500" />
                    <span>Retour 30j</span>
                  </div>
                </div>

                {/* Bouton vidéo */}
                {product.video_url && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowVideo(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Voir la vidéo du produit</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Informations produit - 6 colonnes */}
          <div className="col-span-6">
            <div className="space-y-6">
              {/* En-tête produit */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.0 • 127 avis)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{product.views_count || 0} vues</span>
                  </div>
                </div>

                {/* Vendeur */}
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 mb-6">
                  <UserAvatar
                    avatarUrl={product.user?.avatar_url}
                    username={product.user?.username || 'Vendeur'}
                    size="lg"
                    className="w-12 h-12"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">@{product.user?.username || 'Vendeur'}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Award className="w-4 h-4" />
                      <span>Vendeur vérifié</span>
                      <span>•</span>
                      <span>98% de satisfaction</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Suivre
                  </motion.button>
                </div>
              </div>

              {/* Prix */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">€{finalPrice.toFixed(2)}</div>
                    {product.compare_price && product.compare_price > finalPrice && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg text-gray-500 line-through">€{product.compare_price}</span>
                        <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                          -{Math.round((1 - finalPrice / product.compare_price) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Livraison</div>
                    <div className="font-semibold text-green-600">Gratuite</div>
                  </div>
                </div>

                {/* Variantes - Temporairement désactivées jusqu'à la définition de la structure */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-500 text-sm">Les variantes seront disponibles prochainement</p>
                  </div>
                )}

                {/* Quantité */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Stock disponible</div>
                    <div className={`font-semibold ${
                      !product.inventory_tracking ? 'text-blue-600' :
                      (product.inventory_quantity || 0) > 10 ? 'text-green-600' : 
                      (product.inventory_quantity || 0) > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {!product.inventory_tracking ? 'Illimité' :
                       (product.inventory_quantity || 0) > 0 ? `${product.inventory_quantity} unités` : 'Rupture de stock'}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddToCart}
                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Ajouter au panier</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBuyNow}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Acheter maintenant
                  </motion.button>
                </div>

                {/* Garanties */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Livraison rapide</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <RotateCcw className="w-4 h-4" />
                    <span>Retour 30j</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Garantie 2 ans</span>
                  </div>
                </div>
              </div>

              {/* Onglets de contenu */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {[
                    { key: 'description', label: 'Description', icon: Info },
                    { key: 'specifications', label: 'Caractéristiques', icon: CheckCircle },
                    { key: 'reviews', label: 'Avis (127)', icon: MessageCircle },
                    { key: 'shipping', label: 'Livraison', icon: Truck },
                  ].map(({ key, label, icon: Icon }) => (
                    <motion.button
                      key={key}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      onClick={() => setActiveTab(key as 'description' | 'specifications' | 'reviews' | 'shipping')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        activeTab === key
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'description' && (
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                      )}
                      
                      {activeTab === 'specifications' && (
                        <div className="space-y-3">
                          {/* Vérifier s'il y a des spécifications à afficher */}
                          {!product.sku && !product.weight && !product.dimensions && !product.category_id && !product.brand_id && !product.tags?.length ? (
                            <div className="text-center py-8 text-gray-500">
                              <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>Aucune caractéristique technique disponible</p>
                            </div>
                          ) : (
                            <>
                              {product.sku && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Référence</span>
                              <span className="font-medium">{product.sku}</span>
                            </div>
                          )}
                          {product.weight && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Poids</span>
                              <span className="font-medium">{product.weight} kg</span>
                            </div>
                          )}
                          {product.dimensions && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Dimensions</span>
                              <span className="font-medium">{product.dimensions}</span>
                            </div>
                          )}
                          {product.category_id && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Catégorie</span>
                              <span className="font-medium">{getCategoryName(product.category_id)}</span>
                            </div>
                          )}
                          {product.brand_id && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Marque</span>
                              <span className="font-medium">{getBrandName(product.brand_id)}</span>
                            </div>
                          )}
                          {product.status && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Statut</span>
                              <span className={`font-medium capitalize ${
                                product.status === 'active' ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {product.status === 'active' ? 'Disponible' : product.status}
                              </span>
                            </div>
                          )}
                          {typeof product.inventory_quantity === 'number' && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Stock</span>
                              <span className={`font-medium ${
                                product.inventory_quantity > 10 ? 'text-green-600' : 
                                product.inventory_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {product.inventory_quantity > 0 ? `${product.inventory_quantity} unités` : 'Rupture de stock'}
                              </span>
                            </div>
                          )}
                          {product.tags && product.tags.length > 0 && (
                            <div className="py-2 border-b border-gray-100">
                              <span className="text-gray-600 block mb-2">Tags</span>
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.requires_shipping !== undefined && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Livraison requise</span>
                              <span className="font-medium">
                                {product.requires_shipping ? 'Oui' : 'Non'}
                              </span>
                            </div>
                          )}
                          {product.taxable !== undefined && (
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-600">Taxable</span>
                              <span className="font-medium">
                                {product.taxable ? 'Oui' : 'Non'}
                              </span>
                            </div>
                          )}
                            </>
                          )}
                        </div>
                      )}
                      
                      {activeTab === 'reviews' && (
                        <div className="space-y-4">
                          <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Les avis clients seront bientôt disponibles</p>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'shipping' && (
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <Truck className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">Livraison gratuite</h4>
                              <p className="text-sm text-gray-600">Livraison standard en 3-5 jours ouvrés</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">Livraison express</h4>
                              <p className="text-sm text-gray-600">Livraison en 24h pour 4,99€</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Statistiques et Actions - Nouvelle section */}
              <div className="space-y-6">
                {/* Statistiques - uniquement pour le propriétaire */}
                {isOwner && (
                  <StatsPanel
                    product={{
                      id: product.id,
                      name: product.name,
                      likes_count: product.likes_count || 0,
                    }}
                    isLiked={isLiked}
                  />
                )}

                {/* Informations publiques pour les visiteurs */}
                {!isOwner && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Informations produit</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Popularité</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-medium">{product.likes_count || 0} likes</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Vues</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{product.views_count || 0}</span>
                        </div>
                      </div>
                      {product.rating_average && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Note moyenne</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{product.rating_average.toFixed(1)}/5</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ajouté le</span>
                        <span className="font-medium">
                          {new Date(product.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions supplémentaires */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isOwner ? 'Gestion' : 'Actions'}
                  </h3>
                  <div className="space-y-2">
                    {isOwner ? (
                      // Actions pour le propriétaire
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => window.location.href = `/edit-product/${product.id}`}
                        >
                          <SquarePen className="w-4 h-4" />
                          <span>Modifier le produit</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>Promouvoir</span>
                        </motion.button>
                      </>
                    ) : (
                      // Actions pour les visiteurs
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onReport}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Flag className="w-4 h-4" />
                          <span>Signaler ce produit</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Garantie produit</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
            <div className="grid grid-cols-5 gap-6">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Vidéo */}
      <AnimatePresence>
        {showVideo && product.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton fermer */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Vidéo */}
              <video
                src={product.video_url}
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={product.image_url}
                onError={(e) => {
                  console.error('Erreur de lecture vidéo:', e);
                  setShowVideo(false);
                }}
              >
                <p className="text-white text-center p-4">
                  Votre navigateur ne supporte pas la lecture vidéo.
                </p>
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
