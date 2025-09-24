import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  imageUrl: string;
  productId: string;
  productName: string;
  isPlaying: boolean;
  isMuted: boolean;
  autoPlay: boolean;
  playbackSpeed: number;
  showControls: boolean;
  isCurrentVideo: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlayPause: () => void;
  onToggleMute: () => void;
  onChangePlaybackSpeed: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  imageUrl,
  productId,
  productName,
  isPlaying,
  isMuted,
  autoPlay,
  playbackSpeed,
  showControls,
  isCurrentVideo,
  videoRef,
  onPlay,
  onPause,
  onTogglePlayPause,
  onToggleMute,
  onChangePlaybackSpeed,
  onTouchStart,
  onTouchEnd,
}) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {videoUrl ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay={autoPlay && isCurrentVideo}
            muted={isMuted}
            loop
            playsInline
            onPlay={onPlay}
            onPause={onPause}
          />
          
          {/* Compact Video Controls Overlay */}
          <AnimatePresence>
            {(showControls || !autoPlay) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto z-20"
              >
                {/* Compact Play/Pause Button */}
                <div className="flex flex-col items-center space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onTogglePlayPause}
                    className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl pointer-events-auto z-30"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.button>
                  
                  {/* Compact Secondary Controls */}
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onToggleMute}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pointer-events-auto z-30"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onChangePlaybackSpeed}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xs pointer-events-auto z-30"
                    >
                      {playbackSpeed}x
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      
      {/* Enhanced gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    </div>
  );
};
