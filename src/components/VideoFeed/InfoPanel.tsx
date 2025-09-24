import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Maximize } from 'lucide-react';

interface InfoPanelProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    likes_count?: number;
    views_count?: number;
    sales_count?: number;
    sku?: string;
    weight?: number;
    status: string;
  };
  onClose: () => void;
  onReport: () => void;
  onToggleFullscreen: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  isOpen,
  product,
  onClose,
  onReport,
  onToggleFullscreen,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Informations produit</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {/* Product Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/10 rounded-xl p-3">
                  <div className="text-white font-bold text-lg">{product.likes_count || 0}</div>
                  <div className="text-white/70 text-sm">Likes</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3">
                  <div className="text-white font-bold text-lg">{product.views_count || 0}</div>
                  <div className="text-white/70 text-sm">Vues</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3">
                  <div className="text-white font-bold text-lg">{product.sales_count || 0}</div>
                  <div className="text-white/70 text-sm">Ventes</div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Prix:</span>
                  <span className="text-white font-bold">€{product.price}</span>
                </div>
                {product.sku && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Référence:</span>
                    <span className="text-white font-bold">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Poids:</span>
                    <span className="text-white font-bold">{product.weight} kg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/70">Statut:</span>
                  <span className="text-white font-bold capitalize">{product.status}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onReport}
                  className="flex-1 bg-red-500/20 text-red-300 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Signaler</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggleFullscreen}
                  className="flex-1 bg-white/20 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <Maximize className="w-4 h-4" />
                  <span>Plein écran</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
