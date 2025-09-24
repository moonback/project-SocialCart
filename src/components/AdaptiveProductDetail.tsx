import React from 'react';
import { useScreenSize } from '../hooks/useScreenSize';
import { DesktopProductDetail } from './ProductDetail/DesktopProductDetail';
import { Product } from '../lib/supabase';

interface AdaptiveProductDetailProps {
  product: Product;
  selectedImage: number;
  selectedVariants: Record<string, string>;
  quantity: number;
  relatedProducts: Product[];
  onImageSelect: (index: number) => void;
  onVariantSelect: (type: string, value: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  onReport: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  // Props pour la version mobile (existante)
  mobileContent?: React.ReactNode;
}

export const AdaptiveProductDetail: React.FC<AdaptiveProductDetailProps> = ({
  mobileContent,
  ...props
}) => {
  const { isDesktop } = useScreenSize();

  if (isDesktop) {
    return <DesktopProductDetail {...props} />;
  }

  // Retourne le contenu mobile existant
  return <>{mobileContent}</>;
};
