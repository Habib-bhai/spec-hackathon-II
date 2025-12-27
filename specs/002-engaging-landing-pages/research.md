# Research: Engaging Landing Pages

**Feature**: 002-engaging-landing-pages
**Date**: 2025-12-26
**Status**: Complete

## Research Summary

All technical unknowns have been resolved through Context7 MCP documentation research and ui-ux skill consultation.

---

## 1. Animation Library Selection

### Decision
Use **CSS animations and transforms** as primary animation method, with **Motion (from Framer Motion creators)** for scroll-triggered animations and complex interactions.

### Rationale
- CSS animations are GPU-accelerated by default (transform, opacity)
- Motion's `inView` function uses native Intersection Observer API for optimal performance
- Motion is lightweight compared to full Framer Motion (~3KB vs ~30KB)
- Maintains 60fps on mid-tier devices per FR-004 success criteria
- Works seamlessly with Next.js App Router and client components

### Alternatives Considered
| Alternative | Reason Rejected |
|-------------|-----------------|
| GSAP + ScrollTrigger | Larger bundle size, overkill for our needs |
| Pure CSS only | No scroll-trigger support, limited interactivity |
| Framer Motion (full) | Heavier bundle, Motion is sufficient |
| Vanilla Intersection Observer | Motion provides cleaner API with same underlying tech |

### Context7 Evidence
From `/websites/motion-dev-docs`:
- `inView` function: detects viewport entry/exit with native Intersection Observer
- `scroll()` function: links animations to scroll progress
- Hardware acceleration via `ScrollTimeline` where supported

---

## 2. Component Architecture Pattern

### Decision
Use **Server Components as default** with **Client Components only for interactive elements** (animations, scroll triggers, mouse tracking).

### Rationale
- Reduces JavaScript bundle size (constitution principle VI)
- Server Components render HTML first for fast LCP
- Client Components isolated to leaf nodes for interactivity
- Follows Next.js App Router best practices per Context7 docs

### Implementation Pattern
```
Server Component (page.tsx)
  └── Client Component (Hero.tsx with 'use client')
        ├── Static content (rendered immediately)
        └── Animated elements (hydrated client-side)
```

### Context7 Evidence
From `/websites/nextjs_app`:
- Use `'use client'` directive for components needing useState, useEffect, event listeners
- Server Components by default for optimal performance
- Composition pattern: pass data from Server to Client Components via props

---

## 3. Scroll Animation Strategy

### Decision
Use **Motion's `inView`** function with Intersection Observer for scroll-triggered reveals.

### Rationale
- Native browser API (Intersection Observer) is most performant
- `inView` provides clean callback pattern with enter/leave support
- Supports `amount` option for threshold control (0 to 1)
- Supports `margin` option for trigger offset (e.g., trigger 100px before visible)

### Implementation Pattern
```typescript
import { inView, animate } from "motion";

// Trigger animation when element enters viewport
inView(".content-section", (element) => {
  animate(element, { opacity: 1, y: 0 }, { duration: 0.6 });

  // Optional: cleanup on leave
  return () => animate(element, { opacity: 0 });
}, { amount: 0.25, margin: "0px 0px -100px 0px" });
```

### Context7 Evidence
From `/websites/motion-dev-docs`:
- `inView(target, callback, options)` - target can be selector, element, or array
- Options: `root`, `margin`, `amount` (threshold)
- Returns cleanup function for stopping observation

---

## 4. Color Palette Implementation

### Decision
Extend existing HSL color variable system with **landing page specific variables**.

### Rationale
- Consistent with existing auth pages (`--auth-*` variables)
- Follows constitution's CSS Modules convention
- ui-ux skill recommends coral/slate palette for warmth + professionalism
- HSL allows programmatic adjustments (glow effects, transparency)

### Color System (from ui-ux skill)
```css
:root {
  /* Landing Page Colors */
  --landing-bg: 220 25% 6%;              /* Deep slate night */
  --landing-fg: 30 15% 95%;              /* Warm cream */
  --landing-primary: 12 85% 62%;         /* Coral sunset */
  --landing-primary-glow: 12 90% 55%;    /* Brighter coral for glows */
  --landing-secondary: 220 45% 25%;      /* Muted slate */
  --landing-accent: 32 95% 58%;          /* Golden amber */
  --landing-muted: 220 20% 12%;          /* Charcoal slate */
}
```

---

## 5. Animation Timing Standards

### Decision
Follow ui-ux skill timing guidelines:
- **Micro-interactions**: 150-300ms (hovers, buttons)
- **State changes**: 300-500ms (modals, drawers)
- **Page animations**: 500-800ms (entrance sequences)
- **Ambient**: 2-10s (background effects)

### Rationale
- FR-029: entrance animations under 600ms
- FR-031: micro-interactions under 100ms feedback
- Aligned with ui-ux skill research for optimal UX

### Easing Functions
```css
/* Standard - most interactions */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Delight - playful bounce for CTAs */
--ease-delight: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Premium - smooth, luxurious feel */
--ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 6. Reduced Motion Support

### Decision
Implement `prefers-reduced-motion` media query with graceful fallback.

### Rationale
- FR-032: MUST respect user preferences
- Accessibility requirement (WCAG 2.1)
- Progressive enhancement approach

### Implementation Pattern
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Hide ambient decorations */
  .floating-orb,
  .meteor,
  .sparkle {
    display: none;
  }
}
```

---

## 7. Performance Optimization Strategy

### Decision
Use GPU-accelerated properties only, with `will-change` applied dynamically.

### Rationale
- SC-004: 95% animations without frame drops
- SC-007: Zero layout shifts (CLS = 0)
- Constitution principle VI: developer productivity through clear patterns

### GPU-Safe Properties
```css
/* DO animate */
transform: translateX(), translateY(), scale(), rotate();
opacity: 0-1;
filter: blur();

/* DO NOT animate */
width, height, top, left, margin, padding;
```

### will-change Strategy
```typescript
// Apply only during animation
element.style.willChange = 'transform, opacity';

// Remove after animation
animation.finished.then(() => {
  element.style.willChange = 'auto';
});
```

---

## 8. Component Structure

### Decision
Follow constitution's frontend architecture with dedicated landing page components.

### Structure
```
frontend/
├── Components/
│   ├── Header/
│   │   ├── Header.tsx          # Client component with scroll detection
│   │   ├── header.module.css   # Styles + animations
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx          # Client component for reveal animation
│   │   ├── footer.module.css
│   │   └── index.ts
│   ├── Hero/
│   │   ├── Hero.tsx            # Client component for interactive effects
│   │   ├── hero.module.css
│   │   └── index.ts
│   └── index.ts                # Barrel exports
├── features/
│   ├── HomePage/
│   │   ├── HomePage.tsx        # Orchestrates sections
│   │   ├── homePage.module.css
│   │   ├── sections/           # Content section components
│   │   └── index.ts
│   ├── AboutPage/
│   │   ├── AboutPage.tsx
│   │   ├── aboutPage.module.css
│   │   ├── sections/           # About-specific sections
│   │   └── index.ts
│   └── index.ts
└── app/
    ├── page.tsx                # Thin wrapper → HomePage
    └── about/page.tsx          # Thin wrapper → AboutPage
```

---

## Dependencies to Install

```bash
npm install motion
```

No additional dependencies required - CSS Modules and Next.js already configured.

---

## Research Complete

All NEEDS CLARIFICATION items resolved. Ready for Phase 1 design.
