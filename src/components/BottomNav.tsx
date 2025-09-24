import { Home, Search, Plus, Bell, User, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Search, label: 'Rechercher', path: '/search' },
    { icon: Play, label: 'Stories', path: '/stories' },
    { icon: Plus, label: 'Créer', path: '/create', special: true },
    { icon: Bell, label: 'Alertes', path: '/notifications' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50"
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
  );
}