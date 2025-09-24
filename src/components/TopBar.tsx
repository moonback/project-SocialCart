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
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-3xl border-b border-primary-200/30 shadow-glass-blue mobile-header"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary-200/40 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
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
                className="pl-10 pr-4 py-2 w-full text-sm border border-primary-200/30 rounded-xl backdrop-blur-md"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(59, 130, 246, 0.1)'
                }}
                onFocus={() => navigate('/search')}
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Bouton Stories amélioré */}
          <motion.button
            whileHover={{ scale: 1.13, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleStories}
            className={`relative w-11 h-11 rounded-2xl border-2 border-primary-400/60 shadow-lg bg-gradient-to-br ${
              isStoriesOpen
                ? 'from-primary-100/80 to-primary-300/60 text-primary-700'
                : 'from-primary-50/20 to-primary-100/5 text-primary-600 hover:from-primary-100/60 hover:to-primary-200/20'
            } transition-all duration-300 flex items-center justify-center`}
            style={{
              boxShadow: '0 6px 24px 0 rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.18) inset'
            }}
          >
            <Camera className="w-5 h-5 md:w-6 md:h-6 drop-shadow" />
            {isStoriesOpen && (
              <motion.div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>

          {/* Recherche Mobile améliorée */}
          <motion.button
            whileHover={{ scale: 1.13, rotate: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden w-11 h-11 rounded-2xl border-2 border-primary-300/40 shadow-lg bg-gradient-to-br from-primary-50/20 to-primary-100/10 text-primary-700 hover:from-primary-100/40 hover:to-primary-200/20 transition-all duration-300 flex items-center justify-center"
            style={{
              boxShadow: '0 6px 24px 0 rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.18) inset'
            }}
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          {/* Notifications améliorées */}
          <motion.button
            whileHover={{ scale: 1.13, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/notifications')}
            className="relative w-11 h-11 rounded-2xl border-2 border-primary-300/40 shadow-lg bg-gradient-to-br from-primary-50/20 to-primary-100/10 text-primary-700 hover:from-primary-100/40 hover:to-primary-200/20 transition-all duration-300 flex items-center justify-center"
            style={{
              boxShadow: '0 6px 24px 0 rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.18) inset'
            }}
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
            <motion.div 
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-gradient-to-br from-red-500 via-pink-500 to-yellow-400 border-2 border-white rounded-full shadow-lg"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>

          {/* Panier amélioré */}
          <motion.button
            whileHover={{ scale: 1.13, rotate: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/cart')}
            className="relative w-11 h-11 rounded-2xl border-2 border-primary-300/40 shadow-lg bg-gradient-to-br from-primary-50/20 to-primary-100/10 text-primary-700 hover:from-primary-100/40 hover:to-primary-200/20 transition-all duration-300 flex items-center justify-center"
            style={{
              boxShadow: '0 6px 24px 0 rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.18) inset'
            }}
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {itemCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow border-2 border-white"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.div>
            )}
          </motion.button>

          {/* Profil amélioré */}
          {user ? (
            <motion.button
              whileHover={{ scale: 1.13 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsProfileMenuOpen(true)}
              className="w-10 h-10 md:w-11 md:h-11 rounded-2xl overflow-hidden border-2 border-primary-200/60 shadow-lg bg-gradient-to-br from-primary-100/30 to-primary-200/20 transition-all duration-300 flex items-center justify-center"
              style={{
                boxShadow: '0 6px 24px 0 rgba(59,130,246,0.15), 0 1.5px 0 rgba(255,255,255,0.18) inset'
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/auth')}
              className="px-4 py-2 md:px-5 md:py-2.5 rounded-xl border-2 border-primary-400/60 shadow-lg bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-semibold text-sm transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.92) 0%, rgba(37,99,235,0.92) 100%)',
                boxShadow: '0 6px 24px 0 rgba(59,130,246,0.18), 0 1.5px 0 rgba(255,255,255,0.18) inset'
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
                  className="pl-10 pr-4 py-2.5 w-full text-sm border border-primary-200/30 rounded-xl backdrop-blur-md"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(59, 130, 246, 0.1)'
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