import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-md"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
            >
              <AlertCircle className="w-10 h-10 text-red-600" />
            </motion.div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Oops ! Une erreur s'est produite
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille à résoudre le problème.
              </p>
            </div>

            {/* Error Details (en mode développement) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Détails de l'erreur (développement)
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Réessayer</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Retour à l'accueil</span>
              </motion.button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Conseil :</strong> Si le problème persiste, essayez de rafraîchir la page ou de vous reconnecter.
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour gérer les erreurs dans les composants fonctionnels
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

// Composant pour afficher les erreurs dans les composants fonctionnels
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void; 
}) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Une erreur s'est produite</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        <button
          onClick={resetError}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
