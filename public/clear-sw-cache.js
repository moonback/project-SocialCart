// Script pour nettoyer le cache du Service Worker
// À exécuter dans la console du navigateur

console.log('🧹 Nettoyage du cache du Service Worker...');

// Désinscrire tous les service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log(`📋 ${registrations.length} service worker(s) trouvé(s)`);
    
    for(let registration of registrations) {
      console.log(`🗑️ Désinscription du service worker: ${registration.scope}`);
      registration.unregister();
    }
    
    console.log('✅ Tous les service workers ont été désinscrits');
  });
}

// Nettoyer tous les caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    console.log(`📦 ${cacheNames.length} cache(s) trouvé(s)`);
    
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log(`🗑️ Suppression du cache: ${cacheName}`);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log('✅ Tous les caches ont été supprimés');
    console.log('🔄 Rechargez la page pour appliquer les changements');
  });
}

// Nettoyer le localStorage et sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('✅ localStorage et sessionStorage nettoyés');

console.log('🎉 Nettoyage terminé ! Rechargez la page.');