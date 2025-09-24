import React from 'react';
import { GeminiTestPanel } from '../components/GeminiTestPanel';

export default function TestGemini() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Test de l'intégration Gemini
          </h1>
          <p className="text-surface-600 text-lg">
            Testez l'analyse automatique d'images avec l'IA Gemini
          </p>
        </div>
        
        <GeminiTestPanel />
        
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Configuration requise
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Clé API Gemini :</strong> Ajoutez votre clé dans le fichier .env :
            </p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              VITE_GEMINI_API_KEY=votre_cle_api_ici
            </code>
            
            <p>
              <strong>2. Obtenir une clé :</strong> Visitez{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
            
            <p>
              <strong>3. Redémarrer :</strong> Redémarrez le serveur de développement après avoir ajouté la clé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
