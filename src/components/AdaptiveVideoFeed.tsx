import React from 'react';
import { VideoFeed } from './VideoFeed';
import { DesktopVideoFeed } from './VideoFeed/DesktopVideoFeed';
import { useScreenSize } from '../hooks/useScreenSize';
import { Product as ProductFromProducts, ProductVariant } from '../lib/products';

interface VideoFeedProduct extends ProductFromProducts {
  image_url: string;
  user: {
    username: string;
    avatar_url?: string;
  };
  variants?: ProductVariant[];
}

interface AdaptiveVideoFeedProps {
  products: VideoFeedProduct[];
  onProductDeleted?: () => void;
}

export const AdaptiveVideoFeed: React.FC<AdaptiveVideoFeedProps> = ({ products, onProductDeleted }) => {
  const { isDesktop } = useScreenSize();

  // Sur desktop (>= 1024px), utiliser le feed desktop avec sidebar pour le choix des produits
  if (isDesktop) {
    return <DesktopVideoFeed products={products} onProductDeleted={onProductDeleted} />;
  }

  // Sur mobile/tablette, utiliser le feed mobile classique
  return <VideoFeed products={products} onProductDeleted={onProductDeleted} />;
};
