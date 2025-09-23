// Service Worker simplifié pour SocialCart
const CACHE_NAME = 'socialcart-simple-v1';

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing (simple version)...');
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating (simple version)...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Gestion des requêtes - version simplifiée
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie simple : Network First avec fallback
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Si la requête réussit, mettre en cache
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(error => {
          console.warn(`Service Worker: Network failed for ${request.url}:`, error.message);
          
          // Fallback vers le cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si c'est une icône manquante, retourner une réponse vide
              if (request.url.includes('/icons/')) {
                return new Response('', {
                  status: 404,
                  statusText: 'Icon not found'
                });
              }
              
              // Pour les autres requêtes, laisser passer l'erreur
              throw error;
            });
        })
    );
  }
});

console.log('Service Worker: Loaded (simple version)');
