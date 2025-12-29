'use client';

/**
 * useScrollAnimation Hook
 *
 * Custom hook for scroll-triggered animations with GSAP ScrollTrigger.
 * Provides consistent scroll animation behavior across components.
 */

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../index';
import { animationPresets, scrollTriggerDefaults, durations } from '../animations';
import { useReducedMotion } from './useReducedMotion';

export interface UseScrollAnimationOptions {
  /** CSS selector for elements to animate */
  selector: string;
  /** Animation direction: 'up', 'down', 'left', 'right' */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Stagger delay between elements in seconds */
  stagger?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Custom start position for ScrollTrigger */
  start?: string;
  /** Whether to only animate once */
  once?: boolean;
  /** Custom animation properties to merge */
  customAnimation?: gsap.TweenVars;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * Hook for creating scroll-triggered animations
 *
 * @example
 * ```tsx
 * const containerRef = useScrollAnimation({
 *   selector: '.task-card',
 *   direction: 'up',
 *   stagger: 0.05,
 * });
 *
 * return <div ref={containerRef}>...</div>;
 * ```
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions
): React.RefObject<T | null> {
  const {
    selector,
    direction = 'up',
    stagger = 0.05,
    duration = durations.slow,
    start = scrollTriggerDefaults.start,
    once = true,
    customAnimation,
    onComplete,
  } = options;

  const containerRef = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(selector);
      if (elements.length === 0) return;

      // If user prefers reduced motion, set final state immediately
      if (prefersReducedMotion) {
        gsap.set(elements, { opacity: 1, x: 0, y: 0 });
        return;
      }

      // Determine animation from properties based on direction
      const fromProps: gsap.TweenVars = {
        opacity: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          once,
        },
        onComplete,
        ...customAnimation,
      };

      // Add directional offset
      switch (direction) {
        case 'up':
          fromProps.y = 30;
          break;
        case 'down':
          fromProps.y = -30;
          break;
        case 'left':
          fromProps.x = 30;
          break;
        case 'right':
          fromProps.x = -30;
          break;
      }

      gsap.from(elements, fromProps);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return containerRef;
}

/**
 * Hook for simple fade-in animation on scroll
 *
 * @example
 * ```tsx
 * const ref = useScrollFadeIn('.section');
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  options?: Partial<UseScrollAnimationOptions>
): React.RefObject<T | null> {
  return useScrollAnimation<T>({
    selector,
    direction: 'up',
    stagger: 0.05,
    ...options,
  });
}

/**
 * Hook for staggered list item animations on scroll
 *
 * @example
 * ```tsx
 * const listRef = useScrollStagger('.list-item', 0.05);
 * return <ul ref={listRef}>...</ul>;
 * ```
 */
export function useScrollStagger<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  staggerAmount: number = 0.05,
  options?: Partial<UseScrollAnimationOptions>
): React.RefObject<T | null> {
  return useScrollAnimation<T>({
    selector,
    stagger: staggerAmount,
    direction: 'up',
    ...options,
  });
}

export default useScrollAnimation;
