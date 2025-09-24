// Script pour corriger les problèmes PWA
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction des problèmes PWA...');

// 1. Vérifier et corriger le manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
const distManifestPath = path.join(__dirname, '../dist/manifest.json');

if (fs.existsSync(manifestPath)) {
  console.log('✅ Manifest.json trouvé');
  
  // Copier le manifest vers dist si nécessaire
  if (fs.existsSync(path.dirname(distManifestPath))) {
    fs.copyFileSync(manifestPath, distManifestPath);
    console.log('✅ Manifest copié vers dist/');
  }
} else {
  console.log('❌ Manifest.json non trouvé');
}

// 2. Vérifier les icônes
const iconsDir = path.join(__dirname, '../public/icons');
const distIconsDir = path.join(__dirname, '../dist/icons');

if (fs.existsSync(iconsDir)) {
  console.log('✅ Dossier icons trouvé');
  
  // Créer le dossier dist/icons s'il n'existe pas
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
    console.log('✅ Dossier dist/icons créé');
  }
  
  // Copier toutes les icônes
  const iconFiles = fs.readdirSync(iconsDir);
  iconFiles.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.svg')) {
      const srcPath = path.join(iconsDir, file);
      const destPath = path.join(distIconsDir, file);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Icône copiée: ${file}`);
    }
  });
} else {
  console.log('❌ Dossier icons non trouvé');
}

// 3. Vérifier le service worker
const swPath = path.join(__dirname, '../public/sw.js');
const distSwPath = path.join(__dirname, '../dist/sw.js');

if (fs.existsSync(swPath)) {
  console.log('✅ Service worker trouvé');
  
  if (fs.existsSync(path.dirname(distSwPath))) {
    fs.copyFileSync(swPath, distSwPath);
    console.log('✅ Service worker copié vers dist/');
  }
} else {
  console.log('❌ Service worker non trouvé');
}

// 4. Créer un fichier de test pour vérifier les icônes
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Test PWA Icons</title>
</head>
<body>
    <h1>Test des icônes PWA</h1>
    <div>
        <h2>Icônes disponibles:</h2>
        <ul>
            <li><img src="/icons/icon-72x72.png" alt="72x72" width="72" height="72"></li>
            <li><img src="/icons/icon-96x96.png" alt="96x96" width="96" height="96"></li>
            <li><img src="/icons/icon-128x128.png" alt="128x128" width="128" height="128"></li>
            <li><img src="/icons/icon-144x144.png" alt="144x144" width="144" height="144"></li>
            <li><img src="/icons/icon-152x152.png" alt="152x152" width="152" height="152"></li>
            <li><img src="/icons/icon-192x192.png" alt="192x192" width="192" height="192"></li>
            <li><img src="/icons/icon-384x384.png" alt="384x384" width="384" height="384"></li>
            <li><img src="/icons/icon-512x512.png" alt="512x512" width="512" height="512"></li>
            <li><img src="/icons/icon-base.svg" alt="SVG" width="100" height="100"></li>
        </ul>
    </div>
</body>
</html>
`;

const testPath = path.join(__dirname, '../public/test-icons.html');
fs.writeFileSync(testPath, testHtml);
console.log('✅ Fichier de test créé: test-icons.html');

console.log('🎉 Correction PWA terminée !');
console.log('');
console.log('📋 Prochaines étapes:');
console.log('1. Redémarrer le serveur de développement');
console.log('2. Ouvrir http://localhost:3000/test-icons.html pour tester les icônes');
console.log('3. Vérifier la console pour les erreurs PWA');
console.log('4. Tester l\'installation PWA');
