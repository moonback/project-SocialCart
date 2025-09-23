// Service Worker simplifié pour SocialCart - Version de débogage
const CACHE_NAME = 'socialcart-debug-v1';

// Ressources à mettre en cache statiquement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-base.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/.*$/,
  /^https:\/\/images\.pexels\.com\/.*$/,
  /^https:\/\/.*\.cloudinary\.com\/.*$/
];

// Installation du Service Worker - Version simplifiée
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing (debug version)...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Cache opened');
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.warn('Service Worker: Some assets failed to cache:', error);
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
  console.log('Service Worker: Activating (debug version)...');
  
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

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes de développement (localhost)
  if (request.url.includes('localhost') || request.url.includes('127.0.0.1')) {
    return;
  }

  // Ignorer les requêtes POST, PUT, DELETE pour éviter les problèmes
  if (request.method !== 'GET') {
    return;
  }

  // Stratégie de cache selon le type de requête
  event.respondWith(handleRequest(request));
});

// Gestion simplifiée des requêtes
async function handleRequest(request) {
  try {
    // Stratégie simple : Network First
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn(`Service Worker: Network failed for ${request.url}:`, error.message);
    
    // Fallback vers le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Gestion spéciale pour les icônes manquantes
    if (request.url.includes('/icons/')) {
      return new Response('', {
        status: 404,
        statusText: 'Icon not found'
      });
    }
    
    // Pour les requêtes API Supabase, retourner une réponse d'erreur propre
    if (request.url.includes('supabase.co')) {
      return new Response(JSON.stringify({ 
        error: 'Service temporairement indisponible',
        message: 'Veuillez réessayer plus tard'
      }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Pour les images externes, retourner une réponse d'erreur
    if (request.url.includes('pexels.com') || request.url.includes('cloudinary.com')) {
      return new Response('', {
        status: 404,
        statusText: 'Image not available'
      });
    }
    
    // Pour les autres requêtes, retourner une réponse d'erreur générique
    return new Response('', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Version simplifiée - fonctions supprimées pour éviter les conflits

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded (simplified debug version)');
