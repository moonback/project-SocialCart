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
      <div className="bg-white/80 backdrop-blur-2xl border-t border-white/20 shadow-glass rounded-t-3xl">
        <div className="flex relative justify-between items-end">
          {tabs.map(({ icon: Icon, label, path, special }) => {
            const isActive = location.pathname === path;
            
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                className={`flex-1 py-2 px-1 flex flex-col items-center space-y-1 transition-all duration-300 relative touch-target group ${
                  isActive 
                    ? 'text-primary-700'
                    : 'text-surface-400 hover:text-primary-500'
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Indicateur actif amélioré */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full shadow-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Conteneur d'icône amélioré */}
                <div className={`relative flex items-center justify-center ${special && !isActive ? 'mb-1' : ''}`}>
                  {special && !isActive ? (
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow border border-white/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300 hover:shadow-glass">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <motion.div
                      animate={isActive ? { scale: 1.18 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className={`flex items-center justify-center rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/80 shadow-glass border border-white/30' 
                          : 'bg-white/40 hover:bg-white/60 border border-white/20'
                      } w-10 h-10`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-primary-700' : 'text-surface-500 group-hover:text-primary-600'}`} />
                    </motion.div>
                  )}
                  {/* Pastille de notification pour Bell */}
                  {path === '/notifications' && (
                    <motion.div
                      className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full shadow"
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Label amélioré */}
                <span className={`text-[11px] font-semibold transition-all duration-300 tracking-wide ${
                  special && !isActive ? 'text-white drop-shadow' : isActive ? 'text-primary-700' : 'text-surface-400 group-hover:text-primary-500'
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