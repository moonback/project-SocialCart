import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Clock, 
  TrendingUp, 
  Users, 
  Eye,
  Heart,
  MessageCircle,
  ArrowUp,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';
import { useStories } from '../hooks/useStories';
import { StoriesGrid } from '../components/StoriesGrid';
import { StoryCreator } from '../components/StoryCreator';
import { ProductStory } from '../lib/stories';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Stories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stories, loading, loadStories } = useStories();
  const [showCreator, setShowCreator] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'text' | 'poll' | 'quiz'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = stories.filter(story => {
    const matchesType = filterType === 'all' || story.type === filterType;
    const matchesSearch = searchQuery === '' || 
      story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.seller?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const handleStoryCreated = (story: ProductStory) => {
    setShowCreator(false);
    loadStories(); // Recharger les stories
    toast.success('Story publiée avec succès !');
  };

  const handleSwipeUp = (story: ProductStory) => {
    if (story.product) {
      navigate(`/product/${story.product.id}`);
    }
  };

  const getTotalStats = () => {
    const totalViews = stories.reduce((sum, story) => sum + story.views_count, 0);
    const totalInteractions = stories.reduce((sum, story) => sum + story.interactions_count, 0);
    const activeStories = stories.filter(story => {
      const expiresAt = new Date(story.expires_at);
      return expiresAt > new Date();
    }).length;

    return { totalViews, totalInteractions, activeStories };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Chargement des stories</h2>
            <p className="text-gray-600">Récupération des dernières stories...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stories Produits</h1>
                <p className="text-sm text-gray-600">Découvrez les dernières stories de la communauté</p>
              </div>
            </div>
            
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreator(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Créer une Story</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Vues totales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInteractions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Interactions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStories}</p>
                <p className="text-sm text-gray-600">Stories actives</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Filtre par type */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="image">Images</option>
                  <option value="video">Vidéos</option>
                  <option value="text">Texte</option>
                  <option value="poll">Sondages</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              
              {/* Mode d'affichage */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || filterType !== 'all' ? 'Aucune story trouvée' : 'Aucune story disponible'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterType !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche' 
                  : 'Soyez le premier à créer une story !'
                }
              </p>
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreator(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Créer la première Story
                </motion.button>
              )}
            </div>
          ) : (
            <StoriesGrid
              stories={filteredStories}
              onSwipeUp={handleSwipeUp}
            />
          )}
        </motion.div>
      </div>

      {/* Créateur de stories */}
      {showCreator && (
        <StoryCreator
          onClose={() => setShowCreator(false)}
          onStoryCreated={handleStoryCreated}
        />
      )}
    </div>
  );
}
