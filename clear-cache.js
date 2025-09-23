// Script pour nettoyer les caches du Service Worker
console.log('🧹 Nettoyage des caches du Service Worker...');

// Fonction pour nettoyer tous les caches
async function clearAllCaches() {
  try {
    // Nettoyer les caches du navigateur
    const cacheNames = await caches.keys();
    console.log(`📋 Caches trouvés: ${cacheNames.join(', ')}`);
    
    const deletePromises = cacheNames.map(cacheName => {
      console.log(`🗑️ Suppression du cache: ${cacheName}`);
      return caches.delete(cacheName);
    });
    
    await Promise.all(deletePromises);
    console.log('✅ Tous les caches ont été supprimés');
    
    // Forcer la mise à jour du Service Worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`📱 Service Workers trouvés: ${registrations.length}`);
      
      for (const registration of registrations) {
        console.log(`🔄 Mise à jour du Service Worker: ${registration.scope}`);
        await registration.update();
      }
      
      // Redémarrer l'application
      console.log('🔄 Rechargement de la page...');
      window.location.reload(true);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des caches:', error);
  }
}

// Exécuter le nettoyage
clearAllCaches();
