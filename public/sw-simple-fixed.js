// Service Worker ultra-simplifié pour SocialCart - Version sans erreurs
const CACHE_NAME = 'socialcart-simple-v1';

// Ressources essentielles à mettre en cache
const ESSENTIAL_ASSETS = [
  '/',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing (simple version)...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cache opened');
      // Ne mettre en cache que les ressources essentielles
      return cache.addAll(ESSENTIAL_ASSETS).catch(error => {
        console.warn('Service Worker: Some essential assets failed to cache:', error);
        // Continuer même si certains assets échouent
        return Promise.resolve();
      });
    }).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
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

// Gestion des requêtes - Version ultra-simple
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorer toutes les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes de développement
  if (request.url.includes('localhost') || request.url.includes('127.0.0.1')) {
    return;
  }

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie très simple : Cache First pour les assets statiques
  if (request.url.includes('/icons/') || request.url.includes('/manifest.json')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        // Si pas en cache, essayer le réseau
        return fetch(request).catch(() => {
          // Si le réseau échoue, retourner une réponse vide
          return new Response('', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
    );
    return;
  }

  // Pour toutes les autres requêtes, laisser passer sans intervention
  // Cela évite les erreurs de fetch dans le service worker
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded (ultra-simple version)');
