import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { HeaderUserAvatar } from './UserAvatar';
import { ProfileModal } from './ProfileModal';

export function TopBar() {
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
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-glass mobile-header"
    >
      <div className="flex items-center justify-between px-4 py-2 md:py-3">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-glow border border-white/30 backdrop-blur-sm">
            <span className="text-white font-bold text-sm md:text-base">SC</span>
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
                className="input-glass pl-10 pr-4 py-2 w-full text-sm"
                onFocus={() => navigate('/search')}
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Mobile Search */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden btn-floating"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-surface-600" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="btn-floating relative"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-surface-600" />
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
            className="btn-floating relative"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-surface-600" />
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
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors"
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
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-md hover:shadow-lg"
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
                  className="input pl-10 pr-4 py-2.5 w-full text-sm"
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