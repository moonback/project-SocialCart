# 🔧 Guide de dépannage Service Worker - SocialCart

## Problèmes résolus

### ❌ Erreur WebSocket localhost
**Problème :** `WebSocket connection to 'ws://localhost:5173/' failed`

**Cause :** Vite injecte du code de développement dans le service worker qui essaie de se connecter à localhost même en production.

**Solution :** 
- ✅ Service worker séparé pour la production (`sw-production.js`)
- ✅ Détection automatique de l'environnement dans `main.tsx`
- ✅ Script de build qui copie le bon service worker

### ❌ Erreur icônes PWA
**Problème :** `Error while trying to use the following icon from the Manifest`

**Cause :** Les icônes ne sont pas trouvées ou mal configurées.

**Solution :**
- ✅ Service worker avec gestion d'erreur pour les icônes manquantes
- ✅ Cache optimisé pour les icônes dans `vercel.json`

## 🚀 Instructions de déploiement

### 1. Build local
```bash
npm run build
```

### 2. Déploiement Vercel
- **Build Command :** `npm run vercel-build`
- **Output Directory :** `dist`
- **Install Command :** `npm install`

### 3. Vérification post-déploiement
1. Ouvrez votre site déployé
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet **Application** → **Service Workers**
4. Vérifiez qu'aucune erreur WebSocket n'apparaît

## 🛠️ Outils de débogage

### Page de débogage
Accédez à `/debug-sw.html` sur votre site pour :
- Vérifier le statut du service worker
- Nettoyer les caches
- Désinscrire le service worker
- Voir les détails techniques

### Script de nettoyage
```bash
npm run clean-sw
```

### Nettoyage manuel
Si vous avez des problèmes persistants :

1. **Dans la console du navigateur :**
```javascript
// Désinscrire tous les service workers
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});

// Nettoyer tous les caches
caches.keys().then(function(cacheNames) {
  return Promise.all(
    cacheNames.map(function(cacheName) {
      return caches.delete(cacheName);
    })
  );
}).then(function() {
  window.location.reload();
});
```

2. **Ou utilisez le fichier :**
```html
<script src="/clear-sw-cache.js"></script>
```

## 📁 Structure des fichiers

```
public/
├── sw.js                 # Service worker développement
├── sw-production.js      # Service worker production
├── clear-sw-cache.js     # Script de nettoyage
└── debug-sw.html         # Page de débogage

scripts/
└── build-sw.js          # Script de build

vercel.json              # Configuration Vercel
```

## 🔍 Vérifications

### ✅ Checklist de déploiement
- [ ] `vercel.json` configuré avec les rewrites
- [ ] Service worker de production copié
- [ ] Aucune erreur WebSocket dans la console
- [ ] Icônes PWA chargées correctement
- [ ] Cache fonctionne en mode hors ligne

### ✅ Tests à effectuer
1. **Navigation directe :** Accédez directement à `/profile` ou `/search`
2. **Bouton retour :** Utilisez le bouton retour du navigateur
3. **Mode hors ligne :** Testez en désactivant le réseau
4. **Rafraîchissement :** Rechargez la page plusieurs fois

## 🆘 Support

Si vous rencontrez encore des problèmes :

1. Vérifiez la console du navigateur pour les erreurs
2. Utilisez la page de débogage `/debug-sw.html`
3. Vérifiez que tous les fichiers sont bien déployés
4. Testez en navigation privée pour éviter les conflits de cache

## 📝 Notes techniques

- Le service worker de production n'inclut pas le code de développement Vite
- Les erreurs d'icônes sont gérées gracieusement avec des réponses 404
- Le cache est optimisé pour les performances et la fiabilité
- La détection d'environnement utilise `import.meta.env.PROD`
