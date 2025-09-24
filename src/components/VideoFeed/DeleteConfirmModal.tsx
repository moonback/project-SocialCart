import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Flag } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productId: string | null;
  onClose: () => void;
  onDeleteProduct: (productId: string) => void;
  onDisableProduct: (productId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  productId,
  onClose,
  onDeleteProduct,
  onDisableProduct,
}) => {
  return (
    <AnimatePresence>
      {isOpen && productId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full mx-4 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              {/* Header */}
              <div className="text-center pb-2">
                <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-red-400/30">
                  <Trash2 className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-xl font-bold text-white drop-shadow-lg">Supprimer le produit</h3>
                <p className="text-sm text-white/80 mt-2">
                  Que souhaitez-vous faire avec ce produit ?
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {/* Disable Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDisableProduct(productId)}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-blue-500/20 backdrop-blur-md hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 shadow-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                    <Flag className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-blue-200 font-medium">Désactiver temporairement</span>
                    <p className="text-sm text-blue-300/80">Masquer le produit (récupérable plus tard)</p>
                  </div>
                </motion.button>

                {/* Delete Option */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDeleteProduct(productId)}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 transition-all duration-300 border border-red-400/30 shadow-lg"
                >
                  <div className="w-10 h-10 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/30">
                    <Trash2 className="w-5 h-5 text-red-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-red-200 font-medium">Supprimer définitivement</span>
                    <p className="text-sm text-red-300/80">Suppression irréversible</p>
                  </div>
                </motion.button>
              </div>

              {/* Cancel Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 bg-white/10 backdrop-blur-md text-white/80 rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
