/**
 * Reusable Animation Effects Presets
 * Feature: 002-engaging-landing-pages
 *
 * Pre-built animation effect configurations for consistent animations.
 * Designed via ui-ux skill for creative, non-generic effects.
 */

import {
  TIMING_MICRO,
  TIMING_STATE,
  TIMING_PAGE,
  TIMING_AMBIENT,
  EASING,
  STAGGER,
  SCROLL_THRESHOLD,
} from './config';

// =============================================================================
// ENTRANCE ANIMATIONS
// =============================================================================

/**
 * Fade up animation - element fades in while moving up
 */
export const fadeUp = {
  initial: {
    opacity: 0,
    transform: 'translateY(30px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.easeOut,
  },
} as const;

/**
 * Fade in animation - simple opacity fade
 */
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.standard,
  },
} as const;

/**
 * Scale in animation - element scales from smaller size
 */
export const scaleIn = {
  initial: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  animate: {
    opacity: 1,
    transform: 'scale(1)',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.delight,
  },
} as const;

/**
 * Slide in from left
 */
export const slideLeft = {
  initial: {
    opacity: 0,
    transform: 'translateX(-40px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.easeOut,
  },
} as const;

/**
 * Slide in from right
 */
export const slideRight = {
  initial: {
    opacity: 0,
    transform: 'translateX(40px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateX(0)',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.easeOut,
  },
} as const;

/**
 * Blur up animation - element blurs in while moving up
 */
export const blurUp = {
  initial: {
    opacity: 0,
    transform: 'translateY(20px)',
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
    filter: 'blur(0)',
  },
  transition: {
    duration: TIMING_PAGE.fast,
    easing: EASING.premium,
  },
} as const;

// =============================================================================
// HERO ANIMATIONS
// =============================================================================

/**
 * Hero headline - character by character reveal
 */
export const heroHeadlineReveal = {
  container: {
    transition: {
      staggerChildren: 30, // 30ms between each char
      delayChildren: TIMING_MICRO.default,
    },
  },
  char: {
    initial: {
      opacity: 0,
      transform: 'translateY(20px) rotateX(-90deg)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0) rotateX(0)',
    },
    transition: {
      duration: TIMING_MICRO.slow,
      easing: EASING.delight,
    },
  },
} as const;

/**
 * Hero subheadline - blur up reveal
 */
export const heroSubheadlineReveal = {
  initial: {
    opacity: 0,
    transform: 'translateY(15px)',
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
    filter: 'blur(0)',
  },
  transition: {
    duration: TIMING_STATE.slow,
    easing: EASING.premium,
    delay: TIMING_STATE.default, // After headline
  },
} as const;

/**
 * Hero CTA - scale bounce entrance
 */
export const heroCtaEntrance = {
  initial: {
    opacity: 0,
    transform: 'scale(0.8)',
  },
  animate: {
    opacity: 1,
    transform: 'scale(1)',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.delight,
    delay: TIMING_PAGE.fast, // After subheadline
  },
} as const;

// =============================================================================
// MAGNETIC HOVER EFFECTS
// =============================================================================

/**
 * Magnetic hover - button moves toward cursor
 * Use with useMousePosition hook
 */
export const magneticHover = {
  /** Maximum displacement in pixels */
  maxDisplacement: 15,

  /** Easing for following cursor */
  followEasing: EASING.standard,

  /** Duration for position updates */
  followDuration: TIMING_MICRO.fast,

  /** Return to center animation */
  resetTransition: {
    duration: TIMING_STATE.default,
    easing: EASING.delight,
  },
} as const;

// =============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// =============================================================================

/**
 * Section reveal - used for content sections
 */
export const sectionReveal = {
  initial: {
    opacity: 0,
    transform: 'translateY(40px)',
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  transition: {
    duration: TIMING_STATE.slow,
    easing: EASING.easeOut,
  },
  scrollConfig: {
    threshold: SCROLL_THRESHOLD.default,
    triggerOnce: true,
  },
} as const;

/**
 * Staggered children reveal
 */
export const staggeredReveal = {
  container: {
    transition: {
      staggerChildren: STAGGER.default,
      delayChildren: TIMING_MICRO.default,
    },
  },
  child: {
    initial: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    transition: {
      duration: TIMING_STATE.default,
      easing: EASING.easeOut,
    },
  },
} as const;

/**
 * Counter reveal - for stats numbers
 */
export const counterReveal = {
  /** Duration of counting animation */
  countDuration: TIMING_PAGE.slow,

  /** Easing for count interpolation */
  countEasing: EASING.easeOut,

  /** Entrance animation before counting starts */
  entrance: {
    initial: {
      opacity: 0,
      transform: 'scale(0.9)',
    },
    animate: {
      opacity: 1,
      transform: 'scale(1)',
    },
    transition: {
      duration: TIMING_STATE.default,
      easing: EASING.delight,
    },
  },
} as const;

// =============================================================================
// HEADER ANIMATIONS
// =============================================================================

/**
 * Header scroll transform - transparent to glass
 */
export const headerScrollTransform = {
  transparent: {
    background: 'transparent',
    backdropFilter: 'none',
    boxShadow: 'none',
    padding: '1.5rem 0',
  },
  compact: {
    background: 'hsl(var(--landing-glass-bg))',
    backdropFilter: 'blur(var(--landing-glass-blur))',
    boxShadow: 'var(--landing-shadow-md)',
    padding: '0.75rem 0',
  },
  transition: {
    duration: TIMING_STATE.default,
    easing: EASING.premium,
  },
} as const;

/**
 * Nav link underline draw effect
 */
export const navUnderlineDraw = {
  initial: {
    transform: 'scaleX(0)',
    transformOrigin: 'left',
  },
  hover: {
    transform: 'scaleX(1)',
  },
  transition: {
    duration: TIMING_MICRO.default,
    easing: EASING.standard,
  },
} as const;

/**
 * Mobile menu cascade reveal
 */
export const mobileMenuCascade = {
  overlay: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
    transition: {
      duration: TIMING_STATE.default,
      easing: EASING.standard,
    },
  },
  menu: {
    initial: {
      transform: 'translateX(100%)',
    },
    animate: {
      transform: 'translateX(0)',
    },
    exit: {
      transform: 'translateX(100%)',
    },
    transition: {
      duration: TIMING_STATE.default,
      easing: EASING.premium,
    },
  },
  items: {
    container: {
      transition: {
        staggerChildren: STAGGER.default,
        delayChildren: TIMING_MICRO.slow,
      },
    },
    item: {
      initial: {
        opacity: 0,
        transform: 'translateX(20px)',
      },
      animate: {
        opacity: 1,
        transform: 'translateX(0)',
      },
      transition: {
        duration: TIMING_STATE.fast,
        easing: EASING.easeOut,
      },
    },
  },
} as const;

// =============================================================================
// FOOTER ANIMATIONS
// =============================================================================

/**
 * Footer rising reveal effect
 */
export const footerRisingReveal = {
  container: {
    initial: {
      opacity: 0,
      transform: 'translateY(60px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    transition: {
      duration: TIMING_PAGE.fast,
      easing: EASING.easeOut,
    },
  },
  columns: {
    container: {
      transition: {
        staggerChildren: STAGGER.relaxed,
        delayChildren: TIMING_MICRO.default,
      },
    },
    column: {
      initial: {
        opacity: 0,
        transform: 'translateY(30px)',
      },
      animate: {
        opacity: 1,
        transform: 'translateY(0)',
      },
      transition: {
        duration: TIMING_STATE.default,
        easing: EASING.easeOut,
      },
    },
  },
} as const;

// =============================================================================
// BACKGROUND EFFECTS
// =============================================================================

/**
 * Floating orb ambient animation
 */
export const floatingOrb = {
  animation: {
    keyframes: {
      '0%, 100%': {
        transform: 'translateY(0) scale(1)',
        opacity: 0.6,
      },
      '50%': {
        transform: 'translateY(-20px) scale(1.05)',
        opacity: 0.8,
      },
    },
    duration: TIMING_AMBIENT.default,
    easing: EASING.linear,
    iterationCount: 'infinite',
  },
} as const;

/**
 * Meteor shower animation
 */
export const meteorShower = {
  meteor: {
    keyframes: {
      '0%': {
        transform: 'translateX(0) translateY(0) rotate(-45deg)',
        opacity: 1,
      },
      '70%': {
        opacity: 1,
      },
      '100%': {
        transform: 'translateX(-500px) translateY(500px) rotate(-45deg)',
        opacity: 0,
      },
    },
    duration: TIMING_AMBIENT.fast,
    easing: EASING.linear,
  },
  /** Random delay range for staggered meteors */
  delayRange: [0, TIMING_AMBIENT.slow] as const,
} as const;

/**
 * Spotlight follow effect (follows cursor)
 */
export const spotlightFollow = {
  /** Spotlight size */
  size: 400,

  /** Follow smoothness (lower = smoother) */
  smoothing: 0.1,

  /** Opacity of spotlight */
  opacity: 0.15,

  /** Gradient falloff */
  gradient: 'radial-gradient(circle, hsl(var(--landing-primary) / 0.15) 0%, transparent 70%)',
} as const;

/**
 * Aurora background animation
 */
export const auroraBackground = {
  keyframes: {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
  duration: TIMING_AMBIENT.glacial,
  easing: EASING.linear,
  iterationCount: 'infinite',
  gradient: `linear-gradient(
    45deg,
    hsl(var(--landing-primary) / 0.1),
    hsl(var(--landing-accent) / 0.1),
    hsl(var(--landing-secondary) / 0.1),
    hsl(var(--landing-primary) / 0.1)
  )`,
  backgroundSize: '400% 400%',
} as const;

// =============================================================================
// MICRO-INTERACTIONS
// =============================================================================

/**
 * Sparkle burst on click
 */
export const sparkleBurst = {
  particle: {
    duration: TIMING_MICRO.slow,
    easing: EASING.delight,
    count: 8,
    spread: 60, // degrees
    distance: 40, // pixels
  },
} as const;

/**
 * Button press effect
 */
export const buttonPress = {
  rest: {
    transform: 'scale(1)',
  },
  pressed: {
    transform: 'scale(0.97)',
  },
  transition: {
    duration: TIMING_MICRO.fast,
    easing: EASING.standard,
  },
} as const;

/**
 * Card hover lift
 */
export const cardHoverLift = {
  rest: {
    transform: 'translateY(0)',
    boxShadow: 'var(--landing-shadow-md)',
  },
  hover: {
    transform: 'translateY(-4px)',
    boxShadow: 'var(--landing-shadow-lg)',
  },
  transition: {
    duration: TIMING_MICRO.default,
    easing: EASING.standard,
  },
} as const;

// =============================================================================
// TYPEWRITER EFFECT
// =============================================================================

/**
 * Typewriter animation for AboutPage hero
 */
export const typewriter = {
  /** Characters per second */
  speed: 50,

  /** Cursor blink interval */
  cursorBlinkDuration: TIMING_MICRO.slow * 2,

  /** Pause at end before cursor disappears */
  endPause: TIMING_STATE.slow,

  cursor: {
    animation: {
      keyframes: {
        '0%, 50%': { opacity: 1 },
        '51%, 100%': { opacity: 0 },
      },
      duration: TIMING_MICRO.slow * 2,
      iterationCount: 'infinite',
    },
  },
} as const;

// =============================================================================
// TIMELINE DRAW ANIMATION
// =============================================================================

/**
 * SVG path draw animation for timeline
 */
export const timelineDraw = {
  line: {
    initial: {
      strokeDashoffset: 1000,
      strokeDasharray: 1000,
    },
    animate: {
      strokeDashoffset: 0,
    },
    transition: {
      duration: TIMING_PAGE.slow,
      easing: EASING.easeOut,
    },
  },
  nodes: {
    container: {
      transition: {
        staggerChildren: TIMING_MICRO.default,
        delayChildren: TIMING_STATE.default,
      },
    },
    node: {
      initial: {
        opacity: 0,
        transform: 'scale(0)',
      },
      animate: {
        opacity: 1,
        transform: 'scale(1)',
      },
      transition: {
        duration: TIMING_STATE.fast,
        easing: EASING.delight,
      },
    },
  },
} as const;

// =============================================================================
// CAROUSEL DEPTH EFFECT
// =============================================================================

/**
 * 3D carousel depth for testimonials
 */
export const carouselDepth = {
  /** Perspective for 3D effect */
  perspective: 1000,

  /** Rotation range in degrees */
  rotateY: 15,

  /** Scale range for depth */
  scaleRange: [0.85, 1] as const,

  /** Z-axis translation */
  translateZ: [-100, 0] as const,

  transition: {
    duration: TIMING_STATE.slow,
    easing: EASING.premium,
  },
} as const;

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * Get animation styles for CSS-in-JS
 */
export function getAnimationStyles(
  effect: { initial: Record<string, unknown>; animate: Record<string, unknown> },
  isAnimated: boolean
) {
  return isAnimated ? effect.animate : effect.initial;
}

/**
 * Create CSS keyframe animation string
 */
export function createKeyframeAnimation(
  name: string,
  duration: number,
  easing: string,
  iterationCount: string | number = 1
): string {
  return `${name} ${duration}ms ${easing} ${iterationCount === 'infinite' ? 'infinite' : iterationCount}`;
}
