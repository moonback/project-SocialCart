import React from 'react';

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const fallbackImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face';

export function UserAvatar({ 
  avatarUrl, 
  username, 
  size = 'md', 
  className = '',
  showFallback = true
}: UserAvatarProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (showFallback) {
      const target = e.target as HTMLImageElement;
      target.src = fallbackImage;
    }
  };

  const displayUrl = avatarUrl || (showFallback ? fallbackImage : '');

  return (
    <img
      src={displayUrl}
      alt={username ? `Photo de profil de ${username}` : 'Photo de profil'}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={handleImageError}
    />
  );
}

// Composant spécialisé pour les avatars dans les cartes de produits
export function ProductUserAvatar({ 
  avatarUrl, 
  username, 
  size = 'sm',
  className = ''
}: Omit<UserAvatarProps, 'showFallback'>) {
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border border-surface-200 ${className}`}>
      <UserAvatar 
        avatarUrl={avatarUrl} 
        username={username} 
        size={size}
        showFallback={true}
      />
    </div>
  );
}

// Composant spécialisé pour les avatars dans le header
export function HeaderUserAvatar({ 
  avatarUrl, 
  username, 
  size = 'md',
  className = ''
}: Omit<UserAvatarProps, 'showFallback'>) {
  return (
    <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors ${className}`}>
      <UserAvatar 
        avatarUrl={avatarUrl} 
        username={username} 
        size={size}
        showFallback={true}
      />
    </div>
  );
}
