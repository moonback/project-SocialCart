import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { HeaderUserAvatar } from './UserAvatar';
import { ProfileModal } from './ProfileModal';

interface TopBarProps {
  onToggleStories?: () => void;
  isStoriesOpen?: boolean;
}

export function TopBar({ onToggleStories, isStoriesOpen = false }: TopBarProps) {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };


  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-3xl border-b border-white/30 shadow-2xl mobile-header"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div 
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/40 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
          >
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">SC</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-display text-lg md:text-xl text-gradient">
              SocialCart
            </span>
            <p className="text-xs text-surface-500 -mt-1 hidden md:block">Shopping social</p>
          </div>
        </motion.div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                name="search"
                type="text"
                placeholder="Rechercher des produits..."
                className="pl-10 pr-4 py-2 w-full text-sm border border-white/30 rounded-xl backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={() => navigate('/search')}
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Stories Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleStories}
            className={`relative w-10 h-10 rounded-xl border border-white/30 backdrop-blur-md transition-all duration-300 ${
              isStoriesOpen ? 'bg-primary-500/20 text-primary-600' : 'bg-white/10 text-surface-600 hover:bg-white/20'
            }`}
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5" />
            {isStoriesOpen && (
              <motion.div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>

          {/* Mobile Search */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden w-10 h-10 rounded-xl border border-white/30 backdrop-blur-md bg-white/10 text-surface-600 hover:bg-white/20 transition-all duration-300"
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-xl border border-white/30 backdrop-blur-md bg-white/10 text-surface-600 hover:bg-white/20 transition-all duration-300"
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <motion.div 
              className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/cart')}
            className="relative w-10 h-10 rounded-xl border border-white/30 backdrop-blur-md bg-white/10 text-surface-600 hover:bg-white/20 transition-all duration-300"
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            {itemCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.div>
            )}
          </motion.button>

          {/* Profile */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsProfileMenuOpen(true)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl overflow-hidden border border-white/40 backdrop-blur-md transition-all duration-300"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <HeaderUserAvatar 
                avatarUrl={user?.avatar_url} 
                username={user?.username} 
                size="md"
                className="w-full h-full"
              />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-white/40 backdrop-blur-md text-white font-semibold text-sm transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              Se connecter
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20"
          >
            <form onSubmit={handleSearch} className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="pl-10 pr-4 py-2.5 w-full text-sm border border-white/30 rounded-xl backdrop-blur-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileMenuOpen} 
        onClose={() => setIsProfileMenuOpen(false)} 
      />
    </motion.div>
  );
}