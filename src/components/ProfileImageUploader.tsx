import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  userId: string;
  className?: string;
}

export function ProfileImageUploader({
  currentImageUrl,
  onImageChange,
  userId,
  className = ''
}: ProfileImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const validateFile = (file: File): string | null => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!acceptedTypes.includes(file.type)) {
      return 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP.';
    }
    
    if (file.size > maxSize) {
      return 'Fichier trop volumineux. Taille maximum: 5MB';
    }
    
    return null;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Upload vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Erreur d'upload: ${uploadError.message}`);
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const updateUserProfile = async (imageUrl: string) => {
    const { error } = await supabase
      .from('users')
      .update({ avatar_url: imageUrl })
      .eq('id', userId);

    if (error) {
      throw new Error(`Erreur de mise à jour: ${error.message}`);
    }
  };

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validation
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Créer l'URL de prévisualisation
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload de l'image
      const uploadedImageUrl = await uploadImage(file);

      // Mettre à jour le profil utilisateur
      await updateUserProfile(uploadedImageUrl);

      // Notifier le parent
      onImageChange(uploadedImageUrl);

      // Nettoyer l'URL de prévisualisation après un délai
      setTimeout(() => {
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);
      }, 2000);

    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  }, [userId, onImageChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className={`relative ${className}`}>
      {/* Image Container */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-3xl overflow-hidden border-4 border-white/30 shadow-glow cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <img
          src={displayImage || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop&crop=face`}
          alt="Photo de profil"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <AnimatePresence>
          {(isHovered || isUploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              {isUploading ? (
                <div className="text-center text-white">
                  <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Upload...</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Changer</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Indicator */}
        <AnimatePresence>
          {previewUrl && !isUploading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Camera Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        disabled={isUploading}
        className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-large flex items-center justify-center hover:bg-surface-50 transition-colors disabled:opacity-50"
      >
        <Camera className="w-5 h-5 text-surface-600" />
      </motion.button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2 min-w-max"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
