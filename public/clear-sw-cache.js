// Script pour nettoyer le cache du Service Worker
// À exécuter dans la console du navigateur si nécessaire

if ('serviceWorker' in navigator) {
  // Désinscrire tous les service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker désinscrit:', registration.scope);
    }
  });

  // Nettoyer tous les caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Suppression du cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('Tous les caches ont été supprimés');
      // Recharger la page
      window.location.reload();
    });
  }
} else {
  console.log('Service Worker non supporté');
}
