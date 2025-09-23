import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Utiliser le service worker corrigé
    const swPath = '/sw-simple-fixed.js';
    
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
