import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Grid, List, Filter, Search, Maximize2 } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { ActionButtons } from './ActionButtons';
import { ProductInfo } from './ProductInfo';
import { ActionsMenu } from './ActionsMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { InfoPanel } from './InfoPanel';
import { EmptyState } from './EmptyState';
import { StatsPanel } from './StatsPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { CommentsModal } from '../CommentsModal';
import { ShareModal } from '../ShareModal';
import { UserAvatar } from '../UserAvatar';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { useVideoFeedModals } from '../../hooks/useVideoFeedModals';
import { useSocial } from '../../hooks/useSocial';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Product as ProductFromProducts, ProductVariant } from '../../lib/products';
import { Product as ProductFromSupabase } from '../../lib/supabase';

interface VideoFeedProduct extends ProductFromProducts {
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  user_id: string;
  variants?: ProductVariant[];
}

interface DesktopVideoFeedProps {
  products: VideoFeedProduct[];
}

type ViewMode = 'grid' | 'list' | 'focus';

export const DesktopVideoFeed: React.FC<DesktopVideoFeedProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hooks
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { 
    toggleLike, 
    toggleBookmark, 
    toggleFollow, 
    recordView,
    isLiked, 
    isBookmarked, 
    isFollowing 
  } = useSocial();
  const navigate = useNavigate();

  const {
    isPlaying,
    isMuted,
    autoPlay,
    playbackSpeed,
    showControls,
    videoRefs,
    togglePlayPause,
    toggleMute,
    changePlaybackSpeed,
    setShowControls,
    playVideo,
    pauseAllVideos,
  } = useVideoPlayer();

  const {
    showInfo,
    showComments,
    showShare,
    showActionsMenu,
    showDeleteConfirm,
    productToDelete,
    setShowInfo,
    setShowComments,
    setShowShare,
    setShowActionsMenu,
    openDeleteConfirm,
    closeAllModals,
  } = useVideoFeedModals();

  // Produits filtrés
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const currentProduct = useMemo(() => 
    filteredProducts[currentIndex], 
    [filteredProducts, currentIndex]
  );

  // Categories disponibles
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Handlers
  const handleProductSelect = useCallback((index: number) => {
    pauseAllVideos();
    setCurrentIndex(index);
    if (filteredProducts[index]?.video_url) {
      setTimeout(() => {
        playVideo(filteredProducts[index].id);
      }, 100);
    }
    recordView(filteredProducts[index].id);
  }, [filteredProducts, pauseAllVideos, playVideo, recordView]);

  const handleRecommendationSelect = useCallback((productId: string) => {
    const index = filteredProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      handleProductSelect(index);
    }
  }, [filteredProducts, handleProductSelect]);

  const handleBuyNow = useCallback((product: VideoFeedProduct) => {
    const productForCart: ProductFromSupabase = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      video_url: product.video_url,
      image_url: product.image_url,
      images: product.images,
      variants: product.variants || [],
      user_id: product.user_id,
      user: {
        id: product.user_id,
        email: '',
        username: product.user.username,
        loyalty_points: 0,
        is_seller: false,
        is_verified: false,
        created_at: '',
        updated_at: '',
        avatar_url: product.user.avatar_url
      },
      likes_count: 0,
      created_at: ''
    };
    addToCart(productForCart);
    navigate('/cart');
  }, [addToCart, navigate]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    if (!user) return;
    const success = await productService.deleteProduct(productId, user.id);
    if (success) {
      closeAllModals();
    }
  }, [user, closeAllModals]);

  const handleDisableProduct = useCallback(async (productId: string) => {
    if (!user) return;
    const success = await productService.disableProduct(productId, user.id);
    if (success) {
      closeAllModals();
    }
  }, [user, closeAllModals]);

  const handleReport = useCallback(() => {
    if (currentProduct) {
      productService.reportProduct(currentProduct.id);
    }
  }, [currentProduct]);

  if (!filteredProducts.length) {
    return <EmptyState />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar gauche - Liste des produits */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header avec recherche et filtres */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Mode de vue */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('focus')}
              className={`p-2 rounded ${viewMode === 'focus' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Catégories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Toutes les catégories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des produits */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-2 p-2">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  onClick={() => handleProductSelect(index)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.video_url && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">{product.name}</p>
                      <p className="text-white/80 text-xs">€{product.price}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  onClick={() => handleProductSelect(index)}
                  className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{product.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-semibold text-blue-600">€{product.price}</span>
                        <div className="flex items-center space-x-1">
                          <UserAvatar 
                            avatarUrl={product.user.avatar_url}
                            username={product.user.username}
                            size="sm"
                            className="w-5 h-5"
                          />
                          <span className="text-xs text-gray-500">@{product.user.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => handleProductSelect(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {filteredProducts.length}
          </span>
          <button
            onClick={() => handleProductSelect(Math.min(filteredProducts.length - 1, currentIndex + 1))}
            disabled={currentIndex === filteredProducts.length - 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Zone principale - Vidéo/Produit */}
      <div className="flex-1 relative bg-black">
        {currentProduct && (
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex"
          >
            {/* Zone vidéo/image */}
            <div className="flex-1 relative">
              <VideoPlayer
                videoUrl={currentProduct.video_url}
                imageUrl={currentProduct.image_url}
                productId={currentProduct.id}
                productName={currentProduct.name}
                isPlaying={isPlaying}
                isMuted={isMuted}
                autoPlay={autoPlay}
                playbackSpeed={playbackSpeed}
                showControls={showControls}
                isCurrentVideo={true}
                videoRef={(el) => (videoRefs.current[currentProduct.id] = el)}
                onPlay={() => {}}
                onPause={() => {}}
                onTogglePlayPause={() => togglePlayPause(currentProduct.id)}
                onToggleMute={() => toggleMute(currentProduct.id)}
                onChangePlaybackSpeed={changePlaybackSpeed}
                onTouchStart={() => setShowControls(true)}
                onTouchEnd={() => {
                  setTimeout(() => setShowControls(false), 3000);
                }}
              />

              {/* Boutons d'action flottants */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <ActionButtons
                  productId={currentProduct.id}
                  userId={currentProduct.user_id}
                  username={currentProduct.user.username}
                  avatarUrl={currentProduct.user.avatar_url}
                  likesCount={currentProduct.likes_count}
                  isLiked={isLiked(currentProduct.id)}
                  onToggleLike={() => toggleLike(currentProduct.id)}
                  onShowActionsMenu={() => setShowActionsMenu(true)}
                  onNavigateToProfile={() => navigate('/profile')}
                />
              </div>
            </div>

            {/* Panneau d'informations à droite */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
              {/* Informations produit */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar 
                    avatarUrl={currentProduct.user.avatar_url}
                    username={currentProduct.user.username}
                    size="lg"
                    className="w-12 h-12"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">@{currentProduct.user.username}</h3>
                    <button
                      onClick={() => toggleFollow(currentProduct.user_id)}
                      className={`text-sm px-3 py-1 rounded-full transition-all ${
                        isFollowing(currentProduct.user_id)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowing(currentProduct.user_id) ? 'Suivi' : 'Suivre'}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentProduct.name}</h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {currentProduct.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">€{currentProduct.price}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{currentProduct.likes_count} likes</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBuyNow(currentProduct)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Acheter maintenant
                  </button>
                  <button
                    onClick={() => navigate(`/product/${currentProduct.id}`)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voir détails
                  </button>
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {/* Statistiques du produit */}
                <div className="p-4 border-b border-gray-200">
                  <StatsPanel
                    product={currentProduct}
                    isLiked={isLiked(currentProduct.id)}
                    viewersCount={Math.floor(Math.random() * 100) + 50} // Simulation de viewers en temps réel
                  />
                </div>

                {/* Recommandations */}
                <div className="p-4 border-b border-gray-200">
                  <RecommendationsPanel
                    currentProduct={currentProduct}
                    allProducts={products}
                    onProductSelect={handleRecommendationSelect}
                  />
                </div>

                {/* Zone de commentaires */}
                <div className="p-4">
                  <button
                    onClick={() => setShowComments(true)}
                    className="w-full p-4 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Voir les commentaires
                  </button>
                </div>

                {/* Espace supplémentaire pour le scroll */}
                <div className="h-20"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modales */}
      <ActionsMenu
        isOpen={showActionsMenu}
        productId={currentProduct?.id || ''}
        userId={currentProduct?.user_id || ''}
        currentUserId={user?.id}
        isBookmarked={currentProduct ? isBookmarked(currentProduct.id) : false}
        isFollowing={currentProduct ? isFollowing(currentProduct.user_id) : false}
        onClose={() => setShowActionsMenu(false)}
        onShowComments={() => setShowComments(true)}
        onShowShare={() => setShowShare(true)}
        onToggleBookmark={() => currentProduct && toggleBookmark(currentProduct.id)}
        onToggleFollow={() => currentProduct && toggleFollow(currentProduct.user_id)}
        onOpenDeleteConfirm={() => currentProduct && openDeleteConfirm(currentProduct.id)}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        productId={productToDelete}
        onClose={() => closeAllModals()}
        onDeleteProduct={handleDeleteProduct}
        onDisableProduct={handleDisableProduct}
      />

      <CommentsModal
        productId={currentProduct?.id || ''}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <ShareModal
        product={currentProduct || { id: '', name: '', description: '', price: 0 }}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      <InfoPanel
        isOpen={showInfo}
        product={currentProduct || { 
          id: '', name: '', price: 0, status: '', 
          likes_count: 0, views_count: 0, sales_count: 0 
        }}
        onClose={() => setShowInfo(false)}
        onReport={handleReport}
        onToggleFullscreen={() => {}}
      />
    </div>
  );
};
