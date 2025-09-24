import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon,
  Video,
  AlertCircle,
  CheckCircle,
  Loader,
  Sparkles
} from 'lucide-react';

interface MediaUploaderProps {
  onFilesChange: (files: File[]) => void;
  onVideoChange: (video: File | null) => void;
  onAnalyzeImages?: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  acceptedVideoTypes?: string[];
  error?: string;
  className?: string;
}

export function MediaUploader({
  onFilesChange,
  onVideoChange,
  onAnalyzeImages,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  acceptedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  error,
  className = ''
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Types acceptés: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Fichier trop volumineux. Taille maximum: ${maxFileSize}MB`;
    }
    
    return null;
  };

  const validateVideoFile = (file: File): string | null => {
    if (!acceptedVideoTypes.includes(file.type)) {
      return `Type de fichier vidéo non supporté. Types acceptés: ${acceptedVideoTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Fichier vidéo trop volumineux. Taille maximum: ${maxFileSize}MB`;
    }
    
    return null;
  };

  const handleFileUpload = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (validFiles.length < maxFiles) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: Limite de ${maxFiles} fichiers atteinte`);
      }
    });

    if (errors.length > 0) {
      console.warn('Erreurs de validation:', errors);
    }

    if (validFiles.length > 0) {
      const newFilesArray = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(newFilesArray);
      onFilesChange(newFilesArray);

      // Créer les URLs de prévisualisation
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange]);

  const handleVideoUpload = useCallback((file: File | null) => {
    if (!file) return;

    const error = validateVideoFile(file);
    if (error) {
      console.warn('Erreur de validation vidéo:', error);
      return;
    }

    setVideo(file);
    onVideoChange(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  }, [maxFileSize, onVideoChange, acceptedVideoTypes]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    onFilesChange(newFiles);
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreviewUrl(null);
    onVideoChange(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Video Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-surface-700">
          Vidéo principale (optionnel)
        </label>
        
        {!videoPreviewUrl ? (
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-surface-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer"
          >
            <Video className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <p className="text-surface-600 font-medium">Cliquez pour ajouter une vidéo</p>
            <p className="text-surface-500 text-sm mt-1">MP4, MOV, AVI jusqu'à {maxFileSize}MB</p>
          </div>
        ) : (
          <div className="relative group">
            <video
              className="w-full h-64 object-cover rounded-2xl"
              src={videoPreviewUrl}
              muted={isVideoMuted}
              controls={false}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  {isVideoPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  {isVideoMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              </div>
            </div>
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
          onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-surface-700">
          Images du produit
        </label>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-primary-400 bg-primary-50/50' 
              : 'border-surface-300 hover:border-primary-400 hover:bg-primary-50/50'
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${
            isDragging ? 'text-primary-500' : 'text-surface-400'
          }`} />
          <p className={`font-medium transition-colors ${
            isDragging ? 'text-primary-600' : 'text-surface-600'
          }`}>
            {isDragging ? 'Déposez vos images ici' : 'Cliquez ou glissez-déposez vos images'}
          </p>
          <p className="text-surface-500 text-sm mt-1">
            JPG, PNG, WebP jusqu'à {maxFileSize}MB par image (max {maxFiles})
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />

        {/* Image Previews */}
        <AnimatePresence>
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Upload Progress Indicator */}
                  {uploadProgress[files[index]?.name] && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* File Info */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}</span>
            </div>
            
            {/* Analyse IA Button */}
            {onAnalyzeImages && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnalyzeImages(files)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Analyser avec l'IA</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
