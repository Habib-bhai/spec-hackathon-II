/**
 * Hooks Barrel Export
 * Feature: 002-engaging-landing-pages
 *
 * Exports all custom hooks for animations and interactions.
 */

// Scroll position tracking for header
export {
  useScrollPosition,
  default as useScrollPositionDefault,
} from './useScrollPosition';

// InView detection for scroll-triggered animations
export {
  useInView,
  useSimpleInView,
  useStaggeredInView,
  default as useInViewDefault,
} from './useInView';

// Mouse position tracking for magnetic effects
export {
  useMousePosition,
  useWindowMousePosition,
  useMagneticButton,
  default as useMousePositionDefault,
} from './useMousePosition';
