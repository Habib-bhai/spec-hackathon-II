'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SCROLL_THRESHOLD, SCROLL_OFFSET } from '@/lib/animations/config';
import type { AnimationTriggerState } from '@/types/landing';

/**
 * useInView Hook
 * Feature: 002-engaging-landing-pages
 *
 * Uses native Intersection Observer for scroll-triggered animations.
 * Provides animation state management and intersection observer functionality.
 *
 * @param options - Configuration options for intersection detection
 * @returns Ref to attach to element and animation state
 */
interface UseInViewOptions {
  /** Intersection threshold (0-1), defaults to 0.25 */
  threshold?: number;

  /** Root margin for early/late triggering */
  rootMargin?: string;

  /** Whether to trigger only once (default: true) */
  triggerOnce?: boolean;

  /** Callback when element enters view */
  onEnter?: () => void;

  /** Callback when element leaves view */
  onLeave?: () => void;

  /** Whether the hook is enabled */
  enabled?: boolean;
}

interface UseInViewReturn<T extends HTMLElement> {
  /** Ref to attach to the target element */
  ref: React.RefObject<T | null>;

  /** Whether element is currently in view */
  isInView: boolean;

  /** Animation trigger state */
  animationState: AnimationTriggerState;

  /** Whether animation has been triggered (useful for triggerOnce) */
  hasAnimated: boolean;

  /** Reset animation state to initial */
  reset: () => void;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const {
    threshold = SCROLL_THRESHOLD.default,
    rootMargin = SCROLL_OFFSET.none,
    triggerOnce = true,
    onEnter,
    onLeave,
    enabled = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationState, setAnimationState] =
    useState<AnimationTriggerState>('initial');

  const reset = useCallback(() => {
    setIsInView(false);
    setHasAnimated(false);
    setAnimationState('initial');
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    // Use native Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          // Element entered viewport
          setIsInView(true);
          setAnimationState('animating');
          onEnter?.();

          // Mark as animated after a short delay (for transition completion)
          setTimeout(() => {
            setAnimationState('visible');
            setHasAnimated(true);
          }, 100);

          // Unobserve if triggerOnce
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else {
          // Element left viewport
          if (!triggerOnce) {
            setIsInView(false);
            setAnimationState('initial');
            onLeave?.();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, triggerOnce, onEnter, onLeave]);

  return {
    ref,
    isInView,
    animationState,
    hasAnimated,
    reset,
  };
}

/**
 * Simplified hook for basic in-view detection
 * Returns just boolean for simpler use cases
 */
export function useSimpleInView<T extends HTMLElement = HTMLDivElement>(
  options: Omit<UseInViewOptions, 'onEnter' | 'onLeave'> = {}
): { ref: React.RefObject<T | null>; isInView: boolean } {
  const { ref, isInView } = useInView<T>(options);
  return { ref, isInView };
}

/**
 * Hook for staggered children animations
 * Returns index-based delays for children
 */
interface UseStaggeredInViewOptions extends UseInViewOptions {
  /** Number of children to stagger */
  childCount: number;

  /** Delay between each child in ms */
  staggerDelay?: number;
}

interface UseStaggeredInViewReturn<T extends HTMLElement>
  extends UseInViewReturn<T> {
  /** Get delay for specific child index */
  getChildDelay: (index: number) => number;

  /** Whether specific child should animate */
  shouldAnimateChild: (index: number) => boolean;
}

export function useStaggeredInView<T extends HTMLElement = HTMLDivElement>(
  options: UseStaggeredInViewOptions
): UseStaggeredInViewReturn<T> {
  const { childCount, staggerDelay = 50, ...inViewOptions } = options;

  const inViewResult = useInView<T>(inViewOptions);

  const getChildDelay = useCallback(
    (index: number): number => {
      return index * staggerDelay;
    },
    [staggerDelay]
  );

  const shouldAnimateChild = useCallback(
    (index: number): boolean => {
      if (!inViewResult.isInView) return false;
      return index < childCount;
    },
    [inViewResult.isInView, childCount]
  );

  return {
    ...inViewResult,
    getChildDelay,
    shouldAnimateChild,
  };
}

export default useInView;
