// Service Worker pour SocialCart - Version Production
const CACHE_NAME = 'socialcart-prod-v1';
const STATIC_CACHE = 'socialcart-static-prod-v1';
const DYNAMIC_CACHE = 'socialcart-dynamic-prod-v1';

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

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing (production)...');
  
  event.waitUntil(
    Promise.all([
      // Cache statique - avec gestion d'erreur pour les ressources manquantes
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log('Service Worker: Caching static assets');
        const results = await Promise.allSettled(
          STATIC_ASSETS.map(asset => cache.add(asset))
        );
        
        // Log des échecs pour debug
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`Service Worker: Failed to cache ${STATIC_ASSETS[index]}:`, result.reason);
          }
        });
        
        return Promise.resolve();
      }),
      // Cache dynamique
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Service Worker: Dynamic cache ready');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating (production)...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
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

  // Stratégie de cache selon le type de requête
  if (request.method === 'GET') {
    event.respondWith(handleRequest(request));
  }
});

async function handleRequest(request) {
  try {
    // 1. Cache First pour les assets statiques
    if (isStaticAsset(request)) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // 2. Network First pour les API calls
    if (isApiRequest(request)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // 3. Stale While Revalidate pour les images
    if (isImageRequest(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }

    // 4. Network First par défaut
    return await networkFirst(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('Service Worker: Error handling request:', error);
    
    // Fallback vers le cache ou page d'erreur
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

    // Page d'erreur offline
    if (request.destination === 'document') {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Hors ligne - SocialCart</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                text-align: center; 
                padding: 2rem; 
                background: linear-gradient(135deg, #a855f7, #3b82f6);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
              }
              .container { max-width: 400px; }
              h1 { font-size: 2rem; margin-bottom: 1rem; }
              p { opacity: 0.9; margin-bottom: 2rem; }
              button { 
                background: white; 
                color: #a855f7; 
                border: none; 
                padding: 1rem 2rem; 
                border-radius: 0.5rem; 
                font-weight: bold;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📱 Hors ligne</h1>
              <p>Vous n'êtes pas connecté à Internet. Vérifiez votre connexion et réessayez.</p>
              <button onclick="window.location.reload()">Réessayer</button>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Pour les autres types de requêtes, retourner une erreur 404 propre
    return new Response('', {
      status: 404,
      statusText: 'Resource not found'
    });
  }
}

// Stratégies de cache
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn(`Service Worker: Network request failed for ${request.url}:`, error.message);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si c'est une requête pour une icône manquante, retourner une réponse par défaut
    if (request.url.includes('/icons/') && request.url.includes('.png')) {
      return new Response('', {
        status: 404,
        statusText: 'Icon not found'
      });
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.warn(`Service Worker: Failed to fetch ${request.url}:`, error.message);
    return null;
  });

  return cachedResponse || fetchPromise;
}

// Helpers pour identifier les types de requêtes
function isStaticAsset(request) {
  return request.url.includes('/static/') || 
         request.url.includes('/manifest.json') ||
         request.url.includes('/icons/');
}

function isApiRequest(request) {
  return request.url.includes('/api/') ||
         request.url.includes('.supabase.co');
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded (production version)');
