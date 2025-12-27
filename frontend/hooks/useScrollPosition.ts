'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScrollPosition } from '@/types/landing';
import { HEADER_SCROLL } from '@/lib/animations/config';

/**
 * useScrollPosition Hook
 * Feature: 002-engaging-landing-pages
 *
 * Tracks scroll position and direction for header scroll detection.
 * Used by Header component for transparent → compact glass transformation.
 *
 * @param options - Configuration options
 * @returns Current scroll position and direction
 */
interface UseScrollPositionOptions {
  /** Threshold in pixels before triggering scroll events */
  threshold?: number;

  /** Debounce delay in milliseconds */
  debounceMs?: number;

  /** Whether the hook is enabled */
  enabled?: boolean;
}

interface UseScrollPositionReturn extends ScrollPosition {
  /** Whether scroll position is past the compact threshold */
  isScrolled: boolean;

  /** Whether scroll position is past the hide threshold */
  isPastHideThreshold: boolean;
}

export function useScrollPosition(
  options: UseScrollPositionOptions = {}
): UseScrollPositionReturn {
  const {
    threshold = HEADER_SCROLL.scrollDelta,
    debounceMs = 10,
    enabled = true,
  } = options;

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    y: 0,
    direction: 'none',
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollPosition = useCallback(() => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY.current;

    // Only update direction if delta exceeds threshold
    let direction: 'up' | 'down' | 'none' = 'none';
    if (Math.abs(delta) >= threshold) {
      direction = delta > 0 ? 'down' : 'up';
      lastScrollY.current = currentScrollY;
    }

    setScrollPosition((prev) => ({
      y: currentScrollY,
      direction: direction !== 'none' ? direction : prev.direction,
    }));

    ticking.current = false;
  }, [threshold]);

  const handleScroll = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout for debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Request animation frame for smooth updates
    if (!ticking.current) {
      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(updateScrollPosition);
        ticking.current = true;
      }, debounceMs);
    }
  }, [enabled, debounceMs, updateScrollPosition]);

  useEffect(() => {
    if (!enabled) return;

    // Set initial scroll position
    lastScrollY.current = window.scrollY;
    setScrollPosition({
      y: window.scrollY,
      direction: 'none',
    });

    // Add scroll listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleScroll]);

  // Computed values based on scroll position
  const isScrolled = scrollPosition.y >= HEADER_SCROLL.compactThreshold;
  const isPastHideThreshold = scrollPosition.y >= HEADER_SCROLL.hideThreshold;

  return {
    ...scrollPosition,
    isScrolled,
    isPastHideThreshold,
  };
}

export default useScrollPosition;
