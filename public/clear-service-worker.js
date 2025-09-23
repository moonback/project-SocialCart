// Script pour nettoyer complètement le Service Worker
console.log('🧹 Nettoyage complet du Service Worker...');

async function clearServiceWorker() {
  try {
    // 1. Désinscrire tous les Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`📱 Service Workers trouvés: ${registrations.length}`);
      
      for (const registration of registrations) {
        console.log(`🗑️ Désinscription du Service Worker: ${registration.scope}`);
        await registration.unregister();
      }
      
      console.log('✅ Tous les Service Workers ont été désinscrits');
    }
    
    // 2. Nettoyer tous les caches
    const cacheNames = await caches.keys();
    console.log(`📋 Caches trouvés: ${cacheNames.join(', ')}`);
    
    const deletePromises = cacheNames.map(cacheName => {
      console.log(`🗑️ Suppression du cache: ${cacheName}`);
      return caches.delete(cacheName);
    });
    
    await Promise.all(deletePromises);
    console.log('✅ Tous les caches ont été supprimés');
    
    // 3. Nettoyer le localStorage et sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Stockage local nettoyé');
    
    // 4. Recharger la page
    console.log('🔄 Rechargement de la page...');
    window.location.reload(true);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le nettoyage
clearServiceWorker();
