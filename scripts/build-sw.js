#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script pour copier le service worker de production
// Pour le déploiement, nous utilisons toujours le service worker de production
const sourceFile = 'public/sw-production.js';
const targetFile = 'dist/sw.js';

console.log(`🔧 Copie du service worker: ${sourceFile} -> ${targetFile}`);

try {
  // Créer le dossier dist s'il n'existe pas
  const distDir = path.dirname(targetFile);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copier le fichier
  fs.copyFileSync(sourceFile, targetFile);
  
  console.log('✅ Service worker copié avec succès');
} catch (error) {
  console.error('❌ Erreur lors de la copie du service worker:', error.message);
  process.exit(1);
}
