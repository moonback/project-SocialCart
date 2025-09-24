import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Upload,
  Users,
  Eye,
  Heart
} from 'lucide-react';
import { useStories } from '../hooks/useStories';
import { StoryService } from '../lib/stories';
import { StoriesDebug } from '../lib/stories-debug';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function StoriesTest() {
  const { user } = useAuth();
  const { stories, loading, loadStories } = useStories();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [setupResults, setSetupResults] = useState<any>(null);
  const [settingUp, setSettingUp] = useState(false);

  const runTests = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour tester');
      return;
    }

    setTesting(true);
    const results: any = {
      database: false,
      storage: false,
      creation: false,
      interaction: false,
      errors: []
    };

    try {
      // Test 1: Vérifier la connexion à la base de données
      try {
        const testStories = await StoryService.getAllActiveStories();
        results.database = true;
        results.storiesCount = testStories.length;
      } catch (error) {
        results.errors.push(`Base de données: ${error}`);
      }

      // Test 2: Vérifier le stockage (simulation)
      try {
        // Simuler un upload de fichier
        const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
        results.storage = true;
      } catch (error) {
        results.errors.push(`Stockage: ${error}`);
      }

      // Test 3: Créer une story de test
      try {
        const testStory = await StoryService.createStory({
          product_id: 'test-product-id',
          seller_id: user.id,
          type: 'text',
          content: 'Story de test - ' + new Date().toISOString(),
          duration: 5,
          background_color: '#ff6b6b',
          text_color: '#FFFFFF',
          font_size: 'medium'
        });
        results.creation = true;
        results.createdStoryId = testStory.id;
      } catch (error) {
        results.errors.push(`Création: ${error}`);
      }

      // Test 4: Interaction avec une story
      try {
        if (results.createdStoryId) {
          await StoryService.markStoryAsViewed(results.createdStoryId, user.id);
          results.interaction = true;
        }
      } catch (error) {
        results.errors.push(`Interaction: ${error}`);
      }

      setTestResults(results);
      
      if (results.errors.length === 0) {
        toast.success('Tous les tests sont passés !');
      } else {
        toast.error(`${results.errors.length} erreur(s) détectée(s)`);
      }

    } catch (error) {
      results.errors.push(`Erreur générale: ${error}`);
      setTestResults(results);
      toast.error('Erreur lors des tests');
    } finally {
      setTesting(false);
      loadStories(); // Recharger les stories
    }
  };

  const runSetup = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour configurer');
      return;
    }

    setSettingUp(true);
    try {
      const results = await StoriesDebug.fullSetup();
      setSetupResults(results);
      
      if (results.success) {
        toast.success('Configuration terminée avec succès !');
        loadStories(); // Recharger les stories
      } else {
        toast.error(`${results.errors.length} erreur(s) lors de la configuration`);
      }
    } catch (error) {
      toast.error('Erreur lors de la configuration');
    } finally {
      setSettingUp(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Test du Système Stories</h3>
          <p className="text-sm text-gray-600">Vérifiez que tout fonctionne correctement</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <Database className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{stories.length}</div>
          <div className="text-xs text-gray-600">Stories</div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <Eye className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {stories.reduce((sum, story) => sum + story.views_count, 0)}
          </div>
          <div className="text-xs text-gray-600">Vues</div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {stories.reduce((sum, story) => sum + story.interactions_count, 0)}
          </div>
          <div className="text-xs text-gray-600">Interactions</div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {new Set(stories.map(s => s.seller_id)).size}
          </div>
          <div className="text-xs text-gray-600">Vendeurs</div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runSetup}
          disabled={settingUp || !user}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {settingUp ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Configuration en cours...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Configurer le Système</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runTests}
          disabled={testing || !user}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {testing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Tests en cours...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Lancer les Tests</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Résultats de configuration */}
      {setupResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h4 className="font-semibold text-gray-900">Résultats de Configuration</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(setupResults.results.tables)}
                <span className="font-medium">Tables de base de données</span>
              </div>
              <span className="text-sm text-gray-600">
                {setupResults.results.tables ? 'Créées' : 'Échec'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(setupResults.results.bucket)}
                <span className="font-medium">Bucket de stockage</span>
              </div>
              <span className="text-sm text-gray-600">
                {setupResults.results.bucket ? 'Créé' : 'Échec'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(setupResults.results.policies)}
                <span className="font-medium">Politiques RLS</span>
              </div>
              <span className="text-sm text-gray-600">
                {setupResults.results.policies ? 'Configurées' : 'Échec'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(setupResults.results.functions)}
                <span className="font-medium">Fonctions RPC</span>
              </div>
              <span className="text-sm text-gray-600">
                {setupResults.results.functions ? 'Créées' : 'Échec'}
              </span>
            </div>
          </div>

          {/* Erreurs de configuration */}
          {setupResults.errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">Erreurs de configuration :</h5>
              <ul className="space-y-1">
                {setupResults.errors.map((error: string, index: number) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Résultats des tests */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h4 className="font-semibold text-gray-900">Résultats des Tests</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.database)}
                <span className="font-medium">Base de données</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.storiesCount} stories trouvées
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.storage)}
                <span className="font-medium">Stockage</span>
              </div>
              <span className="text-sm text-gray-600">Bucket configuré</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.creation)}
                <span className="font-medium">Création de story</span>
              </div>
              <span className="text-sm text-gray-600">
                {testResults.createdStoryId ? 'Story créée' : 'Échec'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(testResults.interaction)}
                <span className="font-medium">Interactions</span>
              </div>
              <span className="text-sm text-gray-600">Vue enregistrée</span>
            </div>
          </div>

          {/* Erreurs */}
          {testResults.errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">Erreurs détectées :</h5>
              <ul className="space-y-1">
                {testResults.errors.map((error: string, index: number) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-semibold text-blue-800 mb-2">🚨 Installation Requise :</h5>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Les erreurs indiquent que le schéma n'est pas encore installé.</strong></p>
          <div className="bg-white p-3 rounded-lg border border-blue-300">
            <p className="font-semibold mb-2">📋 Étapes d'installation :</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Ouvrir <strong>Supabase Dashboard</strong></li>
              <li>Aller dans <strong>SQL Editor</strong></li>
              <li>Copier le contenu de <code>supabase/product_stories_schema.sql</code></li>
              <li>Exécuter le script SQL</li>
              <li>Créer le bucket <code>stories</code> dans Storage</li>
            </ol>
          </div>
          <p className="text-xs">
            📖 Guide détaillé : <code>docs/MANUAL_SETUP_GUIDE.md</code>
          </p>
        </div>
      </div>
    </div>
  );
}
