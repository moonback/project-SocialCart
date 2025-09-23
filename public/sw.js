// Service Worker pour SocialCart
const CACHE_NAME = 'socialcart-v1';
const STATIC_CACHE = 'socialcart-static-v1';
const DYNAMIC_CACHE = 'socialcart-dynamic-v1';

// Ressources à mettre en cache statiquement
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\/.*$/,
  /^https:\/\/images\.pexels\.com\/.*$/,
  /^https:\/\/.*\.cloudinary\.com\/.*$/
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache statique
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
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
  console.log('Service Worker: Activating...');
  
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
  const url = new URL(request.url);

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
  const url = new URL(request.url);

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

    throw error;
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
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Cloner la réponse avant de la mettre en cache
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
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

// Gestion des notifications push (pour plus tard)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Voir',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/xmark.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

console.log('Service Worker: Loaded');
