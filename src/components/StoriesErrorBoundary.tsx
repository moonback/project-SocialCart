import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class StoriesErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Stories Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur dans les Stories
          </h3>
          
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Une erreur s'est produite lors du chargement des stories. 
            Cela peut être dû à un problème de connexion ou de configuration.
          </p>

          {this.state.error && (
            <details className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 max-w-md">
              <summary className="cursor-pointer font-medium">
                Détails de l'erreur
              </summary>
              <pre className="mt-2 text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div className="flex space-x-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réessayer</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Recharger la page
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Si le problème persiste :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vérifiez votre connexion internet</li>
              <li>Nettoyez le cache du navigateur</li>
              <li>Contactez le support technique</li>
            </ul>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
