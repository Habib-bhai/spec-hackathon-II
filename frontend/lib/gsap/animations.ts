'use client';

/**
 * Animation Presets for Premium Frontend
 *
 * Centralized animation configuration for consistent motion design.
 * All durations and easings align with design tokens and spec requirements.
 */

import type { gsap as GSAPType } from 'gsap';

// Type for animation config (partial gsap.TweenVars)
export interface AnimationPreset {
  duration?: number;
  ease?: string;
  y?: number;
  x?: number | number[];
  opacity?: number;
  scale?: number;
  boxShadow?: string;
  stagger?: number;
  keyframes?: Record<string, unknown>;
}

/**
 * Core Animation Presets
 * Used across components for consistent motion design
 */
export const animationPresets = {
  /**
   * Fade in from below - Primary entrance animation
   * Use: Page load, scroll reveals, list items
   */
  fadeInUp: {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  },

  /**
   * Fade in from above - Alternative entrance
   * Use: Dropdown menus, tooltips
   */
  fadeInDown: {
    y: -30,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  },

  /**
   * Scale in - Modal and overlay entrance
   * Use: Modals, cards, overlays
   */
  scaleIn: {
    scale: 0.95,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
  },

  /**
   * Modal entrance - Premium scale with bounce
   * Use: Modals, dialogs
   */
  modalEnter: {
    scale: 0.95,
    opacity: 0,
    duration: 0.3,
    ease: 'back.out(1.7)',
  },

  /**
   * Hover elevation - Card lift effect
   * Use: Task cards, interactive cards
   */
  hoverElevate: {
    y: -4,
    duration: 0.2,
    ease: 'power2.out',
  },

  /**
   * Hover return - Return from elevation
   * Use: Task cards on mouse leave
   */
  hoverReturn: {
    y: 0,
    duration: 0.15,
    ease: 'power2.in',
  },

  /**
   * Button press - Click feedback
   * Use: Buttons, interactive elements
   */
  buttonPress: {
    scale: 0.98,
    duration: 0.1,
    ease: 'power2.out',
  },

  /**
   * Button release - Return from press
   * Use: Buttons, interactive elements
   */
  buttonRelease: {
    scale: 1,
    duration: 0.15,
    ease: 'power2.out',
  },

  /**
   * Shake animation - Validation error
   * Use: Form validation errors
   */
  shake: {
    keyframes: {
      x: [-10, 10, -10, 10, 0],
    },
    duration: 0.4,
    ease: 'power2.inOut',
  },

  /**
   * Pulse animation - Attention grabber
   * Use: Notifications, badges
   */
  pulse: {
    keyframes: {
      scale: [1, 1.05, 1],
    },
    duration: 0.6,
    ease: 'power1.inOut',
  },

  /**
   * Stagger timing for list animations
   * Per FR-009: 50ms between items
   */
  stagger: {
    amount: 0.05,
  },
} as const;

/**
 * Shadow presets for hover states
 * Aligns with design token shadow system
 */
export const shadowPresets = {
  /** Card at rest */
  cardRest: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',

  /** Card on hover - elevated */
  cardHover: '0 8px 16px -4px rgba(0, 0, 0, 0.4)',

  /** Card on hover with accent glow */
  cardHoverGlow: '0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 0 20px rgba(250, 69, 31, 0.15)',

  /** Modal shadow */
  modal: '0 12px 24px -6px rgba(0, 0, 0, 0.5)',

  /** Button glow */
  buttonGlow: '0 0 20px rgba(250, 69, 31, 0.4)',
} as const;

/**
 * Duration presets matching design tokens
 * All within 400ms max per SC-002
 */
export const durations = {
  instant: 0.1,  // 100ms
  fast: 0.15,    // 150ms
  normal: 0.3,   // 300ms
  slow: 0.5,     // 500ms - max for entrances
  slower: 0.8,   // 800ms - only for page transitions
} as const;

/**
 * Stagger delay presets for list animations
 * Per FR-009: 50ms between items
 */
export const staggerDelays = {
  /** List items - 50ms per item */
  list: 0.05,
  /** Quick stagger - 30ms per item */
  quick: 0.03,
  /** Slow stagger - 100ms per item */
  slow: 0.1,
} as const;

/**
 * Easing presets matching design tokens
 */
export const easings = {
  /** Standard deceleration */
  out: 'power2.out',
  /** Standard acceleration */
  in: 'power2.in',
  /** Smooth in-out */
  inOut: 'power2.inOut',
  /** Bounce overshoot - for modals */
  bounce: 'back.out(1.7)',
  /** Elastic - for playful elements */
  elastic: 'elastic.out(1, 0.5)',
} as const;

/**
 * ScrollTrigger default configuration
 * Used for scroll-based animations
 */
export const scrollTriggerDefaults = {
  /** Standard start position */
  start: 'top 80%',
  /** Only animate once */
  once: true,
  /** Toggle actions for debug */
  toggleActions: 'play none none none',
} as const;

export type AnimationPresetKey = keyof typeof animationPresets;
export type ShadowPresetKey = keyof typeof shadowPresets;
export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
