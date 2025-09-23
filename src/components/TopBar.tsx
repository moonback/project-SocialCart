import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Bell, Menu, X, Settings, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { HeaderUserAvatar, UserAvatar } from './UserAvatar';

export function TopBar() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu profil quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 surface-glass mobile-header"
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-display text-xl text-gradient">
              SocialCart
            </span>
            <p className="text-xs text-surface-500 -mt-1">Shopping social</p>
          </div>
        </motion.div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                name="search"
                type="text"
                placeholder="Rechercher des produits..."
                className="input pl-12 pr-4 py-3 w-full"
                onFocus={() => navigate('/search')}
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden btn-floating"
          >
            <Search className="w-5 h-5 text-surface-600" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="btn-floating relative"
          >
            <Bell className="w-5 h-5 text-surface-600" />
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
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
            <ShoppingCart className="w-5 h-5 text-surface-600" />
            {itemCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.div>
            )}
          </motion.button>

          {/* Profile */}
          <div className="relative" ref={profileMenuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors"
            >
              <HeaderUserAvatar 
                avatarUrl={user?.avatar_url} 
                username={user?.username} 
                size="md"
                className="w-full h-full"
              />
            </motion.button>

            {/* Profile Menu Dropdown */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-large border border-surface-200 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-surface-100">
                    <div className="flex items-center space-x-3">
                      <UserAvatar 
                        avatarUrl={user?.avatar_url} 
                        username={user?.username} 
                        size="lg"
                        className="rounded-xl"
                      />
                      <div>
                        <p className="font-semibold text-surface-900">{user?.username}</p>
                        <p className="text-sm text-surface-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-surface-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-surface-600" />
                      <span className="text-surface-900">Profil</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                      onClick={() => {
                        navigate('/settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-surface-50 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-surface-600" />
                      <span className="text-surface-900">Paramètres</span>
                    </motion.button>
                    
                    <div className="border-t border-surface-100 my-2" />
                    
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-red-600">Se déconnecter</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="input pl-12 pr-4 py-3 w-full"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}