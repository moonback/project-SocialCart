import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Gift, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLoyalty } from '../hooks/useLoyalty';
import { LoyaltyBadge } from '../components/LoyaltyBadge';

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, loading } = useLoyalty();

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'like_product': 'Like produit',
      'comment_product': 'Commentaire',
      'share_product': 'Partage',
      'follow_user': 'Suivi utilisateur',
      'create_product': 'Création produit'
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      'like_product': '❤️',
      'comment_product': '💬',
      'share_product': '📤',
      'follow_user': '👥',
      'create_product': '📦'
    };
    return icons[action] || '⭐';
  };

  const totalPoints = transactions.reduce((sum, tx) => sum + tx.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="btn-floating"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Points de Fidélité</h1>
            <p className="text-surface-600">Votre historique et vos récompenses</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total Points */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">{user?.loyalty_points || 0}</h3>
            <p className="text-surface-600">Points totaux</p>
          </div>

          {/* Points Gagnés */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">{totalPoints}</h3>
            <p className="text-surface-600">Points gagnés</p>
          </div>

          {/* Activités */}
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">{transactions.length}</h3>
            <p className="text-surface-600">Activités</p>
          </div>
        </motion.div>

        {/* Badge Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Votre Badge</h2>
          <div className="flex items-center justify-center">
            <LoyaltyBadge points={user?.loyalty_points} />
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h2 className="text-xl font-semibold text-surface-900 mb-6">Historique des Points</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <p className="text-surface-600">Aucune activité pour le moment</p>
              <p className="text-sm text-surface-500 mt-2">
                Commencez à interagir avec les produits pour gagner des points !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{getActionIcon(transaction.action)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">
                        {getActionLabel(transaction.action)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-surface-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(transaction.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      +{transaction.points} pts
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-surface-900 mb-6">Comment gagner des points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-semibold text-surface-900">Liker un produit</p>
                <p className="text-sm text-surface-600">+1 point</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-surface-900">Commenter</p>
                <p className="text-sm text-surface-600">+3 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <span className="text-2xl">📤</span>
              <div>
                <p className="font-semibold text-surface-900">Partager</p>
                <p className="text-sm text-surface-600">+5 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold text-surface-900">Suivre un utilisateur</p>
                <p className="text-sm text-surface-600">+2 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-surface-900">Créer un produit</p>
                <p className="text-sm text-surface-600">+20 points</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
