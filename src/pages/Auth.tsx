import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidation(prev => ({
      ...prev,
      email: {
        isValid: emailRegex.test(formData.email),
        message: formData.email && !emailRegex.test(formData.email) ? 'Format email invalide' : ''
      }
    }));
  }, [formData.email]);

  useEffect(() => {
    setValidation(prev => ({
      ...prev,
      password: {
        isValid: formData.password.length >= 6,
        message: formData.password && formData.password.length < 6 ? 'Au moins 6 caractères requis' : ''
      }
    }));
  }, [formData.password]);

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
            message: isAvailable ? 'Nom disponible' : 'Nom déjà pris',
            checking: false
          }
        }));
      } catch {
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
        if (!validation.email.isValid || !validation.username.isValid || !validation.password.isValid) {
          throw new Error('Veuillez corriger les erreurs dans le formulaire');
        }
        await signUp(formData.email, formData.password, formData.username, formData.fullName);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/');
    } catch {
      // Error is handled in the auth hook
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isSignUp 
    ? validation.email.isValid && validation.username.isValid && validation.password.isValid
    : formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-cyan-300/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-white font-bold text-2xl">SC</span>
            </motion.div>
            <h1 className="text-white text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              SocialCart
            </h1>
            <p className="text-blue-100 text-lg">
              {isSignUp ? 'Rejoignez la communauté' : 'Bon retour parmi nous !'}
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-3">
                      Nom complet (optionnel)
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                        placeholder="Votre nom complet"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-100 mb-3">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`w-full bg-white/10 backdrop-blur-sm border rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 transition-all ${
                          formData.username 
                            ? (validation.username.isValid ? 'border-green-400/50 focus:ring-green-400/50 focus:border-green-400/50' : 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50') 
                            : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                        }`}
                        placeholder="Votre nom d'utilisateur"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {validation.username.checking ? (
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : formData.username ? (
                          validation.username.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )
                        ) : null}
                      </div>
                    </div>
                    {validation.username.message && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm mt-2 font-medium ${
                          validation.username.isValid ? 'text-green-300' : 'text-red-300'
                        }`}
                      >
                        {validation.username.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-3">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-white/10 backdrop-blur-sm border rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 transition-all ${
                    formData.email 
                      ? (validation.email.isValid ? 'border-green-400/50 focus:ring-green-400/50 focus:border-green-400/50' : 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50') 
                      : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  placeholder="votre@email.com"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {formData.email ? (
                    validation.email.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )
                  ) : null}
                </div>
              </div>
              {validation.email.message && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm mt-2 text-red-300 font-medium"
                >
                  {validation.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-white/10 backdrop-blur-sm border rounded-xl px-4 py-3 pl-12 pr-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 transition-all ${
                    formData.password 
                      ? (validation.password.isValid ? 'border-green-400/50 focus:ring-green-400/50 focus:border-green-400/50' : 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50') 
                      : 'border-white/20 focus:ring-blue-400/50 focus:border-blue-400/50'
                  }`}
                  placeholder="Votre mot de passe"
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {formData.password ? (
                    validation.password.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )
                  ) : null}
                </div>
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-blue-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-blue-300" />
                  )}
                </motion.button>
              </div>
              {validation.password.message && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm mt-2 text-red-300 font-medium"
                >
                  {validation.password.message}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-4 text-lg font-bold text-white rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{isSignUp ? 'Créer mon compte' : 'Se connecter'}</span>
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
            >
              {isSignUp 
                ? 'Déjà un compte ? Se connecter' 
                : "Pas de compte ? S'inscrire"
              }
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}