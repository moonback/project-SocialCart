import React, { useState } from 'react';
import { 
  Settings, 
  Heart, 
  Package, 
  Star, 
  LogOut, 
  Edit, 
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  UserPlus,
  Share2,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileImageUploader } from '../components/ProfileImageUploader';
import { UserStories } from '../components/UserStories';
import { StoryStats } from '../components/StoryStats';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    profile, 
    stats, 
    orders, 
    favorites, 
    achievements, 
    favoriteCategories,
    loading,
    updateProfile
  } = useProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirection vers la landing page
      window.location.href = '/landing';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-surface-50 relative overflow-hidden">
      {/* Background decoration - Design minimaliste */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header Hero */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-blue-600 to-primary-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-4 py-6 mobile-safe-area-top">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="relative">
                  <ProfileImageUploader
                    currentImageUrl={profile?.avatar_url || user?.avatar_url || undefined}
                    onImageChange={(url) => {
                      if (profile && url) {
                        updateProfile({ avatar_url: url });
                      }
                    }}
                    userId={user.id}
                  />
                  {/* Badge de vérification */}
                  {profile?.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profile Info - Layout amélioré pour desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white w-full"
              >
                {/* Layout desktop en 2 colonnes */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
                  
                  {/* Colonne gauche - Informations principales */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-display text-gradient">
                          {profile?.full_name || `@${user.username}`}
                        </h1>
                        <p className="text-white/80 text-base mb-2">@{user.username}</p>
                        {profile?.bio && (
                          <p className="text-white/90 text-sm lg:text-base mb-4 max-w-md lg:max-w-none leading-relaxed">{profile.bio}</p>
                        )}
                        
                        {/* Infos rapides - Layout amélioré */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center lg:items-start gap-3 lg:gap-4 text-sm">
                          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{profile?.loyalty_points || 0} pts</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className="text-white/80">Depuis {new Date(profile?.created_at || user.created_at).getFullYear()}</span>
                          </div>
                          {profile?.location && (
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                              <MapPin className="w-4 h-4" />
                              <span className="text-white/80">{profile.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/settings')}
                          className="btn-floating px-6 py-3 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Paramètres</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-floating p-3"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Statistiques détaillées */}
                  <div className="lg:w-80 xl:w-96">
                    {/* Statistiques compactes */}
                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 xl:grid-cols-3 lg:gap-3">
                      <div className="bg-white/10 rounded-xl p-3 text-center border border-white/15">
                        <div className="text-lg font-bold">{stats.followers}</div>
                        <div className="text-xs text-white/70">Abonnés</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center border border-white/15">
                        <div className="text-lg font-bold">{stats.following}</div>
                        <div className="text-xs text-white/70">Abonnements</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center border border-white/15">
                        <div className="text-lg font-bold">{stats.reviews}</div>
                        <div className="text-xs text-white/70">Avis</div>
                      </div>
                    </div>
                    {/* Statistiques supplémentaires (desktop) */}
                    <div className="hidden lg:grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-white/10 rounded-xl p-3 border border-white/15 flex flex-col items-center">
                        <div className="flex items-center gap-1 text-xs text-white/70 mb-1">
                          <Package className="w-4 h-4 text-white/60" />
                          <span>Commandes</span>
                        </div>
                        <div className="text-lg font-bold">{stats.totalOrders}</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/15 flex flex-col items-center">
                        <div className="flex items-center gap-1 text-xs text-white/70 mb-1">
                          <TrendingUp className="w-4 h-4 text-white/60" />
                          <span>Dépensé</span>
                        </div>
                        <div className="text-lg font-bold">{formatCurrency(stats.totalSpent)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Design glassmorphism amélioré */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/20 shadow-glass">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide py-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-shrink-0 px-4 py-3 mx-1 flex items-center space-x-2 relative transition-all duration-200 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center space-x-2 ${
                  activeTab === id ? 'text-blue-700' : 'text-surface-600'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm whitespace-nowrap">{label}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24 relative z-10 mobile-safe-area">
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
              {/* Account Information - Layout amélioré pour desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-glass p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-surface-900">Informations du compte</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary px-4 py-2 flex items-center space-x-2 text-sm"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
                  </motion.button>
                </div>
                
                {/* Layout en 2 colonnes pour desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Colonne gauche - Informations de base */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <UserPlus className="w-3 h-3 text-white" />
                        </div>
                        <span>Informations personnelles</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Nom complet
                          </label>
                          <input
                            type="text"
                            value={isEditing ? editingFields.full_name : (profile?.full_name || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, full_name: e.target.value }))}
                            className="input w-full"
                            readOnly={!isEditing}
                            placeholder="Nom complet"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Nom d'utilisateur
                          </label>
                          <input
                            type="text"
                            value={user.username}
                            className="input w-full bg-surface-50"
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
                            className="input w-full bg-surface-50"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Localisation
                          </label>
                          <input
                            type="text"
                            value={isEditing ? editingFields.location : (profile?.location || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, location: e.target.value }))}
                            className="input w-full"
                            readOnly={!isEditing}
                            placeholder="Ville, pays"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={isEditing ? editingFields.bio : (profile?.bio || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, bio: e.target.value }))}
                            className="input w-full h-20 resize-none"
                            readOnly={!isEditing}
                            placeholder="À propos de vous..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Informations supplémentaires */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <span>Statistiques & Réseaux</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Points de fidélité
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={(profile?.loyalty_points || 0).toLocaleString()}
                              className="input w-full bg-surface-50"
                              readOnly
                            />
                            <Star className="w-5 h-5 text-yellow-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Membre depuis
                          </label>
                          <input
                            type="text"
                            value={formatDate(profile?.created_at || user.created_at)}
                            className="input w-full bg-surface-50"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Site web
                          </label>
                          <input
                            type="url"
                            value={isEditing ? editingFields.website_url : (profile?.website_url || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, website_url: e.target.value }))}
                            className="input w-full"
                            readOnly={!isEditing}
                            placeholder="https://site.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            Instagram
                          </label>
                          <input
                            type="text"
                            value={isEditing ? editingFields.instagram_handle : (profile?.instagram_handle || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, instagram_handle: e.target.value }))}
                            className="input w-full"
                            readOnly={!isEditing}
                            placeholder="@instagram"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-surface-700 mb-2">
                            TikTok
                          </label>
                          <input
                            type="text"
                            value={isEditing ? editingFields.tiktok_handle : (profile?.tiktok_handle || '')}
                            onChange={e => setEditingFields(prev => ({ ...prev, tiktok_handle: e.target.value }))}
                            className="input w-full"
                            readOnly={!isEditing}
                            placeholder="@tiktok"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-center lg:justify-end space-x-3 mt-8 pt-6 border-t border-surface-200">
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="card-glass p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-surface-900 mb-1">{stats.totalOrders}</div>
                  <div className="text-sm text-surface-600">Commandes</div>
                </div>

                <div className="card-glass p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-bold text-surface-900 mb-1">{formatCurrency(stats.totalSpent)}</div>
                  <div className="text-sm text-surface-600">Total dépensé</div>
                </div>

                <div className="card-glass p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-surface-900 mb-1">{stats.reviews}</div>
                  <div className="text-sm text-surface-600">Avis laissés</div>
                </div>

                <div className="card-glass p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-surface-900 mb-1">{stats.productsLiked}</div>
                  <div className="text-sm text-surface-600">Produits likés</div>
                </div>
              </motion.div>

              {/* Favorite Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-glass p-6"
              >
                <h3 className="text-lg font-bold text-surface-900 mb-4">Catégories préférées</h3>
                {favoriteCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {favoriteCategories.map((category, index) => (
                      <motion.span
                        key={category}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-sm"
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
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/settings')}
                  className="btn-primary w-full flex items-center justify-center space-x-2 py-4"
                >
                  <Settings className="w-5 h-5" />
                  <span>Paramètres du compte</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="btn-secondary w-full flex items-center justify-center space-x-2 py-4 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Se déconnecter</span>
                </motion.button>
              </motion.div>

              {/* Stories Section - Seulement pour les vendeurs */}
              {profile?.is_seller && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {/* Statistiques des Stories */}
                  <StoryStats 
                    userId={user?.id || ''} 
                    isOwnProfile={true} 
                  />

                  {/* Stories de l'utilisateur */}
                  <UserStories 
                    userId={user?.id || ''} 
                    isOwnProfile={true} 
                  />
                </motion.div>
              )}
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
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-500"></div>
                      <p className="text-surface-500 text-sm">Chargement...</p>
                    </div>
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
                    className="card-glass p-6 hover:shadow-glass transition-all duration-300"
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
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-500"></div>
                      <p className="text-surface-500 text-sm">Chargement...</p>
                    </div>
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
                    className="card-glass overflow-hidden hover:shadow-glass transition-all duration-300 group"
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
              <div className="card-glass p-6 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border border-yellow-200/50">
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
                  <div className="col-span-full flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-500"></div>
                      <p className="text-surface-500 text-sm">Chargement...</p>
                    </div>
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
                    className={`card-glass p-6 relative overflow-hidden ${
                      achievement.earned 
                        ? 'border-2 border-yellow-200/50 bg-gradient-to-br from-yellow-50/80 to-orange-50/80' 
                        : 'border-2 border-surface-200/50'
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
                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span>Succès récents</span>
                  </h3>
                  <div className="space-y-3">
                    {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
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
                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span>Prochains objectifs</span>
                  </h3>
                  <div className="space-y-3">
                    {achievements.filter(a => !a.earned).slice(0, 3).map((achievement) => (
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