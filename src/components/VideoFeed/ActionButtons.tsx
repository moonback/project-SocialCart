import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MoreVertical } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface ActionButtonsProps {
  productId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  likesCount: number;
  isLiked: boolean;
  onToggleLike: () => void;
  onShowActionsMenu: () => void;
  onNavigateToProfile: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  productId,
  userId,
  username,
  avatarUrl,
  likesCount,
  isLiked,
  onToggleLike,
  onShowActionsMenu,
  onNavigateToProfile,
}) => {
  return (
    <div className="absolute right-1 bottom-48 flex flex-col space-y-1.5 z-30 pb-4 pointer-events-auto actions-menu-container">
      {/* Like Button - Compact */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleLike}
        className="flex flex-col items-center space-y-1 pointer-events-auto z-40"
      >
        <motion.div 
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isLiked 
              ? 'bg-red-500 shadow-lg shadow-red-500/30' 
              : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
          }`}
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isLiked 
                ? 'text-white fill-white' 
                : 'text-white hover:text-red-300'
            }`} 
          />
        </motion.div>
        <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded-full">
          {likesCount + (isLiked ? 1 : 0)}
        </span>
      </motion.button>

      {/* Menu Button - Opens actions menu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onShowActionsMenu}
        className="flex flex-col items-center space-y-1 pointer-events-auto z-40"
      >
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300">
          <MoreVertical className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded-full">
          Plus
        </span>
      </motion.button>

      {/* User Avatar - Compact */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNavigateToProfile}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg"
      >
        <UserAvatar 
          avatarUrl={avatarUrl} 
          username={username} 
          size="xl"
          className="w-full h-full"
        />
      </motion.button>
    </div>
  );
};
