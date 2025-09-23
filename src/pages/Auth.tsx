import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  });
  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    username: { isValid: false, message: '', checking: false },
    password: { isValid: false, message: '' },
  });

  const { signIn, signUp, checkUsernameAvailability } = useAuth();
  const navigate = useNavigate();

  // Validation en temps réel
  useEffect(() => {
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidation(prev => ({
      ...prev,
      email: {
        isValid: emailRegex.test(formData.email),
        message: formData.email && !emailRegex.test(formData.email) ? 'Email invalide' : ''
      }
    }));
  }, [formData.email]);

  useEffect(() => {
    // Validation mot de passe
    setValidation(prev => ({
      ...prev,
      password: {
        isValid: formData.password.length >= 6,
        message: formData.password && formData.password.length < 6 ? 'Au moins 6 caractères' : ''
      }
    }));
  }, [formData.password]);

  // Vérification du nom d'utilisateur avec debounce
  useEffect(() => {
    if (!isSignUp || !formData.username) return;

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      setValidation(prev => ({
        ...prev,
        username: {
          isValid: false,
          message: '3-20 caractères (lettres, chiffres, _)',
          checking: false
        }
      }));
      return;
    }

    const timeoutId = setTimeout(async () => {
      setValidation(prev => ({ ...prev, username: { ...prev.username, checking: true } }));
      
      try {
        const isAvailable = await checkUsernameAvailability(formData.username);
        setValidation(prev => ({
          ...prev,
          username: {
            isValid: isAvailable,
            message: isAvailable ? 'Disponible' : 'Déjà pris',
            checking: false
          }
        }));
      } catch (error) {
        setValidation(prev => ({
          ...prev,
          username: {
            isValid: false,
            message: 'Erreur de vérification',
            checking: false
          }
        }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, isSignUp, checkUsernameAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Vérifier que tous les champs sont valides
        if (!validation.email.isValid || !validation.username.isValid || !validation.password.isValid) {
          throw new Error('Veuillez corriger les erreurs dans le formulaire');
        }
        await signUp(formData.email, formData.password, formData.username, formData.fullName);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      // Error is handled in the auth hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SocialCart
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Créez votre compte' : 'Bon retour !'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full p-4 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formData.username ? (validation.username.isValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                      }`}
                      placeholder="Votre nom d'utilisateur"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {validation.username.checking ? (
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      ) : formData.username ? (
                        validation.username.isValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )
                      ) : null}
                    </div>
                  </div>
                  {validation.username.message && (
                    <p className={`text-sm mt-1 ${
                      validation.username.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {validation.username.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-4 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formData.email ? (validation.email.isValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                  }`}
                  placeholder="Votre email"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {formData.email ? (
                    validation.email.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  ) : null}
                </div>
              </div>
              {validation.email.message && (
                <p className="text-sm mt-1 text-red-600">
                  {validation.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full p-4 pr-20 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formData.password ? (validation.password.isValid ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                  }`}
                  placeholder="Votre mot de passe"
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {formData.password ? (
                    validation.password.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validation.password.message && (
                <p className="text-sm mt-1 text-red-600">
                  {validation.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || (isSignUp && (!validation.email.isValid || !validation.username.isValid || !validation.password.isValid))}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isSignUp ? 'Créer le compte' : 'Se connecter'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {isSignUp 
                ? 'Déjà un compte ? Se connecter' 
                : "Pas de compte ? S'inscrire"
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}