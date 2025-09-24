import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  autoPlay: boolean;
  playbackSpeed: number;
  showControls: boolean;
}

interface VideoPlayerActions {
  togglePlayPause: (productId: string) => void;
  toggleMute: (productId: string) => void;
  changePlaybackSpeed: () => void;
  setShowControls: (show: boolean) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  playVideo: (productId: string) => void;
  pauseAllVideos: () => void;
}

export function useVideoPlayer(): VideoPlayerState & VideoPlayerActions & {
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement | null }>;
} {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Charger le paramètre autoPlay depuis le localStorage
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('video-autoplay');
    if (savedAutoPlay !== null) {
      setAutoPlay(savedAutoPlay === 'true');
    }
  }, []);

  // Sauvegarder autoPlay dans localStorage
  useEffect(() => {
    localStorage.setItem('video-autoplay', autoPlay.toString());
  }, [autoPlay]);

  const togglePlayPause = useCallback((productId: string) => {
    const video = videoRefs.current[productId];
    if (video) {
      if (video.paused) {
        video.play().catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Erreur de lecture vidéo:', error);
          }
        });
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = useCallback((productId: string) => {
    const video = videoRefs.current[productId];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  }, []);

  const changePlaybackSpeed = useCallback(() => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    
    // Appliquer la vitesse à toutes les vidéos
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.playbackRate = newSpeed;
      }
    });
    
    toast.success(`Vitesse: ${newSpeed}x`);
  }, [playbackSpeed]);

  const playVideo = useCallback((productId: string) => {
    if (autoPlay) {
      const video = videoRefs.current[productId];
      if (video && video.paused) {
        video.play().catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Erreur de lecture vidéo:', error);
          }
        });
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
    }
  }, [autoPlay]);

  const pauseAllVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.pause();
      }
    });
  }, []);

  return {
    isPlaying,
    isMuted,
    autoPlay,
    playbackSpeed,
    showControls,
    videoRefs,
    togglePlayPause,
    toggleMute,
    changePlaybackSpeed,
    setShowControls,
    setAutoPlay,
    playVideo,
    pauseAllVideos,
  };
}
