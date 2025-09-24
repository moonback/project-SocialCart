// Script pour tester la configuration des stories
const fs = require('fs');
const path = require('path');

console.log('🧪 Test de la configuration des stories...');

// 1. Vérifier que les fichiers existent
const requiredFiles = [
  'src/lib/stories.ts',
  'src/lib/storage.ts',
  'src/hooks/useStories.tsx',
  'src/components/StoriesBar.tsx',
  'src/components/StoriesFeed.tsx',
  'src/components/CreateStoryModal.tsx',
  'src/components/UserStories.tsx',
  'src/components/StoryStats.tsx',
  'supabase/MINIMAL_STORIES_SETUP.sql'
];

console.log('📁 Vérification des fichiers...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
  }
});

// 2. Vérifier les imports dans les fichiers
console.log('\n🔍 Vérification des imports...');

// Vérifier UserStories.tsx
const userStoriesPath = path.join(__dirname, '..', 'src/components/UserStories.tsx');
if (fs.existsSync(userStoriesPath)) {
  const content = fs.readFileSync(userStoriesPath, 'utf8');
  if (content.includes("import { supabase } from '../lib/supabase';")) {
    console.log('✅ UserStories.tsx - Import supabase OK');
  } else {
    console.log('❌ UserStories.tsx - Import supabase MANQUANT');
  }
}

// Vérifier StoriesBar.tsx
const storiesBarPath = path.join(__dirname, '..', 'src/components/StoriesBar.tsx');
if (fs.existsSync(storiesBarPath)) {
  const content = fs.readFileSync(storiesBarPath, 'utf8');
  if (content.includes("import { StoriesFeed } from './StoriesFeed';")) {
    console.log('✅ StoriesBar.tsx - Import StoriesFeed OK');
  } else {
    console.log('❌ StoriesBar.tsx - Import StoriesFeed MANQUANT');
  }
}

// 3. Créer un fichier de test HTML
const testHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Stories Setup</title>
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
        .step {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #a855f7;
            background: #f8f9fa;
        }
        .step h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .step p {
            margin: 5px 0;
            color: #666;
        }
        .code {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin: 10px 0;
            overflow-x: auto;
        }
        .success {
            border-left-color: #10b981;
            background: #d1fae5;
        }
        .warning {
            border-left-color: #f59e0b;
            background: #fef3c7;
        }
        .error {
            border-left-color: #ef4444;
            background: #fee2e2;
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
        <h1>🧪 Test de Configuration Stories</h1>
        
        <div class="step success">
            <h3>✅ Étape 1 : Exécuter le Script SQL</h3>
            <p>Copiez et exécutez ce script dans Supabase SQL Editor :</p>
            <div class="code">
-- Exécuter dans Supabase SQL Editor
\\i supabase/MINIMAL_STORIES_SETUP.sql
            </div>
        </div>

        <div class="step warning">
            <h3>⚠️ Étape 2 : Vérifier les Icônes PWA</h3>
            <p>Ouvrez cette page pour tester les icônes :</p>
            <button onclick="window.open('/test-icons.html', '_blank')">🖼️ Tester les Icônes</button>
            <button onclick="window.open('/fix-icons.html', '_blank')">🔧 Corriger les Icônes</button>
        </div>

        <div class="step">
            <h3>🔄 Étape 3 : Recharger la Page</h3>
            <p>Après avoir exécuté le script SQL, rechargez cette page avec Ctrl+F5</p>
            <button onclick="location.reload()">🔄 Recharger</button>
        </div>

        <div class="step">
            <h3>🧪 Étape 4 : Tester les Stories</h3>
            <p>Une fois le script SQL exécuté :</p>
            <ul>
                <li>Allez sur la page d'accueil</li>
                <li>Cliquez sur le bouton "+" dans la barre des stories</li>
                <li>Créez une story de test</li>
            </ul>
        </div>

        <div class="step error">
            <h3>❌ Si les Erreurs Persistent</h3>
            <p>Vérifiez dans la console du navigateur (F12) :</p>
            <ul>
                <li>Plus d'erreur "Could not find the function"</li>
                <li>Plus d'erreur "supabase is not defined"</li>
                <li>Plus d'erreur "StoriesFeed is not defined"</li>
            </ul>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px;">
            <h3>📞 Support</h3>
            <p>Si vous rencontrez des problèmes :</p>
            <ul>
                <li>Vérifiez que vous êtes connecté à Supabase</li>
                <li>Vérifiez que le script SQL s'est exécuté sans erreur</li>
                <li>Vérifiez la console du navigateur pour d'autres erreurs</li>
            </ul>
        </div>
    </div>
</body>
</html>
`;

const testPath = path.join(__dirname, '..', 'public/test-stories-setup.html');
fs.writeFileSync(testPath, testHtml);
console.log('✅ Fichier de test créé: test-stories-setup.html');

console.log('\n🎉 Test terminé !');
console.log('');
console.log('📋 Prochaines étapes:');
console.log('1. Exécuter supabase/MINIMAL_STORIES_SETUP.sql dans Supabase');
console.log('2. Ouvrir http://localhost:3000/test-stories-setup.html');
console.log('3. Suivre les instructions de test');
console.log('4. Recharger la page principale');
