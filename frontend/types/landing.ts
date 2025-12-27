/**
 * Landing Page TypeScript Interfaces
 * Feature: 002-engaging-landing-pages
 *
 * All entities for component props and configuration.
 * Frontend-only - no backend API requirements.
 */

// =============================================================================
// CORE ENTITIES
// =============================================================================

/**
 * Represents a navigable link in Header/Footer.
 * Used by: Header, Footer, MobileMenu
 */
export interface NavigationItem {
  /** Display text for the link */
  label: string;

  /** Route path (e.g., "/about", "/signin") */
  path: string;

  /** Whether this item should be highlighted as active */
  isActive?: boolean;

  /** Optional icon identifier for footer social links */
  icon?: 'twitter' | 'github' | 'linkedin' | 'discord';

  /** Whether link opens in new tab (external links) */
  external?: boolean;
}

/**
 * Configuration for scroll-triggered and entrance animations.
 * Used by: All animated components
 */
export interface AnimationConfig {
  /** Animation type */
  type:
    | 'fade-up'
    | 'fade-in'
    | 'scale-in'
    | 'slide-left'
    | 'slide-right'
    | 'stagger';

  /** Animation duration in milliseconds (min: 100, max: 1000) */
  duration: number;

  /** Delay before animation starts (ms) */
  delay?: number;

  /** Easing function name */
  easing: 'standard' | 'delight' | 'premium';

  /** Viewport intersection threshold (0-1) for scroll triggers */
  threshold?: number;

  /** Offset from viewport edge to trigger (CSS margin syntax) */
  triggerOffset?: string;

  /** For stagger animations - delay between children (ms, min: 30, max: 150) */
  staggerDelay?: number;
}

/**
 * Represents a themed section of a page with animation configuration.
 * Used by: HomePage, AboutPage
 */
export interface ContentSection {
  /** Unique identifier for the section */
  id: string;

  /** Section heading (optional - some sections may be visual only) */
  title?: string;

  /** Section subheading or description */
  subtitle?: string;

  /** Visual variant determining background/styling treatment */
  variant:
    | 'hero'
    | 'features'
    | 'stats'
    | 'testimonials'
    | 'cta'
    | 'values'
    | 'timeline';

  /** Animation configuration for this section */
  animation: AnimationConfig;
}

/**
 * Represents a conversion button/link.
 * Used by: Hero, CTA sections, AboutPage
 */
export interface CallToAction {
  /** Button text */
  text: string;

  /** Destination route or URL */
  href: string;

  /** Visual prominence level */
  variant: 'primary' | 'secondary' | 'ghost';

  /** Size variant */
  size?: 'default' | 'large';

  /** Optional icon to display */
  icon?: 'arrow-right' | 'sparkles' | 'check';

  /** Whether to open in new tab */
  external?: boolean;
}

/**
 * Represents a product feature/benefit.
 * Used by: HomePage features section
 */
export interface FeatureItem {
  /** Feature heading */
  title: string;

  /** Feature description */
  description: string;

  /** Icon identifier */
  icon: string;

  /** Optional highlight color (HSL values) */
  accentColor?: string;
}

/**
 * Represents a statistics/metrics item.
 * Used by: HomePage stats section, AboutPage
 */
export interface StatItem {
  /** Display value (e.g., "10K+", "99.9%") */
  value: string;

  /** Numeric value for counter animation (must be positive) */
  numericValue: number;

  /** Unit or suffix (e.g., "+", "%", "K") */
  suffix?: string;

  /** Label describing the stat */
  label: string;
}

/**
 * Represents a user testimonial.
 * Used by: HomePage testimonials section
 */
export interface Testimonial {
  /** Testimonial quote text (min: 20 chars, max: 500 chars) */
  quote: string;

  /** Author name */
  author: string;

  /** Author role/title */
  role: string;

  /** Author company (optional) */
  company?: string;

  /** Avatar image URL (optional) */
  avatarUrl?: string;
}

/**
 * Represents a company value (AboutPage).
 * Used by: AboutPage values section
 */
export interface ValueItem {
  /** Value name (e.g., "Innovation", "Transparency") */
  title: string;

  /** Value description */
  description: string;

  /** Icon identifier */
  icon: string;

  /** Position in timeline (for timeline variant) */
  order?: number;
}

/**
 * Represents a group of links in the footer.
 * Used by: Footer
 */
export interface FooterLinkGroup {
  /** Group heading (e.g., "Product", "Company") */
  title: string;

  /** Links within this group */
  links: NavigationItem[];
}

// =============================================================================
// COMPONENT PROPS INTERFACES
// =============================================================================

/**
 * Props for the Header component
 */
export interface HeaderProps {
  /** Navigation items for desktop/mobile menu */
  navigationItems: NavigationItem[];

  /** Current active route for highlighting */
  currentPath?: string;

  /** CTA button configuration */
  ctaButton?: CallToAction;
}

/**
 * Props for the Hero component
 */
export interface HeroProps {
  /** Main headline */
  headline: string;

  /** Supporting subheadline */
  subheadline: string;

  /** Primary CTA */
  primaryCta: CallToAction;

  /** Optional secondary CTA */
  secondaryCta?: CallToAction;

  /** Animation configuration */
  animation?: AnimationConfig;
}

/**
 * Props for the Footer component
 */
export interface FooterProps {
  /** Link groups for footer columns */
  linkGroups: FooterLinkGroup[];

  /** Social media links */
  socialLinks: NavigationItem[];

  /** Company name for copyright */
  companyName: string;
}

// =============================================================================
// STATE TYPES
// =============================================================================

/**
 * Header scroll states
 */
export type HeaderScrollState = 'transparent' | 'compact_glass';

/**
 * Mobile menu states
 */
export type MobileMenuState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * Animation trigger states
 */
export type AnimationTriggerState = 'initial' | 'animating' | 'visible';

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Mouse position for magnetic hover effects
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Scroll position for header transformation
 */
export interface ScrollPosition {
  y: number;
  direction: 'up' | 'down' | 'none';
}

/**
 * Animation preset configuration
 */
export interface AnimationPreset {
  name: string;
  config: AnimationConfig;
  cssProperties: Record<string, string>;
}
