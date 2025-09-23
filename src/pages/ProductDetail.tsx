import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Clock, 
  Package, 
  Scale, 
  Tag, 
  Eye, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  CreditCard,
  RefreshCw,
  Award,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { ProductService } from '../lib/products';
import { getCategoryName, getBrandName } from '../lib/categories';
import toast from 'react-hot-toast';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showFullDescription, setShowFullDescription] = useState(false);

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
            user_id: dbProduct.seller_id,
            user: {
              id: dbProduct.seller_id,
              email: 'user@example.com',
              username: 'user',
              loyalty_points: 0,
              created_at: dbProduct.created_at,
            },
            created_at: dbProduct.created_at,
            // Ajouter toutes les nouvelles propriétés
            sku: dbProduct.sku,
            compare_price: dbProduct.compare_price,
            cost_price: dbProduct.cost_price,
            weight: dbProduct.weight,
            dimensions: dbProduct.dimensions,
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
            user_id: '1',
            user: {
              id: '1',
              email: 'user@example.com',
              username: 'techguru',
              loyalty_points: 500,
              created_at: '2024-01-01',
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
          user_id: p.seller_id,
          user: {
            id: p.seller_id,
            email: 'user@example.com',
            username: 'user',
            loyalty_points: 0,
            created_at: p.created_at,
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
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-24">
        {/* Image Gallery */}
        <div className="space-y-4 mb-6">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    {product.sku && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Réf: {product.sku}</span>
                    )}
                    {product.category_id && (
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {getCategoryName(product.category_id) || 'Catégorie'}
                      </span>
                    )}
                    {product.brand_id && (
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        {getBrandName(product.brand_id) || 'Marque'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-purple-600">€{product.price}</span>
                    {product.taxable && (
                      <span className="text-xs text-gray-500">TTC</span>
                    )}
                  </div>
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500 line-through">€{product.compare_price}</p>
                      <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
                        -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>par @{product.user.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating_average || 4.8} ({product.rating_count || 324} avis)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>{product.sales_count || 0} ventes</span>
                </div>
              </div>
              
              {product.short_description && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4 border border-purple-100">
                  <p className="text-gray-700 text-sm leading-relaxed">{product.short_description}</p>
                </div>
              )}

              {/* Product Stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-100">
                  <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-red-600">{product.likes_count || 0}</div>
                  <div className="text-xs text-gray-600">J'aime</div>
                </div>
                <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                  <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600">{product.views_count || 0}</div>
                  <div className="text-xs text-gray-600">Vues</div>
                </div>
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                  <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-600">{product.sales_count || 0}</div>
                  <div className="text-xs text-gray-600">Ventes</div>
                </div>
                <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-100">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-yellow-600">{product.rating_average || 4.8}</div>
                  <div className="text-xs text-gray-600">Note</div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inventory_tracking ? (
                  <div className="flex items-center space-x-2">
                    {product.inventory_quantity > 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">
                          En stock ({product.inventory_quantity} disponibles)
                        </span>
                      </>
                    ) : product.allow_backorder ? (
                      <>
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-700 font-medium">
                          Rupture de stock - Commandes en attente acceptées
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 font-medium">
                          Rupture de stock
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-700 font-medium">
                      Stock non suivi
                    </span>
                  </div>
                )}
              </div>
            </div>

          {/* Variants */}
          {product.variants.map((variant) => (
            <div key={variant.id} className="space-y-3">
              <h3 className="font-semibold text-gray-900">{variant.name}</h3>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedVariants[variant.name] === option
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">You might also like</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <ProductCard key={suggestion.id} product={suggestion} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <div className="flex space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}