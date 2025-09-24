import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PopularStories } from '../components/PopularStories';
import { TrendingUp, Users, Star, Clock } from 'lucide-react';

export default function Discover() {
  const [activeTab, setActiveTab] = useState<'stories' | 'trending' | 'new'>('stories');

  const tabs = [
    { id: 'stories', label: 'Stories populaires', icon: TrendingUp },
    { id: 'trending', label: 'Tendances', icon: Star },
    { id: 'new', label: 'Nouveautés', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Découvrir</h1>
              <p className="text-gray-600 text-sm">Explorez les contenus populaires</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Communauté active</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Stories populaires
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Découvrez les stories les plus engagées de notre communauté
                </p>
              </div>

              <PopularStories limit={12} showHeader={false} />
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Tendances du moment
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les contenus qui font le buzz en ce moment
                </p>
              </div>

              {/* Placeholder pour les tendances */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Contenu tendance #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Description du contenu tendance qui attire l'attention
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">🔥 En tendance</span>
                      <span className="text-primary-600 font-medium">+{Math.floor(Math.random() * 1000)} vues</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Nouveautés
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les derniers contenus publiés par notre communauté
                </p>
              </div>

              {/* Placeholder pour les nouveautés */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Nouveau contenu #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Découvrez ce nouveau contenu fraîchement publié
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">🆕 Nouveau</span>
                      <span className="text-green-600 font-medium">Il y a {Math.floor(Math.random() * 60)} min</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
