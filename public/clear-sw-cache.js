// Script pour nettoyer le cache du service worker
console.log('🧹 Nettoyage du cache du service worker...');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log('📋 Service workers enregistrés:', registrations.length);
    
    for(let registration of registrations) {
      console.log('🗑️ Suppression du service worker:', registration.scope);
      registration.unregister();
    }
    
    // Nettoyer le cache
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        console.log('📦 Caches trouvés:', cacheNames);
        
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('🗑️ Suppression du cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('✅ Cache nettoyé avec succès');
        alert('Cache nettoyé ! Rechargez la page.');
      });
    } else {
      console.log('✅ Service workers supprimés');
      alert('Service workers supprimés ! Rechargez la page.');
    }
  });
} else {
  console.log('❌ Service Worker non supporté');
  alert('Service Worker non supporté par ce navigateur');
}