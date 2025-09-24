import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronUp, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { ActionButtons } from './ActionButtons';
import { ActionsMenu } from './ActionsMenu';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { InfoPanel } from './InfoPanel';
import { EmptyState } from './EmptyState';
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
import { Product as ProductFromSupabase, ProductVariant as ProductVariantFromSupabase } from '../../lib/supabase';

interface VideoFeedProduct extends ProductFromProducts {
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  variants?: ProductVariant[];
}

interface DesktopVideoFeedProps {
  products: VideoFeedProduct[];
  onProductDeleted?: () => void;
}


export const DesktopVideoFeed: React.FC<DesktopVideoFeedProps> = ({ products, onProductDeleted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(false);

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

  const currentProduct = useMemo(() => 
    products[currentIndex], 
    [products, currentIndex]
  );

  // Handlers pour la navigation
  const handleProductSelect = useCallback((index: number) => {
    pauseAllVideos();
    setCurrentIndex(index);
    if (products[index]?.video_url) {
      setTimeout(() => {
        playVideo(products[index].id);
      }, 100);
    }
    recordView(products[index].id);
  }, [products, pauseAllVideos, playVideo, recordView]);

  const goToNextProduct = useCallback(() => {
    if (currentIndex < products.length - 1) {
      handleProductSelect(currentIndex + 1);
    }
  }, [currentIndex, products.length, handleProductSelect]);

  const goToPreviousProduct = useCallback(() => {
    if (currentIndex > 0) {
      handleProductSelect(currentIndex - 1);
    }
  }, [currentIndex, handleProductSelect]);

  // Gestion du scroll pour changer de produit
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // Scroll vers le bas = produit suivant
      goToNextProduct();
    } else {
      // Scroll vers le haut = produit précédent
      goToPreviousProduct();
    }
  }, [goToNextProduct, goToPreviousProduct]);

  // Gestion des événements de scroll et clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPreviousProduct();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextProduct();
      }
    };

    // Ajouter les événements
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Nettoyer les événements
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, goToNextProduct, goToPreviousProduct]);

  const handleBuyNow = useCallback((product: VideoFeedProduct) => {
    const productForCart: ProductFromSupabase = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      video_url: product.video_url,
      image_url: product.image_url,
      images: product.images,
      variants: (product.variants || []) as ProductVariantFromSupabase[],
      seller_id: product.seller_id,
      user: {
        id: product.seller_id,
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
      // Rafraîchir la liste des produits
      onProductDeleted?.();
    }
  }, [user, closeAllModals, onProductDeleted]);

  const handleDisableProduct = useCallback(async (productId: string) => {
    if (!user) return;
    const success = await productService.disableProduct(productId, user.id);
    if (success) {
      closeAllModals();
      // Rafraîchir la liste des produits
      onProductDeleted?.();
    }
  }, [user, closeAllModals, onProductDeleted]);

  const handleReport = useCallback(() => {
    if (currentProduct) {
      productService.reportProduct(currentProduct.id);
    }
  }, [currentProduct]);


  if (!products.length) {
    return <EmptyState />;
  }

  return (
    <div className="h-screen flex bg-surface-50 font-inter">

      {/* Zone principale - Vidéo/Produit */}
      <div className="flex-1 relative bg-white">
        {currentProduct && (
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed top-16 left-0 bottom-0 bg-white flex items-center justify-center transition-all duration-300 ${
              isInfoPanelCollapsed ? 'right-0' : 'right-96'
            }`}
          >
             {/* Zone vidéo/image - Centrée avec fond blanc */}
             <div className="relative w-full h-full flex items-center justify-center bg-white">
              <VideoPlayer
                videoUrl={currentProduct.video_url}
                imageUrl={currentProduct.image_url}
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

                {/* Bouton de repliement du panneau d'infos */}
                <button
                  onClick={() => setIsInfoPanelCollapsed(!isInfoPanelCollapsed)}
                  className="absolute top-18 right-18 w-12 h-12 bg-glass-white hover:bg-glass-white-strong backdrop-blur-md rounded-xl shadow-large border border-surface-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow z-20"
                >
                  {isInfoPanelCollapsed ? (
                    <ChevronLeft className="w-5 h-5 text-surface-700" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-surface-700" />
                  )}
                </button>

                {/* Boutons d'action flottants */}
                <div className={`absolute top-18 flex flex-col space-y-4 transition-all duration-300 ${
                  isInfoPanelCollapsed ? 'right-18' : 'right-32'
                }`}>
                <ActionButtons
                  productId={currentProduct.id}
                  userId={currentProduct.seller_id}
                  username={currentProduct.user.username}
                  avatarUrl={currentProduct.user.avatar_url}
                  likesCount={currentProduct.likes_count}
                  isLiked={isLiked(currentProduct.id)}
                  onToggleLike={() => toggleLike(currentProduct.id)}
                  onShowActionsMenu={() => setShowActionsMenu(true)}
                  onNavigateToProfile={() => navigate('/profile')}
                />
              </div>

                {/* Boutons de navigation */}
                <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col space-y-2 transition-all duration-300 ${
                  isInfoPanelCollapsed ? 'right-18' : 'right-32'
                }`}>
                  {currentIndex > 0 && (
                    <button
                      onClick={goToPreviousProduct}
                      className="w-10 h-10 bg-glass-white hover:bg-glass-white-strong backdrop-blur-md rounded-xl shadow border border-surface-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    >
                      <ChevronUp className="w-5 h-5 text-surface-700" />
                    </button>
                  )}
                  {currentIndex < products.length - 1 && (
                    <button
                      onClick={goToNextProduct}
                      className="w-10 h-10 bg-glass-white hover:bg-glass-white-strong backdrop-blur-md rounded-xl shadow border border-surface-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    >
                      <ChevronDown className="w-5 h-5 text-surface-700" />
                    </button>
                  )}
                </div>

                {/* Statistiques de likes sur la vidéo/image */}
                <div className="absolute bottom-18 left-18 bg-glass-white backdrop-blur-md rounded-2xl px-3 py-2 shadow-large border border-surface-200 flex items-center space-x-2 transition-all duration-300">
                  <Heart className={`w-5 h-5 ${isLiked(currentProduct.id) ? 'text-red-500 fill-current' : 'text-surface-600'}`} />
                  <span className="text-white font-bold text-base">{currentProduct.likes_count}</span>
                </div>

                {/* Indicateur de navigation */}
                <div className={`absolute bottom-18 bg-glass-white backdrop-blur-md rounded-xl px-3 py-2 shadow-large border border-surface-200 transition-all duration-300 ${
                  isInfoPanelCollapsed ? 'right-18' : 'right-32'
                }`}>
                  <span className="text-white text-xs font-inter">
                    {currentIndex + 1} / {products.length}
                  </span>
                </div>
             </div>

          </motion.div>
        )}
            </div>

      {/* Panneau d'informations à droite - Fixed */}
      {currentProduct && (
        <motion.div 
          initial={false}
          animate={{ 
            x: isInfoPanelCollapsed ? 384 : 0,
            opacity: isInfoPanelCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] bg-surface-50 border-l border-surface-200 flex flex-col overflow-hidden z-10"
        >
              {/* Informations produit */}
          <div className="p-6 border-b border-surface-200">
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar 
                    avatarUrl={currentProduct.user.avatar_url}
                    username={currentProduct.user.username}
                    size="lg"
                    className="w-10 h-10"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-medium text-surface-900 text-sm">@{currentProduct.user.username}</h3>
                    <button
                      onClick={() => toggleFollow(currentProduct.seller_id)}
                      className={`text-xs px-2 py-1 rounded-lg transition-all font-inter ${
                        isFollowing(currentProduct.seller_id)
                          ? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                          : 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft'
                      }`}
                    >
                      {isFollowing(currentProduct.seller_id) ? 'Suivi' : 'Suivre'}
                    </button>
                  </div>
                </div>

                <h2 className="text-base font-display font-semibold text-surface-900 mb-3">{currentProduct.name}</h2>
                <p className="text-surface-600 text-sm mb-4 leading-relaxed font-inter">
                  {currentProduct.description.length > 150 
                    ? `${currentProduct.description.substring(0, 150)}...` 
                    : currentProduct.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-display font-bold text-primary-600">€{currentProduct.price}</span>
                  <div className="flex items-center space-x-3 text-xs text-surface-500 font-inter">
                    <span>{currentProduct.likes_count} likes</span>
                  </div>
                </div>

                {/* Boutons d'action compacts */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleLike(currentProduct.id)}
                      className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${
                        isLiked(currentProduct.id)
                          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                          : 'bg-surface-100 text-surface-600 border border-surface-200 hover:bg-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked(currentProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => setShowComments(true)}
                      className="w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center bg-surface-100 text-surface-600 border border-surface-200 hover:bg-surface-200 hover:border-surface-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setShowShare(true)}
                      className="w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center bg-surface-100 text-surface-600 border border-surface-200 hover:bg-surface-200 hover:border-surface-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => setShowActionsMenu(true)}
                      className="w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center bg-surface-100 text-surface-600 border border-surface-200 hover:bg-surface-200 hover:border-surface-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBuyNow(currentProduct)}
                    className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-display font-medium hover:bg-primary-600 transition-all duration-300 shadow-soft hover:shadow-medium text-sm"
                  >
                    Acheter maintenant
                  </button>
                  <button
                    onClick={() => navigate(`/product/${currentProduct.id}`)}
                    className="px-3 py-2.5 border border-surface-200 text-surface-600 rounded-xl hover:bg-surface-50 hover:border-surface-300 transition-all duration-300 font-inter text-sm"
                  >
                    Voir détails
                  </button>
                </div>
              </div>

              {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                {/* Espace supplémentaire pour le scroll */}
            <div className="h-32"></div>
              </div>
            </motion.div>
        )}

      {/* Modales */}
      <ActionsMenu
        isOpen={showActionsMenu}
        productId={currentProduct?.id || ''}
        userId={currentProduct?.seller_id || ''}
        currentUserId={user?.id}
        isBookmarked={currentProduct ? isBookmarked(currentProduct.id) : false}
        isFollowing={currentProduct ? isFollowing(currentProduct.seller_id) : false}
        onClose={() => setShowActionsMenu(false)}
        onShowComments={() => setShowComments(true)}
        onShowShare={() => setShowShare(true)}
        onToggleBookmark={() => currentProduct && toggleBookmark(currentProduct.id)}
        onToggleFollow={() => currentProduct && toggleFollow(currentProduct.seller_id)}
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
