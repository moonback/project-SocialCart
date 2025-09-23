import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle, 
  Mail,
  Link,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocial } from '../hooks/useSocial';
import toast from 'react-hot-toast';

interface ShareModalProps {
  product: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    price: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const shareOptions = [
  {
    id: 'copy_link',
    name: 'Copier le lien',
    icon: Copy,
    color: 'bg-gray-500',
    action: 'copy'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    action: 'social'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-400',
    action: 'social'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    action: 'social'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500',
    action: 'social'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'bg-red-500',
    action: 'email'
  }
];

export function ShareModal({ product, isOpen, onClose }: ShareModalProps) {
  const { shareProduct } = useSocial();
  const [isSharing, setIsSharing] = useState(false);

  const productUrl = `${window.location.origin}/product/${product.id}`;
  const shareText = `Découvrez ce produit : ${product.name} - €${product.price}`;
  const shareTitle = `${product.name} - Shopping Connect`;

  const handleShare = async (option: typeof shareOptions[0]) => {
    setIsSharing(true);

    try {
      switch (option.action) {
        case 'copy':
          await navigator.clipboard.writeText(productUrl);
          await shareProduct(product.id, 'copy_link');
          toast.success('Lien copié ! 📋');
          break;

        case 'social':
          const socialUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
            instagram: `https://www.instagram.com/`, // Instagram ne permet pas le partage direct
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`
          };

          const url = socialUrls[option.id as keyof typeof socialUrls];
          if (url) {
            window.open(url, '_blank', 'width=600,height=400');
            await shareProduct(product.id, option.id);
            toast.success(`Partagé sur ${option.name} ! 📤`);
          } else {
            toast.error(`${option.name} n'est pas disponible pour le partage direct`);
          }
          break;

        case 'email':
          const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`;
          window.location.href = emailUrl;
          await shareProduct(product.id, 'email');
          toast.success('Email ouvert ! 📧');
          break;

        default:
          // Partage natif
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: productUrl
            });
            await shareProduct(product.id, 'native_share');
            toast.success('Partagé ! 📤');
          } else {
            await navigator.clipboard.writeText(productUrl);
            await shareProduct(product.id, 'copy_link');
            toast.success('Lien copié ! 📋');
          }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Erreur lors du partage');
    } finally {
      setIsSharing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md max-h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Partager</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Product Preview */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                <p className="text-lg font-bold text-primary-600">€{product.price}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare(option)}
                  disabled={isSharing}
                  className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <option.icon className="w-6 h-6" />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {option.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Native Share Button */}
            {navigator.share && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare({ id: 'native', name: 'Partager', icon: Share2, color: 'bg-primary-500', action: 'native' })}
                disabled={isSharing}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 mt-4"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-semibold">Partager avec l'appareil</span>
              </motion.button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Partagez ce produit avec vos amis et découvrez plus de produits sur Shopping Connect
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
