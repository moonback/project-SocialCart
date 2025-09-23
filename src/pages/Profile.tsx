import React, { useState } from 'react';
import { 
  Settings, 
  Heart, 
  Package, 
  Star, 
  LogOut, 
  Edit, 
  Camera,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  UserPlus,
  Share2,
  MoreVertical,
  Check,
  X,
  Plus,
  ShoppingCart,
  Eye,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileImageUploader } from '../components/ProfileImageUploader';
import { UserAvatar } from '../components/UserAvatar';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, signOut } = useAuth();
  const { 
    profile, 
    stats, 
    orders, 
    favorites, 
    achievements, 
    favoriteCategories,
    loading,
    error,
    updateProfile,
    refreshProfile
  } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.showOrders ? 'orders' : 'profile'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingFields, setEditingFields] = useState({
    full_name: '',
    bio: '',
    location: '',
    website_url: '',
    instagram_handle: '',
    tiktok_handle: ''
  });

  // Initialiser les champs d'édition avec les données du profil
  React.useEffect(() => {
    if (profile) {
      setEditingFields({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        instagram_handle: profile.instagram_handle || '',
        tiktok_handle: profile.tiktok_handle || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editingFields);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditingFields({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        instagram_handle: profile.instagram_handle || '',
        tiktok_handle: profile.tiktok_handle || ''
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 p-8"
        >
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">Connexion requise</h2>
            <p className="text-surface-600">Connectez-vous pour accéder à votre profil</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
            className="btn-primary px-8 py-3"
          >
            Se connecter
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: Edit },
    { id: 'orders', label: 'Commandes', icon: Package },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'achievements', label: 'Succès', icon: Award },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'Livré';
      case 'shipped': return 'Expédié';
      case 'processing': return 'En cours';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Header Hero */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <ProfileImageUploader
                  currentImageUrl={profile?.avatar_url || user?.avatar_url}
                  onImageChange={(url) => {
                    if (profile) {
                      updateProfile({ avatar_url: url });
                    }
                  }}
                  userId={user.id}
                />
              </motion.div>

              {/* Profile Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 text-center md:text-left text-white"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {profile?.full_name || `@${user.username}`}
                    </h1>
                    <p className="text-white/80 text-lg mb-2">{user.email}</p>
                    {profile?.bio && (
                      <p className="text-white/90 text-sm mb-4 max-w-md">{profile.bio}</p>
                    )}
                    <div className="flex items-center justify-center md:justify-start space-x-6">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{profile?.loyalty_points || 0} points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-white/80">Membre depuis {formatDate(profile?.created_at || user.created_at)}</span>
                      </div>
                      {profile?.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5" />
                          <span className="text-white/80">{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
                      <span>Paramètres</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto md:mx-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.followers}</div>
                    <div className="text-sm text-white/80">Abonnés</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.following}</div>
                    <div className="text-sm text-white/80">Abonnements</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.reviews}</div>
                    <div className="text-sm text-white/80">Avis</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-surface-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(({ id, label, icon: Icon }) => (
              <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 px-6 py-4 flex items-center space-x-2 relative transition-colors ${
                activeTab === id
                    ? 'text-primary-600'
                    : 'text-surface-600 hover:text-surface-900'
              }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
                {activeTab === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Account Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-surface-900">Informations du compte</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary px-4 py-2 flex items-center space-x-2"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editingFields.full_name : (profile?.full_name || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, full_name: e.target.value }))}
                      className="input w-full"
                      readOnly={!isEditing}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      value={user.username}
                      className="input w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="input w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Date d'inscription
                    </label>
                    <input
                      type="text"
                      value={formatDate(profile?.created_at || user.created_at)}
                      className="input w-full"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Points de fidélité
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={(profile?.loyalty_points || 0).toLocaleString()}
                        className="input w-full"
                        readOnly
                      />
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editingFields.location : (profile?.location || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, location: e.target.value }))}
                      className="input w-full"
                      readOnly={!isEditing}
                      placeholder="Votre ville, pays"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={isEditing ? editingFields.bio : (profile?.bio || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, bio: e.target.value }))}
                      className="input w-full h-24 resize-none"
                      readOnly={!isEditing}
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Site web
                    </label>
                    <input
                      type="url"
                      value={isEditing ? editingFields.website_url : (profile?.website_url || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, website_url: e.target.value }))}
                      className="input w-full"
                      readOnly={!isEditing}
                      placeholder="https://votre-site.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editingFields.instagram_handle : (profile?.instagram_handle || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, instagram_handle: e.target.value }))}
                      className="input w-full"
                      readOnly={!isEditing}
                      placeholder="@votre_instagram"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      TikTok
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editingFields.tiktok_handle : (profile?.tiktok_handle || '')}
                      onChange={(e) => setEditingFields(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                      className="input w-full"
                      readOnly={!isEditing}
                      placeholder="@votre_tiktok"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-surface-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      className="btn-primary px-6 py-2 flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancelEdit}
                      className="btn-secondary px-6 py-2 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Annuler</span>
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Detailed Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-surface-900 mb-2">{stats.totalOrders}</div>
                  <div className="text-surface-600">Commandes</div>
                </div>

                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-surface-900 mb-2">{formatCurrency(stats.totalSpent)}</div>
                  <div className="text-surface-600">Total dépensé</div>
                </div>

                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-surface-900 mb-2">{stats.reviews}</div>
                  <div className="text-surface-600">Avis laissés</div>
                </div>

                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-surface-900 mb-2">{stats.productsLiked}</div>
                  <div className="text-surface-600">Produits likés</div>
                </div>
              </motion.div>

              {/* Favorite Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-surface-900 mb-4">Catégories préférées</h3>
                {favoriteCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {favoriteCategories.map((category, index) => (
                      <motion.span
                        key={category}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-medium"
                      >
                        {category}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-surface-500 italic">Aucune catégorie préférée pour le moment</p>
                )}
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/settings')}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={signOut}
                  className="btn-secondary flex-1 flex items-center justify-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Se déconnecter</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900">Mes commandes</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-4 py-2 flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Suivre toutes</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Aucune commande</h3>
                    <p className="text-surface-600 mb-4">Vous n'avez pas encore passé de commande</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/')}
                      className="btn-primary px-6 py-2"
                    >
                      Découvrir nos produits
                    </motion.button>
                  </div>
                ) : (
                  orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover:shadow-large transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-surface-900 mb-1">Commande #{order.order_number}</h3>
                        <div className="flex items-center space-x-4 text-sm text-surface-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 md:mt-0">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-surface-600" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-surface-50 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-surface-900">{item.product_name}</p>
                            <p className="text-sm text-surface-600">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-surface-900">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-surface-200">
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <span className="text-xl font-bold text-surface-900">{formatCurrency(order.total_amount)}</span>
                        <span className="text-sm text-surface-600">• {order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          Voir détails
                        </motion.button>
                        {order.status === 'delivered' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Commander à nouveau
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900">Mes favoris</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-4 py-2 flex items-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Tout voir</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <Heart className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Aucun favori</h3>
                    <p className="text-surface-600 mb-4">Vous n'avez pas encore ajouté de produits à vos favoris</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/')}
                      className="btn-primary px-6 py-2"
                    >
                      Découvrir nos produits
                    </motion.button>
                  </div>
                ) : (
                  favorites.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card overflow-hidden hover:shadow-large transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.primary_image_url || item.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </motion.button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-surface-900 mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-surface-900">{item.rating_average || 0}</span>
                        </div>
                        <span className="text-sm text-surface-600">({item.rating_count || 0} avis)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary-600">{formatCurrency(item.price)}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/product/${item.id}`)}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Voir le produit
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-surface-900">Mes succès</h2>
                <div className="text-sm text-surface-600">
                  {achievements.filter(a => a.earned).length} / {achievements.length} débloqués
                </div>
              </div>

              {/* Résumé des succès */}
              <div className="card p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-surface-900 mb-1">Progression globale</h3>
                    <p className="text-sm text-surface-600 mb-3">
                      Vous avez débloqué {achievements.filter(a => a.earned).length} succès sur {achievements.length}
                    </p>
                    <div className="w-full bg-surface-200 rounded-full h-3">
                      <motion.div
                        className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(achievements.filter(a => a.earned).length / achievements.length) * 100}%` 
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-surface-600">
                      <span>0%</span>
                      <span className="font-semibold">
                        {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : achievements.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <Award className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Aucun succès</h3>
                    <p className="text-surface-600 mb-4">Commencez à utiliser l'application pour débloquer vos premiers succès !</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/')}
                      className="btn-primary px-6 py-2"
                    >
                      Découvrir les produits
                    </motion.button>
                  </div>
                ) : (
                  achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card p-6 relative overflow-hidden ${
                      achievement.earned 
                        ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' 
                        : 'border-2 border-surface-200'
                    }`}
                  >
                    {achievement.earned && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${
                          achievement.earned ? 'text-surface-900' : 'text-surface-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm mb-3 ${
                          achievement.earned ? 'text-surface-700' : 'text-surface-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {/* Barre de progression */}
                        {achievement.maxProgress && achievement.maxProgress > 1 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-surface-600 mb-1">
                              <span>Progression</span>
                              <span>{achievement.progress || 0} / {achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-surface-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  achievement.earned 
                                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                    : 'bg-gradient-to-r from-primary-400 to-primary-600'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${Math.min(((achievement.progress || 0) / achievement.maxProgress) * 100, 100)}%` 
                                }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Statut */}
                        <div className="flex items-center space-x-2">
                          {achievement.earned ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-green-600">Débloqué</span>
                              <div className="ml-auto">
                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-surface-400 rounded-full"></div>
                              <span className="text-sm font-medium text-surface-500">En cours</span>
                              {achievement.progress && achievement.maxProgress && (
                                <span className="text-xs text-surface-400 ml-auto">
                                  {Math.round(((achievement.progress || 0) / achievement.maxProgress) * 100)}%
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  ))
                )}
              </div>

              {/* Succès récents et prochains objectifs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Succès récents */}
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span>Succès récents</span>
                  </h3>
                  <div className="space-y-3">
                    {achievements.filter(a => a.earned).slice(0, 3).map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-surface-900 text-sm">{achievement.title}</h4>
                          <p className="text-xs text-surface-600">{achievement.description}</p>
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                    {achievements.filter(a => a.earned).length === 0 && (
                      <p className="text-surface-500 text-sm italic">Aucun succès débloqué pour le moment</p>
                    )}
                  </div>
                </div>

                {/* Prochains objectifs */}
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span>Prochains objectifs</span>
                  </h3>
                  <div className="space-y-3">
                    {achievements.filter(a => !a.earned).slice(0, 3).map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-surface-50 rounded-xl">
                        <div className="text-2xl grayscale opacity-50">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-surface-600 text-sm">{achievement.title}</h4>
                          <p className="text-xs text-surface-500">{achievement.description}</p>
                          {achievement.progress && achievement.maxProgress && (
                            <div className="mt-2">
                              <div className="w-full bg-surface-200 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 bg-primary-500 rounded-full"
                                  style={{ 
                                    width: `${Math.min(((achievement.progress || 0) / achievement.maxProgress) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-surface-500 mt-1">
                                <span>{achievement.progress || 0}</span>
                                <span>{achievement.maxProgress}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="w-6 h-6 bg-surface-300 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-surface-600" />
                        </div>
                      </div>
                    ))}
                    {achievements.filter(a => !a.earned).length === 0 && (
                      <p className="text-green-600 text-sm font-medium">🎉 Tous les succès sont débloqués !</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}