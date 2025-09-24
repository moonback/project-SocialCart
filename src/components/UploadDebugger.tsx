import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, X, Database, User, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface UploadDebuggerProps {
  onClose: () => void;
}

export function UploadDebugger({ onClose }: UploadDebuggerProps) {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const runDiagnostics = async () => {
    setTesting(true);
    setResults(null);

    const diagnostics = {
      user: null as any,
      buckets: null as any,
      policies: null as any,
      upload: null as any,
      errors: [] as string[]
    };

    try {
      // 1. Vérifier l'utilisateur
      diagnostics.user = {
        connected: !!user,
        id: user?.id,
        email: user?.email,
        is_seller: user?.is_seller,
        avatar_url: user?.avatar_url
      };

      if (!user) {
        diagnostics.errors.push('❌ Utilisateur non connecté');
      }

      // 2. Vérifier les buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        diagnostics.errors.push(`❌ Erreur buckets: ${bucketsError.message}`);
      } else {
        diagnostics.buckets = buckets?.map(b => ({
          name: b.name,
          public: b.public,
          file_size_limit: b.file_size_limit,
          allowed_mime_types: b.allowed_mime_types
        }));
      }

      // 3. Vérifier les politiques (approximation)
      try {
        const { data: policies, error: policiesError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('tablename', 'objects')
          .eq('schemaname', 'storage');
        
        if (policiesError) {
          diagnostics.errors.push(`⚠️ Impossible de vérifier les politiques: ${policiesError.message}`);
        } else {
          diagnostics.policies = policies?.length || 0;
        }
      } catch (e) {
        diagnostics.errors.push('⚠️ Vérification des politiques non disponible');
      }

      // 4. Test d'upload si fichier sélectionné
      if (selectedFile && user) {
        try {
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `test-${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `profiles/${fileName}`;

          const { data, error } = await supabase.storage
            .from('profiles')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: true
            });

          if (error) {
            diagnostics.errors.push(`❌ Erreur upload: ${error.message}`);
            diagnostics.upload = { success: false, error: error.message };
          } else {
            diagnostics.upload = { success: true, path: data.path };
            
            // Nettoyer le fichier de test
            await supabase.storage.from('profiles').remove([filePath]);
          }
        } catch (e) {
          diagnostics.errors.push(`❌ Erreur upload: ${e}`);
          diagnostics.upload = { success: false, error: String(e) };
        }
      }

    } catch (e) {
      diagnostics.errors.push(`❌ Erreur générale: ${e}`);
    }

    setResults(diagnostics);
    setTesting(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Diagnostic Upload</h2>
                <p className="text-sm text-gray-500">Vérification des problèmes d'upload</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Sélection de fichier */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Test d'Upload</h3>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  <p><strong>Fichier:</strong> {selectedFile.name}</p>
                  <p><strong>Taille:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bouton de test */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runDiagnostics}
            disabled={testing}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {testing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Diagnostic en cours...</span>
              </>
            ) : (
              <>
                <Settings className="w-5 h-5" />
                <span>Lancer le Diagnostic</span>
              </>
            )}
          </motion.button>

          {/* Résultats */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <h3 className="font-semibold text-gray-900">Résultats du Diagnostic</h3>
              
              {/* Utilisateur */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Authentification</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Connecté:</strong> {results.user?.connected ? '✅ Oui' : '❌ Non'}</p>
                  {results.user?.connected && (
                    <>
                      <p><strong>ID:</strong> {results.user.id}</p>
                      <p><strong>Email:</strong> {results.user.email}</p>
                      <p><strong>Vendeur:</strong> {results.user.is_seller ? '✅ Oui' : '❌ Non'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Buckets */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Buckets de Stockage</span>
                </div>
                <div className="text-sm space-y-1">
                  {results.buckets?.map((bucket: any) => (
                    <div key={bucket.name} className="flex items-center justify-between">
                      <span><strong>{bucket.name}:</strong></span>
                      <span className="text-green-600">✅ Configuré</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test d'upload */}
              {results.upload && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">Test d'Upload</span>
                  </div>
                  <div className="text-sm">
                    {results.upload.success ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>✅ Upload réussi</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>❌ Upload échoué: {results.upload.error}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Erreurs */}
              {results.errors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2">Erreurs Détectées</h4>
                  <ul className="space-y-1">
                    {results.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-700">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solutions */}
              {results.errors.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Solutions Recommandées</h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    {results.errors.some((e: string) => e.includes('non connecté')) && (
                      <p>• Se connecter avec un compte valide</p>
                    )}
                    {results.errors.some((e: string) => e.includes('bucket')) && (
                      <p>• Exécuter le script de configuration des buckets</p>
                    )}
                    {results.errors.some((e: string) => e.includes('upload')) && (
                      <p>• Vérifier les permissions et la taille du fichier</p>
                    )}
                    <p>• Consulter <code>docs/QUICK_UPLOAD_FIX.md</code> pour plus de détails</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
