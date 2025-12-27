# Data Model: Engaging Landing Pages

**Feature**: 002-engaging-landing-pages
**Date**: 2025-12-26

## Overview

This feature is **frontend-only** with no backend API requirements. All entities are TypeScript interfaces for component props and configuration.

---

## Core Entities

### NavigationItem

Represents a navigable link in Header/Footer.

```typescript
interface NavigationItem {
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
```

**Used by**: Header, Footer, MobileMenu

---

### ContentSection

Represents a themed section of a page with animation configuration.

```typescript
interface ContentSection {
  /** Unique identifier for the section */
  id: string;

  /** Section heading (optional - some sections may be visual only) */
  title?: string;

  /** Section subheading or description */
  subtitle?: string;

  /** Visual variant determining background/styling treatment */
  variant: 'hero' | 'features' | 'stats' | 'testimonials' | 'cta' | 'values' | 'timeline';

  /** Animation configuration for this section */
  animation: AnimationConfig;
}
```

**Used by**: HomePage, AboutPage

---

### AnimationConfig

Configuration for scroll-triggered and entrance animations.

```typescript
interface AnimationConfig {
  /** Animation type */
  type: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right' | 'stagger';

  /** Animation duration in milliseconds */
  duration: number;

  /** Delay before animation starts (ms) */
  delay?: number;

  /** Easing function name */
  easing: 'standard' | 'delight' | 'premium';

  /** Viewport intersection threshold (0-1) for scroll triggers */
  threshold?: number;

  /** Offset from viewport edge to trigger (CSS margin syntax) */
  triggerOffset?: string;

  /** For stagger animations - delay between children (ms) */
  staggerDelay?: number;
}
```

**Used by**: All animated components

---

### CallToAction

Represents a conversion button/link.

```typescript
interface CallToAction {
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
```

**Used by**: Hero, CTA sections, AboutPage

---

### FeatureItem

Represents a product feature/benefit.

```typescript
interface FeatureItem {
  /** Feature heading */
  title: string;

  /** Feature description */
  description: string;

  /** Icon identifier */
  icon: string;

  /** Optional highlight color (HSL values) */
  accentColor?: string;
}
```

**Used by**: HomePage features section

---

### StatItem

Represents a statistics/metrics item.

```typescript
interface StatItem {
  /** Display value (e.g., "10K+", "99.9%") */
  value: string;

  /** Numeric value for counter animation */
  numericValue: number;

  /** Unit or suffix (e.g., "+", "%", "K") */
  suffix?: string;

  /** Label describing the stat */
  label: string;
}
```

**Used by**: HomePage stats section, AboutPage

---

### Testimonial

Represents a user testimonial.

```typescript
interface Testimonial {
  /** Testimonial quote text */
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
```

**Used by**: HomePage testimonials section

---

### ValueItem

Represents a company value (AboutPage).

```typescript
interface ValueItem {
  /** Value name (e.g., "Innovation", "Transparency") */
  title: string;

  /** Value description */
  description: string;

  /** Icon identifier */
  icon: string;

  /** Position in timeline (for timeline variant) */
  order?: number;
}
```

**Used by**: AboutPage values section

---

### FooterLinkGroup

Represents a group of links in the footer.

```typescript
interface FooterLinkGroup {
  /** Group heading (e.g., "Product", "Company") */
  title: string;

  /** Links within this group */
  links: NavigationItem[];
}
```

**Used by**: Footer

---

## Component Props Interfaces

### HeaderProps

```typescript
interface HeaderProps {
  /** Navigation items for desktop/mobile menu */
  navigationItems: NavigationItem[];

  /** Current active route for highlighting */
  currentPath?: string;

  /** CTA button configuration */
  ctaButton?: CallToAction;
}
```

### HeroProps

```typescript
interface HeroProps {
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
```

### FooterProps

```typescript
interface FooterProps {
  /** Link groups for footer columns */
  linkGroups: FooterLinkGroup[];

  /** Social media links */
  socialLinks: NavigationItem[];

  /** Company name for copyright */
  companyName: string;
}
```

---

## State Transitions

### Header Scroll State

```
TRANSPARENT (scrollY < 80px)
    │
    ▼ scroll down
    │
COMPACT_GLASS (scrollY >= 80px)
    │
    ▼ scroll up past threshold
    │
TRANSPARENT
```

### Mobile Menu State

```
CLOSED
    │
    ▼ tap hamburger
    │
OPENING (300ms animation)
    │
    ▼ animation complete
    │
OPEN
    │
    ▼ tap close / tap outside / navigate
    │
CLOSING (250ms animation)
    │
    ▼ animation complete
    │
CLOSED
```

### Animation Trigger State

```
INITIAL (element below viewport)
    │
    ▼ element enters viewport (threshold met)
    │
ANIMATING (duration: 300-600ms)
    │
    ▼ animation complete
    │
VISIBLE (final state)
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| NavigationItem.path | Must start with "/" for internal routes |
| AnimationConfig.duration | Min: 100ms, Max: 1000ms |
| AnimationConfig.threshold | Range: 0 to 1 |
| AnimationConfig.staggerDelay | Min: 30ms, Max: 150ms |
| StatItem.numericValue | Must be positive number |
| Testimonial.quote | Min: 20 chars, Max: 500 chars |

---

## No Database/API Required

This feature is entirely client-side rendered with static content. All data is defined in component files or configuration constants.
