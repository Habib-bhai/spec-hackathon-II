/**
 * Animation Configuration Constants
 * Feature: 002-engaging-landing-pages
 *
 * Centralized animation timing, easing, and configuration values.
 * Designed via ui-ux skill for consistent, performant animations.
 */

// =============================================================================
// TIMING CONSTANTS (in milliseconds)
// =============================================================================

/**
 * Micro-interactions: hover states, button feedback
 * Range: 150-300ms
 */
export const TIMING_MICRO = {
  fast: 150,
  default: 200,
  slow: 300,
} as const;

/**
 * State transitions: modals, drawers, menu open/close
 * Range: 300-500ms
 */
export const TIMING_STATE = {
  fast: 300,
  default: 400,
  slow: 500,
} as const;

/**
 * Page transitions: entrance animations, hero reveals
 * Range: 500-800ms
 */
export const TIMING_PAGE = {
  fast: 500,
  default: 600,
  slow: 800,
} as const;

/**
 * Ambient animations: background effects, floating elements
 * Range: 2000-10000ms
 */
export const TIMING_AMBIENT = {
  fast: 2000,
  default: 4000,
  slow: 8000,
  glacial: 10000,
} as const;

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

/**
 * CSS cubic-bezier easing functions
 * Designed for different animation contexts
 */
export const EASING = {
  /** Standard easing - general purpose, smooth transitions */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',

  /** Delight easing - playful bounce effect for interactions */
  delight: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  /** Premium easing - luxurious, refined feel */
  premium: 'cubic-bezier(0.16, 1, 0.3, 1)',

  /** Ease out - quick start, slow end (good for entrances) */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',

  /** Ease in - slow start, quick end (good for exits) */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',

  /** Linear - constant speed (use sparingly) */
  linear: 'linear',
} as const;

/**
 * Easing lookup by name (for AnimationConfig.easing)
 */
export const EASING_MAP: Record<string, string> = {
  standard: EASING.standard,
  delight: EASING.delight,
  premium: EASING.premium,
};

// =============================================================================
// STAGGER DELAYS
// =============================================================================

/**
 * Stagger delays for sequential child animations
 * Range: 30-150ms between children
 */
export const STAGGER = {
  /** Tight stagger - fast sequences */
  tight: 30,

  /** Default stagger - balanced timing */
  default: 50,

  /** Relaxed stagger - more dramatic reveals */
  relaxed: 80,

  /** Dramatic stagger - very pronounced effect */
  dramatic: 120,

  /** Maximum allowed stagger delay */
  max: 150,
} as const;

// =============================================================================
// SCROLL TRIGGER THRESHOLDS
// =============================================================================

/**
 * Intersection Observer thresholds for scroll-triggered animations
 * Values represent percentage of element visibility (0-1)
 */
export const SCROLL_THRESHOLD = {
  /** Trigger immediately when any part enters viewport */
  immediate: 0.01,

  /** Trigger when 10% visible - early trigger */
  early: 0.1,

  /** Trigger when 25% visible - default for most sections */
  default: 0.25,

  /** Trigger when 50% visible - center trigger */
  center: 0.5,

  /** Trigger when 75% visible - late trigger */
  late: 0.75,
} as const;

/**
 * Root margin offsets for triggering animations
 * Positive values trigger earlier, negative values trigger later
 */
export const SCROLL_OFFSET = {
  /** Trigger 100px before entering viewport */
  early: '100px 0px',

  /** No offset - trigger at viewport edge */
  none: '0px 0px',

  /** Trigger 50px after entering viewport */
  delayed: '-50px 0px',

  /** Trigger 100px after entering viewport */
  late: '-100px 0px',
} as const;

// =============================================================================
// HEADER SCROLL CONSTANTS
// =============================================================================

/**
 * Header scroll detection thresholds
 */
export const HEADER_SCROLL = {
  /** Scroll distance to trigger compact state */
  compactThreshold: 80,

  /** Scroll distance to show/hide header on scroll */
  hideThreshold: 200,

  /** Minimum scroll delta to trigger direction change */
  scrollDelta: 10,
} as const;

// =============================================================================
// ANIMATION PRESETS
// =============================================================================

/**
 * Pre-configured animation settings for common use cases
 */
export const ANIMATION_PRESETS = {
  /** Hero entrance - dramatic page entry */
  heroEntrance: {
    duration: TIMING_PAGE.default,
    easing: EASING.premium,
    staggerDelay: STAGGER.relaxed,
  },

  /** Section reveal - scroll-triggered section appearance */
  sectionReveal: {
    duration: TIMING_STATE.slow,
    easing: EASING.easeOut,
    threshold: SCROLL_THRESHOLD.default,
  },

  /** Card hover - subtle interaction feedback */
  cardHover: {
    duration: TIMING_MICRO.default,
    easing: EASING.standard,
  },

  /** Button interaction - click/hover feedback */
  buttonInteraction: {
    duration: TIMING_MICRO.fast,
    easing: EASING.delight,
  },

  /** Menu transition - mobile menu open/close */
  menuTransition: {
    duration: TIMING_STATE.default,
    easing: EASING.premium,
    staggerDelay: STAGGER.default,
  },

  /** Counter reveal - stats number animation */
  counterReveal: {
    duration: TIMING_PAGE.slow,
    easing: EASING.easeOut,
  },

  /** Floating ambient - background element drift */
  floatingAmbient: {
    duration: TIMING_AMBIENT.default,
    easing: EASING.linear,
  },

  /** Sparkle burst - click celebration effect */
  sparkleBurst: {
    duration: TIMING_MICRO.slow,
    easing: EASING.delight,
  },
} as const;

// =============================================================================
// CSS CUSTOM PROPERTY HELPERS
// =============================================================================

/**
 * Generate CSS animation shorthand
 */
export function createAnimationCSS(
  name: string,
  duration: number,
  easing: string,
  delay: number = 0,
  fillMode: string = 'forwards'
): string {
  return `${name} ${duration}ms ${easing} ${delay}ms ${fillMode}`;
}

/**
 * Generate CSS transition shorthand for multiple properties
 */
export function createTransitionCSS(
  properties: string[],
  duration: number,
  easing: string
): string {
  return properties.map((prop) => `${prop} ${duration}ms ${easing}`).join(', ');
}

/**
 * Calculate stagger delay for nth child
 */
export function calculateStaggerDelay(
  index: number,
  baseDelay: number = STAGGER.default
): number {
  return index * baseDelay;
}

// =============================================================================
// PERFORMANCE CONSTANTS
// =============================================================================

/**
 * GPU-accelerated properties only
 * These properties are safe for 60fps animations
 */
export const GPU_SAFE_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
  'clip-path',
] as const;

/**
 * Properties to avoid animating (cause layout thrashing)
 */
export const AVOID_ANIMATING = [
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom',
  'margin',
  'padding',
  'border-width',
  'font-size',
] as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type EasingName = keyof typeof EASING;
export type TimingCategory = 'micro' | 'state' | 'page' | 'ambient';
export type AnimationPresetName = keyof typeof ANIMATION_PRESETS;
