'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MousePosition } from '@/types/landing';
import { magneticHover } from '@/lib/animations/effects';

/**
 * useMousePosition Hook
 * Feature: 002-engaging-landing-pages
 *
 * Tracks mouse position for magnetic hover effects and spotlight following.
 * Used by Hero spotlight and magnetic CTA buttons.
 *
 * @param options - Configuration options
 * @returns Mouse position and helper functions
 */
interface UseMousePositionOptions {
  /** Whether to track relative to an element or the entire window */
  trackWindow?: boolean;

  /** Whether the hook is enabled */
  enabled?: boolean;

  /** Smoothing factor (0-1, lower = smoother) */
  smoothing?: number;
}

interface UseMousePositionReturn {
  /** Current mouse position */
  position: MousePosition;

  /** Mouse position relative to an element's center */
  relativePosition: MousePosition;

  /** Ref to attach to the tracked element */
  ref: React.RefObject<HTMLElement | null>;

  /** Whether mouse is over the tracked element */
  isHovering: boolean;

  /** Calculate magnetic displacement for an element */
  getMagneticOffset: (
    maxDisplacement?: number
  ) => { x: number; y: number };

  /** Reset position to center */
  reset: () => void;
}

export function useMousePosition(
  options: UseMousePositionOptions = {}
): UseMousePositionReturn {
  const {
    trackWindow = false,
    enabled = true,
    smoothing = 0.1,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [relativePosition, setRelativePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState(false);

  // For smooth interpolation
  const targetPosition = useRef<MousePosition>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  // Smooth interpolation function
  const lerp = useCallback(
    (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    },
    []
  );

  // Animation loop for smooth position updates
  const animate = useCallback(() => {
    setPosition((prev) => {
      const newX = lerp(prev.x, targetPosition.current.x, smoothing);
      const newY = lerp(prev.y, targetPosition.current.y, smoothing);

      // Stop animating if close enough
      if (
        Math.abs(newX - targetPosition.current.x) < 0.1 &&
        Math.abs(newY - targetPosition.current.y) < 0.1
      ) {
        return targetPosition.current;
      }

      return { x: newX, y: newY };
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [lerp, smoothing]);

  // Calculate relative position to element center
  const calculateRelativePosition = useCallback(
    (clientX: number, clientY: number): MousePosition => {
      if (!ref.current) return { x: 0, y: 0 };

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      return {
        x: clientX - centerX,
        y: clientY - centerY,
      };
    },
    []
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      const { clientX, clientY } = event;

      if (trackWindow) {
        targetPosition.current = { x: clientX, y: clientY };
      } else if (ref.current) {
        const relative = calculateRelativePosition(clientX, clientY);
        setRelativePosition(relative);
        targetPosition.current = { x: clientX, y: clientY };
      }
    },
    [enabled, trackWindow, calculateRelativePosition]
  );

  // Handle mouse enter/leave for element tracking
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    targetPosition.current = { x: 0, y: 0 };
    setRelativePosition({ x: 0, y: 0 });
  }, []);

  // Calculate magnetic offset for buttons
  const getMagneticOffset = useCallback(
    (maxDisplacement: number = magneticHover.maxDisplacement) => {
      if (!isHovering || !ref.current) {
        return { x: 0, y: 0 };
      }

      const rect = ref.current.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;

      // Normalize relative position to -1 to 1 range
      const normalizedX = Math.max(
        -1,
        Math.min(1, relativePosition.x / halfWidth)
      );
      const normalizedY = Math.max(
        -1,
        Math.min(1, relativePosition.y / halfHeight)
      );

      return {
        x: normalizedX * maxDisplacement,
        y: normalizedY * maxDisplacement,
      };
    },
    [isHovering, relativePosition]
  );

  // Reset position
  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setRelativePosition({ x: 0, y: 0 });
    targetPosition.current = { x: 0, y: 0 };
    setIsHovering(false);
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;

    if (trackWindow) {
      // Track entire window
      window.addEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    } else if (element) {
      // Track specific element
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (trackWindow) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [
    enabled,
    trackWindow,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    animate,
  ]);

  return {
    position,
    relativePosition,
    ref,
    isHovering,
    getMagneticOffset,
    reset,
  };
}

/**
 * Simplified hook for window-level mouse tracking (spotlight effect)
 */
export function useWindowMousePosition(
  enabled: boolean = true
): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled]);

  return position;
}

/**
 * Hook for magnetic button effect
 * Returns transform style to apply to element
 */
export function useMagneticButton(
  maxDisplacement: number = magneticHover.maxDisplacement
): {
  ref: React.RefObject<HTMLElement | null>;
  style: React.CSSProperties;
  isHovering: boolean;
} {
  const { ref, getMagneticOffset, isHovering } = useMousePosition();

  const offset = getMagneticOffset(maxDisplacement);

  const style: React.CSSProperties = {
    transform: isHovering
      ? `translate(${offset.x}px, ${offset.y}px)`
      : 'translate(0, 0)',
    transition: isHovering
      ? `transform ${magneticHover.followDuration}ms ${magneticHover.followEasing}`
      : `transform ${magneticHover.resetTransition.duration}ms ${magneticHover.resetTransition.easing}`,
  };

  return { ref, style, isHovering };
}

export default useMousePosition;
