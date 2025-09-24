import { Home, Search, Plus, Bell, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFloatingActions, setShowFloatingActions] = useState(false);

  const tabs = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Search, label: 'Rechercher', path: '/search' },
    { icon: Plus, label: 'Créer', path: '/create', special: true },
    { icon: Bell, label: 'Alertes', path: '/notifications' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <>
      {/* Navigation mobile - visible uniquement sur mobile */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-lg">
          <div className="flex relative justify-between items-center py-1">
            {tabs.map(({ icon: Icon, label, path, special }) => {
              const isActive = location.pathname === path;
              
              return (
                <motion.button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex-1 py-1.5 px-1 flex flex-col items-center space-y-0.5 transition-all duration-300 relative touch-target group ${
                    isActive 
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Indicateur actif compact */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Conteneur d'icône compact */}
                  <div className={`relative flex items-center justify-center ${special && !isActive ? 'mb-0.5' : ''}`}>
                    {special && !isActive ? (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md border border-white/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <motion.div
                        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`flex items-center justify-center rounded-lg backdrop-blur-sm transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/90 shadow-md border border-white/40' 
                            : 'bg-white/50 hover:bg-white/70 border border-white/30'
                        } w-8 h-8`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`} />
                      </motion.div>
                    )}
                    {/* Pastille de notification pour Bell */}
                    {path === '/notifications' && (
                      <motion.div
                        className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full shadow"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Label compact */}
                  <span className={`text-[10px] font-medium transition-all duration-300 ${
                    special && !isActive ? 'text-white drop-shadow' : isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                  }`}>
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Bouton flottant desktop - visible uniquement sur desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showFloatingActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 space-y-3"
            >
              {/* Actions rapides */}
              {tabs.map(({ icon: Icon, label, path }) => {
                const isActive = location.pathname === path;
                
                return (
                  <motion.button
                    key={path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate(path);
                      setShowFloatingActions(false);
                    }}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title={label}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bouton principal pour ouvrir/fermer */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFloatingActions(!showFloatingActions)}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all ${
            showFloatingActions 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <motion.div
            animate={{ rotate: showFloatingActions ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {showFloatingActions ? (
              <X className="w-8 h-8" />
            ) : (
              <Plus className="w-8 h-8" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}