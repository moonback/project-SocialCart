import React from 'react';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Search, label: 'Rechercher', path: '/search' },
    { icon: Plus, label: 'Créer', path: '/create', special: true },
    { icon: Bell, label: 'Alertes', path: '/notifications' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 mobile-safe-area"
    >
      <div className="bg-white/90 backdrop-blur-lg border-t border-surface-200 shadow-large">
        <div className="flex relative">
          {tabs.map(({ icon: Icon, label, path, special }) => {
            const isActive = location.pathname === path;
            
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                className={`flex-1 py-3 px-2 flex flex-col items-center space-y-1 transition-all duration-300 relative ${
                  isActive 
                    ? 'text-primary-600' 
                    : 'text-surface-400 hover:text-surface-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon container */}
                <div className={`relative ${special && !isActive ? 'mb-1' : ''}`}>
                  {special && !isActive ? (
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-primary-600' : 'text-surface-400'}`} />
                    </motion.div>
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs font-medium transition-all duration-300 ${
                  special && !isActive ? 'text-white' : ''
                }`}>
                  {label}
                </span>

                {/* Notification dot for Bell */}
                {path === '/notifications' && (
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}