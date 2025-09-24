import { useCallback, useRef } from 'react';

interface UseVideoFeedScrollProps {
  onIndexChange: (index: number) => void;
}

export function useVideoFeedScroll({ onIndexChange }: UseVideoFeedScrollProps) {
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback((containerRef: React.RefObject<HTMLDivElement>) => {
    // Throttling pour éviter les re-renders excessifs
    if (throttleTimeoutRef.current) {
      return;
    }

    throttleTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const itemHeight = containerRef.current.clientHeight;
        const newIndex = Math.round(scrollTop / itemHeight);
        onIndexChange(newIndex);
      }
      throttleTimeoutRef.current = null;
    }, 200); // Throttle de 200ms
  }, [onIndexChange]);

  const cleanup = useCallback(() => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current);
    }
  }, []);

  return {
    handleScroll,
    cleanup,
  };
}
