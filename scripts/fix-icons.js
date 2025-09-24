// Script pour corriger les problèmes d'icônes PWA
const fs = require('fs');
const path = require('path');

console.log('🖼️ Correction des problèmes d\'icônes PWA...');

// 1. Vérifier que les icônes existent
const iconsDir = path.join(__dirname, '../public/icons');
const iconFiles = [
  'icon-72x72.png',
  'icon-96x96.png', 
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png',
  'icon-base.svg'
];

console.log('📁 Vérification des icônes...');
iconFiles.forEach(file => {
  const filePath = path.join(iconsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// 2. Créer des icônes de base si elles manquent
const createBaseIcon = (size) => {
  // Créer un SVG simple pour les icônes manquantes
  const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size/8}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/4}" font-weight="bold" text-anchor="middle" dy=".3em" fill="white">SC</text>
</svg>`;

  return svgContent;
};

// 3. Créer un fichier HTML pour tester les icônes
const testHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Icônes PWA</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .icon-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }
        .icon-item img {
            border: 2px solid #ddd;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .icon-item.loaded img {
            border-color: #10b981;
        }
        .icon-item.error img {
            border-color: #ef4444;
        }
        .status {
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            font-weight: 500;
        }
        .status.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .status.info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
        }
        button {
            background: #a855f7;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
        }
        button:hover {
            background: #9333ea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖼️ Test des Icônes PWA</h1>
        
        <div id="status" class="status info">
            Test des icônes en cours...
        </div>

        <div class="icon-grid" id="iconGrid">
            <!-- Les icônes seront ajoutées ici -->
        </div>

        <div style="text-align: center;">
            <button onclick="testAllIcons()">🔄 Tester Toutes les Icônes</button>
            <button onclick="clearCache()">🧹 Nettoyer le Cache</button>
            <button onclick="reloadPage()">🔄 Recharger</button>
        </div>
    </div>

    <script>
        let successCount = 0;
        let totalCount = 0;

        function updateStatus(message, type = 'info') {
            document.getElementById('status').textContent = message;
            document.getElementById('status').className = \`status \${type}\`;
        }

        function testAllIcons() {
            const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
            const iconGrid = document.getElementById('iconGrid');
            iconGrid.innerHTML = '';
            
            successCount = 0;
            totalCount = iconSizes.length;

            iconSizes.forEach(size => {
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                
                const img = document.createElement('img');
                img.src = \`/icons/icon-\${size}x\${size}.png\`;
                img.alt = \`\${size}x\${size}\`;
                img.width = Math.min(size, 100);
                img.height = Math.min(size, 100);
                
                img.onload = () => {
                    successCount++;
                    iconItem.classList.add('loaded');
                    updateStatus(\`✅ \${successCount}/\${totalCount} icônes chargées\`, 'success');
                };
                
                img.onerror = () => {
                    iconItem.classList.add('error');
                    updateStatus(\`⚠️ \${successCount}/\${totalCount} icônes chargées\`, 'error');
                };
                
                iconItem.appendChild(img);
                iconItem.appendChild(document.createElement('div')).textContent = \`\${size}x\${size}\`;
                iconGrid.appendChild(iconItem);
            });
        }

        function clearCache() {
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    Promise.all(cacheNames.map(name => caches.delete(name)));
                });
            }
            updateStatus('Cache nettoyé !', 'success');
        }

        function reloadPage() {
            window.location.reload();
        }

        // Test automatique au chargement
        document.addEventListener('DOMContentLoaded', testAllIcons);
    </script>
</body>
</html>
`;

// Écrire le fichier de test
const testPath = path.join(__dirname, '../public/test-icons.html');
fs.writeFileSync(testPath, testHtml);
console.log('✅ Fichier de test créé: test-icons.html');

// 4. Créer un fichier de correction automatique
const fixHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correction Icônes PWA</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        button {
            background: #a855f7;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            margin: 10px;
            font-size: 16px;
            font-weight: 600;
        }
        button:hover {
            background: #9333ea;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            font-weight: 500;
        }
        .success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        .info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Correction Icônes PWA</h1>
        
        <div id="status" class="status info">
            Cliquez sur "Corriger" pour résoudre les problèmes d'icônes
        </div>

        <div>
            <button onclick="fixIcons()">🔧 Corriger les Icônes</button>
            <button onclick="clearAll()">🧹 Nettoyer Tout</button>
            <button onclick="reloadPage()">🔄 Recharger</button>
        </div>
    </div>

    <script>
        function updateStatus(message, type = 'info') {
            document.getElementById('status').textContent = message;
            document.getElementById('status').className = \`status \${type}\`;
        }

        function fixIcons() {
            updateStatus('Correction en cours...', 'info');
            
            // Nettoyer le cache
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    Promise.all(cacheNames.map(name => caches.delete(name)));
                });
            }

            // Supprimer le service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    Promise.all(registrations.map(reg => reg.unregister()));
                });
            }

            // Vider le localStorage
            localStorage.clear();
            sessionStorage.clear();

            updateStatus('✅ Correction terminée ! Rechargez la page.', 'success');
        }

        function clearAll() {
            updateStatus('Nettoyage complet...', 'info');
            
            // Tout nettoyer
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    Promise.all(cacheNames.map(name => caches.delete(name)));
                });
            }

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    Promise.all(registrations.map(reg => reg.unregister()));
                });
            }

            localStorage.clear();
            sessionStorage.clear();

            updateStatus('✅ Nettoyage complet terminé !', 'success');
        }

        function reloadPage() {
            window.location.reload();
        }
    </script>
</body>
</html>
`;

const fixPath = path.join(__dirname, '../public/fix-icons.html');
fs.writeFileSync(fixPath, fixHtml);
console.log('✅ Fichier de correction créé: fix-icons.html');

console.log('🎉 Correction des icônes terminée !');
console.log('');
console.log('📋 Prochaines étapes:');
console.log('1. Ouvrir http://localhost:3000/test-icons.html pour tester');
console.log('2. Ouvrir http://localhost:3000/fix-icons.html pour corriger');
console.log('3. Redémarrer le serveur de développement si nécessaire');
