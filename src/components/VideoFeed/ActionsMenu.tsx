import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Share, Bookmark, UserPlus, Trash2 } from 'lucide-react';

interface ActionsMenuProps {
  isOpen: boolean;
  productId: string;
  userId: string;
  currentUserId?: string;
  isBookmarked: boolean;
  isFollowing: boolean;
  onClose: () => void;
  onShowComments: () => void;
  onShowShare: () => void;
  onToggleBookmark: () => void;
  onToggleFollow: () => void;
  onOpenDeleteConfirm: () => void;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({
  isOpen,
  productId,
  userId,
  currentUserId,
  isBookmarked,
  isFollowing,
  onClose,
  onShowComments,
  onShowShare,
  onToggleBookmark,
  onToggleFollow,
  onOpenDeleteConfirm,
}) => {
  const isOwner = currentUserId && userId === currentUserId;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4 relative z-[100000] border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              {/* Header */}
              <div className="text-center pb-2">
                <h3 className="text-lg font-bold text-white drop-shadow-lg">Actions</h3>
                <p className="text-sm text-white/80">Que souhaitez-vous faire ?</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Comment Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onShowComments();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                    <MessageCircle className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium">Commentaires</span>
                    <p className="text-sm text-white/70">Voir et ajouter des commentaires</p>
                  </div>
                </motion.button>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onShowShare();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                >
                  <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30">
                    <Share className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium">Partager</span>
                    <p className="text-sm text-white/70">Partager ce produit</p>
                  </div>
                </motion.button>

                {/* Bookmark Button - Different states */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onToggleBookmark();
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 border shadow-lg ${
                    isBookmarked 
                      ? 'bg-blue-500/30 hover:bg-blue-500/40 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                    isBookmarked 
                      ? 'bg-blue-500/30 border-blue-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <Bookmark 
                      className={`w-5 h-5 ${
                        isBookmarked 
                          ? 'text-blue-300 fill-blue-300' 
                          : 'text-white/70'
                      }`} 
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-medium ${
                      isBookmarked ? 'text-blue-200' : 'text-white'
                    }`}>
                      {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </span>
                    <p className={`text-sm ${
                      isBookmarked ? 'text-blue-300/80' : 'text-white/70'
                    }`}>
                      {isBookmarked ? 'Retirer de votre liste' : 'Sauvegarder pour plus tard'}
                    </p>
                  </div>
                </motion.button>

                {/* Follow Button - Different states */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onToggleFollow();
                    onClose();
                  }}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 border shadow-lg ${
                    isFollowing 
                      ? 'bg-blue-500/30 hover:bg-blue-500/40 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                    isFollowing 
                      ? 'bg-blue-500/30 border-blue-400/50' 
                      : 'bg-white/10 border-white/20'
                  }`}>
                    <UserPlus className={`w-5 h-5 ${
                      isFollowing 
                        ? 'text-blue-300' 
                        : 'text-white/70'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-medium ${
                      isFollowing ? 'text-blue-200' : 'text-white'
                    }`}>
                      {isFollowing ? 'Ne plus suivre' : 'Suivre'}
                    </span>
                    <p className={`text-sm ${
                      isFollowing ? 'text-blue-300/80' : 'text-white/70'
                    }`}>
                      {isFollowing ? 'Arrêter de suivre ce vendeur' : 'Suivre ce vendeur'}
                    </p>
                  </div>
                </motion.button>

                {/* Delete Button - Only show if it's the user's own product */}
                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenDeleteConfirm}
                    className="w-full flex items-center space-x-4 px-4 py-3 rounded-2xl bg-red-500/20 backdrop-blur-md hover:bg-red-500/30 transition-all duration-300 border border-red-400/30 shadow-lg"
                  >
                    <div className="w-10 h-10 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/30">
                      <Trash2 className="w-5 h-5 text-red-300" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-red-200 font-medium">Supprimer</span>
                      <p className="text-sm text-red-300/80">Supprimer ce produit</p>
                    </div>
                  </motion.button>
                )}
              </div>

              {/* Close Button */}
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
