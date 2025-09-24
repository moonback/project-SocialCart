import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Star, Settings, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserAvatar } from './UserAvatar';
import { LoyaltyBadge } from './LoyaltyBadge';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay épuré */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1000]"
            onClick={onClose}
          />
          
          {/* Modal compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              className="w-full max-w-sm sm:max-w-md max-h-[80vh]  rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden relative flex flex-col"
              style={{
                boxShadow: '0 24px 48px -12px rgba(30, 64, 175, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec informations du profil en haut */}
              <div className="relative p-4 pb-6">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-colors border border-white/20"
                  aria-label="Fermer"
                  autoFocus
                >
                  <X className="w-4 h-4 text-white/90" />
                </button>
                
                {/* User info en haut */}
                <div className="flex items-center gap-4 pt-2">
                  <UserAvatar 
                    avatarUrl={user?.avatar_url}
                    username={user?.username}
                    size="lg"
                    className="rounded-2xl border-2 border-white/40 shadow-md"
                  />
                  <div className="flex-1">
                    <h2 id="profile-modal-title" className="text-white font-semibold text-xl">{user?.username}</h2>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <LoyaltyBadge points={user?.loyalty_points} />
                      {user?.email && (
                        <span className="text-white/85 text-xs px-3 py-1 rounded-full bg-white/15 border border-white/20">{user.email}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              
              {/* Content compact (scrollable) */}
              <div className="px-4 pb-2 relative overflow-y-auto">
                <div className="space-y-1.5 relative">
                  {[
                    { icon: User, label: 'Profil', path: '/profile', color: 'from-blue-500 to-blue-600' },
                    { icon: Package, label: 'Mes Produits', path: '/products', color: 'from-indigo-500 to-indigo-600' },
                    { icon: Star, label: 'Points de Fidélité', path: '/loyalty', color: 'from-blue-600 to-cyan-500' },
                    { icon: Settings, label: 'Paramètres', path: '/settings', color: 'from-slate-500 to-slate-600' }
                  ].map((item, index) => (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 + 0.1 }}
                      onClick={() => handleNavigation(item.path)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-md`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </span>
                      <span className="font-medium text-white">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Footer compact + safe-area */}
              <div className="relative pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {/* Séparateur glass */}
                <div className="h-px bg-white/25" />
                <div className="px-4 pt-3 bg-white/5 backdrop-blur-sm">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 flex items-center justify-center gap-2 rounded-xl bg-red-500/90 text-white hover:bg-red-500/15 transition-colors border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Se déconnecter</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}