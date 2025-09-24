import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'stories-media';
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  /**
   * Valide un fichier avant l'upload
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    // Vérifier la taille
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Le fichier ne doit pas dépasser ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Vérifier le type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Type de fichier non supporté. Utilisez des images (JPEG, PNG, WebP, GIF) ou des vidéos (MP4, WebM, QuickTime)'
      };
    }

    return { valid: true };
  }

  /**
   * Génère un nom de fichier unique
   */
  private static generateFileName(file: File, userId: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'bin';
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Upload un fichier vers Supabase Storage
   */
  static async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    // Validation
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Obtenir l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Générer le nom de fichier
    const fileName = this.generateFileName(file, user.id);

    // Upload avec suivi de progression
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw new Error(`Erreur lors de l'upload: ${error.message}`);
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      size: file.size,
      type: file.type
    };
  }

  /**
   * Upload multiple files
   */
  static async uploadFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadFile(file, (progress) => {
          onProgress?.(i, progress);
        });
        results.push(result);
      } catch (error) {
        console.error(`Erreur lors de l'upload du fichier ${i + 1}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Supprime un fichier du storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  /**
   * Supprime plusieurs fichiers
   */
  static async deleteFiles(filePaths: string[]): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove(filePaths);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  /**
   * Obtient l'URL publique d'un fichier
   */
  static getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Vérifie si un fichier existe
   */
  static async fileExists(filePath: string): Promise<boolean> {
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    return !error && data && data.length > 0;
  }

  /**
   * Obtient les métadonnées d'un fichier
   */
  static async getFileMetadata(filePath: string): Promise<{
    size: number;
    type: string;
    lastModified: string;
  } | null> {
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    const file = data[0];
    return {
      size: file.metadata?.size || 0,
      type: file.metadata?.mimetype || 'application/octet-stream',
      lastModified: file.updated_at || file.created_at
    };
  }

  /**
   * Compresse une image (utilise un service externe si disponible)
   */
  static async compressImage(
    file: File,
    quality: number = 80,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Erreur lors de la compression'));
            }
          },
          file.type,
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Génère un aperçu d'une vidéo
   */
  static async generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        reject(new Error('Le fichier n\'est pas une vidéo'));
        return;
      }

      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = 180;
        
        // Prendre une capture à 1 seconde
        video.currentTime = 1;
      };

      video.onseeked = () => {
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
      };

      video.onerror = () => reject(new Error('Erreur lors du chargement de la vidéo'));
      
      video.src = URL.createObjectURL(file);
      video.load();
    });
  }

  /**
   * Obtient les statistiques d'utilisation du storage
   */
  static async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    usedSpace: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(user.id);

    if (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }

    const files = data || [];
    const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);

    return {
      totalFiles: files.length,
      totalSize,
      usedSpace: totalSize
    };
  }
}
