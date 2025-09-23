import { useState, useCallback, useRef } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
  preventDefault?: boolean;
}

interface SwipeGestureReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  isSwipeActive: boolean;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  preventDefault = true,
}: SwipeGestureOptions = {}): SwipeGestureReturn {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const touchStartTime = useRef<number>(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.targetTouches[0];
    setTouchEnd(null);
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    touchStartTime.current = Date.now();
    setIsSwipeActive(true);
  }, [preventDefault]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.targetTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, [preventDefault]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setIsSwipeActive(false);
      return;
    }

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Vérifier que le swipe est principalement horizontal ou vertical
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    if (isHorizontalSwipe) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else if (isVerticalSwipe) {
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }

    setIsSwipeActive(false);
  }, [touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwipeActive,
  };
}

// Hook pour les gestures de pinch/zoom
export function usePinchGesture({
  onPinchStart,
  onPinchMove,
  onPinchEnd,
  minScale = 0.5,
  maxScale = 3,
}: {
  onPinchStart?: () => void;
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}) {
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const initialDistance = useRef<number>(0);
  const initialScale = useRef<number>(1);

  const getDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
      initialScale.current = scale;
      setIsPinching(true);
      onPinchStart?.();
    }
  }, [scale, onPinchStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      
      const currentDistance = getDistance(e.touches);
      const newScale = Math.max(
        minScale,
        Math.min(maxScale, (currentDistance / initialDistance.current) * initialScale.current)
      );
      
      setScale(newScale);
      onPinchMove?.(newScale);
    }
  }, [isPinching, minScale, maxScale, onPinchMove]);

  const onTouchEnd = useCallback(() => {
    if (isPinching) {
      setIsPinching(false);
      onPinchEnd?.(scale);
    }
  }, [isPinching, scale, onPinchEnd]);

  return {
    scale,
    isPinching,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Hook pour les micro-interactions
export function useMicroInteraction() {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const interactionProps = {
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => {
      setIsPressed(false);
      setIsHovered(false);
    },
    onMouseEnter: () => setIsHovered(true),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className: `transition-all duration-200 ${
      isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'
    } ${isFocused ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`,
  };

  return {
    isPressed,
    isHovered,
    isFocused,
    interactionProps,
  };
}
