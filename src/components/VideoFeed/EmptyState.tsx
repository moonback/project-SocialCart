import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6 p-8"
      >
        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20">
          <svg 
            className="w-12 h-12 text-white/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            Aucune vidéo disponible
          </h3>
          <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
            Il n'y a actuellement aucun produit à afficher. 
            Revenez plus tard pour découvrir de nouveaux contenus !
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-2xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
        >
          Actualiser
        </motion.button>
      </motion.div>
    </div>
  );
};
