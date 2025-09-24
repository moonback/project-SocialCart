import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';
import { Product as ProductFromProducts, ProductVariant } from '../lib/products';
import { Product as ProductFromSupabase, ProductVariant as ProductVariantFromSupabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useSocial } from '../hooks/useSocial';
import { useAuth } from '../hooks/useAuth';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { useVideoFeedModals } from '../hooks/useVideoFeedModals';
import { useVideoFeedScroll } from '../hooks/useVideoFeedScroll';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { VideoPlayer } from './VideoFeed/VideoPlayer';
import { ActionButtons } from './VideoFeed/ActionButtons';
import { ProductInfo } from './VideoFeed/ProductInfo';
import { ActionsMenu } from './VideoFeed/ActionsMenu';
import { DeleteConfirmModal } from './VideoFeed/DeleteConfirmModal';
import { InfoPanel } from './VideoFeed/InfoPanel';
import { EmptyState } from './VideoFeed/EmptyState';

interface VideoFeedProduct extends ProductFromProducts {
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  variants?: ProductVariant[];
}

interface VideoFeedProps {
  products: VideoFeedProduct[];
}

export function VideoFeed({ products }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hooks personnalisés
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
  
  // Hook pour la gestion vidéo
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
  
  // Hook pour la gestion des modales
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
  
  // Hook pour la gestion du scroll
  const { handleScroll, cleanup } = useVideoFeedScroll({
    onIndexChange: setCurrentIndex,
  });

  // Variable mémorisée pour le produit actuel
  const currentProduct = useMemo(() => products[currentIndex], [products, currentIndex]);

  // Fermer le menu d'actions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionsMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.actions-menu-container')) {
          setShowActionsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu, setShowActionsMenu]);

  // Fonction mémorisée pour enregistrer une vue
  const handleRecordView = useCallback((productId: string) => {
    recordView(productId);
  }, [recordView]);

  // Logique de lecture centralisée - s'exécute à chaque changement de currentIndex
  useEffect(() => {
    if (!currentProduct) return;

    // Enregistrer une vue (dans un setTimeout pour éviter les setState pendant le rendu)
    setTimeout(() => {
      handleRecordView(currentProduct.id);
    }, 0);

    // Mettre en pause toutes les vidéos et lancer la lecture de la vidéo actuelle
    pauseAllVideos();
    if (currentProduct.video_url) {
      playVideo(currentProduct.id);
    }
  }, [currentIndex, currentProduct, handleRecordView, pauseAllVideos, playVideo]);

  // Handlers mémorisés
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

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

  // Gestion du scroll
  const onScroll = useCallback(() => {
    handleScroll(containerRef);
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll);
      return () => {
        container.removeEventListener('scroll', onScroll);
        cleanup();
      };
    }
  }, [onScroll, cleanup]);

  if (!products.length) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide video-feed"
    >
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          className="h-screen snap-start relative flex items-center justify-center bg-black group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={() => setShowControls(true)}
          onTouchEnd={() => {
            setTimeout(() => {
              setShowControls(false);
            }, 3000);
          }}
        >
          {/* Video Player Component */}
          <VideoPlayer
            videoUrl={product.video_url}
            imageUrl={product.image_url}
            productId={product.id}
            productName={product.name}
            isPlaying={isPlaying}
            isMuted={isMuted}
            autoPlay={autoPlay}
            playbackSpeed={playbackSpeed}
            showControls={showControls}
            isCurrentVideo={index === currentIndex}
            videoRef={(el) => (videoRefs.current[product.id] = el)}
            onPlay={() => {}} // Géré par le hook
            onPause={() => {}} // Géré par le hook
            onTogglePlayPause={() => togglePlayPause(product.id)}
            onToggleMute={() => toggleMute(product.id)}
            onChangePlaybackSpeed={changePlaybackSpeed}
            onTouchStart={() => setShowControls(true)}
            onTouchEnd={() => {
              setTimeout(() => {
                setShowControls(false);
              }, 3000);
            }}
          />

          {/* Action Buttons Component */}
          <ActionButtons
            productId={product.id}
            userId={product.seller_id}
            username={product.user.username}
            avatarUrl={product.user.avatar_url}
            likesCount={product.likes_count}
            isLiked={isLiked(product.id)}
            onToggleLike={() => toggleLike(product.id)}
            onShowActionsMenu={() => setShowActionsMenu(true)}
            onNavigateToProfile={() => navigate('/profile')}
          />

          {/* Product Info Component */}
          <ProductInfo
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            productDescription={product.description}
            userId={product.seller_id}
            username={product.user.username}
            avatarUrl={product.user.avatar_url}
            isFollowing={isFollowing(product.seller_id)}
            onToggleFollow={() => toggleFollow(product.seller_id)}
            onViewProduct={() => navigate(`/product/${product.id}`)}
            onBuyNow={() => handleBuyNow(product)}
          />

          {/* Info Panel Component */}
          <InfoPanel
            isOpen={showInfo && index === currentIndex}
            product={product}
            onClose={() => setShowInfo(false)}
            onReport={handleReport}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </motion.div>
      ))}

      {/* Actions Menu Component */}
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

      {/* Delete Confirmation Modal Component */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        productId={productToDelete}
        onClose={() => closeAllModals()}
        onDeleteProduct={handleDeleteProduct}
        onDisableProduct={handleDisableProduct}
      />

      {/* Comments Modal */}
      <CommentsModal
        productId={currentProduct?.id || ''}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Share Modal */}
      <ShareModal
        product={currentProduct || { id: '', name: '', description: '', price: 0 }}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}
