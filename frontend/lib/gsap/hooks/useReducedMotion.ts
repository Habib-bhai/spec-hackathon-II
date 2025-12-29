'use client';

/**
 * useReducedMotion Hook
 *
 * Detects user's prefers-reduced-motion preference.
 * Used to skip or simplify animations for accessibility (FR-010).
 */

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 *
 * @returns {boolean} True if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * if (prefersReducedMotion) {
 *   // Skip animation, apply final state
 *   gsap.set(element, { opacity: 1 });
 * } else {
 *   // Run full animation
 *   gsap.from(element, { opacity: 0, duration: 0.5 });
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === 'undefined') return;

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener for changes (user can toggle preference)
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Utility function to check reduced motion preference (non-hook version)
 * Use when you need a one-time check outside of React component lifecycle
 *
 * @returns {boolean} True if user prefers reduced motion
 */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default useReducedMotion;
