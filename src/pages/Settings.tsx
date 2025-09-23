import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Shield,
  ShieldOff,
  Moon,
  Sun,
  User,
  Mail,
  Lock,
  LogOut,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface UserSettings {
  autoPlay: boolean;
  notifications: boolean;
  darkMode: boolean;
  privacyMode: boolean;
  emailNotifications: boolean;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    autoPlay: true,
    notifications: true,
    darkMode: false,
    privacyMode: false,
    emailNotifications: true
  });
  const [loading, setLoading] = useState(false);

  // Charger les paramètres depuis le localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = {
        autoPlay: localStorage.getItem('video-autoplay') !== 'false',
        notifications: localStorage.getItem('notifications') !== 'false',
        darkMode: localStorage.getItem('dark-mode') === 'true',
        privacyMode: localStorage.getItem('privacy-mode') === 'true',
        emailNotifications: localStorage.getItem('email-notifications') !== 'false'
      };
      setSettings(savedSettings);
    };

    loadSettings();
  }, []);

  // Sauvegarder un paramètre
  const updateSetting = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Sauvegarder dans localStorage
    switch (key) {
      case 'autoPlay':
        localStorage.setItem('video-autoplay', value.toString());
        break;
      case 'notifications':
        localStorage.setItem('notifications', value.toString());
        break;
      case 'darkMode':
        localStorage.setItem('dark-mode', value.toString());
        break;
      case 'privacyMode':
        localStorage.setItem('privacy-mode', value.toString());
        break;
      case 'emailNotifications':
        localStorage.setItem('email-notifications', value.toString());
        break;
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const SettingToggle = ({ 
    icon: Icon, 
    title, 
    description, 
    value, 
    onChange, 
    iconColor = "text-primary-600" 
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
    iconColor?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900">{title}</h3>
          <p className="text-sm text-surface-600">{description}</p>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!value)}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
          value ? 'bg-primary-600' : 'bg-surface-300'
        }`}
      >
        <motion.div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center ${
            value ? 'right-1' : 'left-1'
          }`}
          animate={{ x: value ? 0 : -24 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {value ? (
            <Check className="w-4 h-4 text-primary-600" />
          ) : (
            <X className="w-4 h-4 text-surface-500" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 surface-glass border-b border-surface-200"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-surface-100 rounded-2xl flex items-center justify-center hover:bg-surface-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-surface-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Paramètres</h1>
              <p className="text-surface-600">Personnalisez votre expérience</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profil utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">{user?.username || 'Utilisateur'}</h2>
              <p className="text-surface-600">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Paramètres de lecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-surface-900 px-2">Lecture vidéo</h3>
          
          <SettingToggle
            icon={Play}
            title="Lecture automatique"
            description="Les vidéos se lancent automatiquement lors du scroll"
            value={settings.autoPlay}
            onChange={(value) => updateSetting('autoPlay', value)}
          />
        </motion.div>

        {/* Paramètres de notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-surface-900 px-2">Notifications</h3>
          
          <SettingToggle
            icon={Bell}
            title="Notifications push"
            description="Recevoir des notifications sur votre appareil"
            value={settings.notifications}
            onChange={(value) => updateSetting('notifications', value)}
            iconColor="text-blue-600"
          />
          
          <SettingToggle
            icon={Mail}
            title="Notifications email"
            description="Recevoir des notifications par email"
            value={settings.emailNotifications}
            onChange={(value) => updateSetting('emailNotifications', value)}
            iconColor="text-green-600"
          />
        </motion.div>

        {/* Paramètres d'apparence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-surface-900 px-2">Apparence</h3>
          
          <SettingToggle
            icon={Moon}
            title="Mode sombre"
            description="Interface en mode sombre"
            value={settings.darkMode}
            onChange={(value) => updateSetting('darkMode', value)}
            iconColor="text-purple-600"
          />
        </motion.div>

        {/* Paramètres de confidentialité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-surface-900 px-2">Confidentialité</h3>
          
          <SettingToggle
            icon={Shield}
            title="Mode privé"
            description="Masquer votre activité aux autres utilisateurs"
            value={settings.privacyMode}
            onChange={(value) => updateSetting('privacyMode', value)}
            iconColor="text-orange-600"
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-surface-900 px-2">Compte</h3>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            disabled={loading}
            className="w-full card p-6 flex items-center justify-between hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-600">Se déconnecter</h3>
                <p className="text-sm text-surface-600">Fermer votre session</p>
              </div>
            </div>
            {loading && (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
