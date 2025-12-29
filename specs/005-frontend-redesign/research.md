# Research: Premium Frontend Redesign

**Feature Branch**: `005-frontend-redesign`
**Date**: 2025-12-28

## Overview

This document consolidates research findings for implementing premium frontend animations using GSAP (GreenSock Animation Platform) in a Next.js/React application.

---

## 1. GSAP Library Selection

### Decision: GSAP 3.x with @gsap/react

**Rationale**:
- Industry-standard animation library used by major websites
- 784+ code snippets in documentation (high source reputation)
- Excellent React integration via `@gsap/react` package
- Built-in ScrollTrigger plugin for scroll-based animations
- Automatic cleanup via `useGSAP` hook prevents memory leaks

### Alternatives Evaluated

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| CSS Animations | Zero bundle size, native | No scroll triggers, no staggering, not interruptible | Insufficient for spec |
| Framer Motion | Great React API | ~60KB bundle, less control over timelines | Too heavy |
| React Spring | Physics-based | Weaker scroll animation support | Missing features |
| Anime.js | Lightweight | Less React-friendly, smaller community | Less suitable |

---

## 2. GSAP React Integration

### useGSAP Hook Pattern

The `@gsap/react` package provides a dedicated hook that:
- Replaces `useEffect`/`useLayoutEffect` for animations
- Automatically tracks and cleans up animations on unmount
- Supports scoped selectors to prevent conflicts
- SSR-compatible with Next.js App Router

```typescript
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function Component() {
  const container = useRef();

  useGSAP(() => {
    gsap.from('.box', { opacity: 0, y: 30, stagger: 0.1 });
  }, { scope: container });

  return <div ref={container}>...</div>;
}
```

### contextSafe for Event Handlers

Event-triggered animations require `contextSafe` wrapper:

```typescript
const { contextSafe } = useGSAP({ scope: cardRef });

const onMouseEnter = contextSafe(() => {
  gsap.to(cardRef.current, { y: -4, duration: 0.2 });
});
```

---

## 3. ScrollTrigger Integration

### Basic Scroll Animation

```typescript
gsap.from('.element', {
  scrollTrigger: '.element',
  y: 30,
  opacity: 0,
});
```

### Advanced Configuration

```typescript
gsap.from('.task-card', {
  y: 30,
  opacity: 0,
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.task-list',
    start: 'top 80%',      // Animation starts when trigger top hits 80% of viewport
    once: true,            // Only animate once (no re-trigger on scroll back)
  },
});
```

### Timeline with ScrollTrigger

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    start: 'top top',
    end: '+=500',
    scrub: 1,  // Smooth scrubbing tied to scroll position
  }
});

tl.from('.box', { scale: 0.3, opacity: 0 })
  .from('.text', { y: 50 });
```

---

## 4. Animation Patterns for Spec Requirements

### FR-006: Hover State Transitions (150ms-300ms)

```typescript
const onMouseEnter = contextSafe(() => {
  gsap.to(element, {
    y: -4,
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    duration: 0.2,
    ease: 'power2.out',
  });
});

const onMouseLeave = contextSafe(() => {
  gsap.to(element, {
    y: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    duration: 0.15,
    ease: 'power2.in',
  });
});
```

### FR-007: Task Card Elevation

```typescript
gsap.to(cardRef.current, {
  y: -4,
  boxShadow: '0 12px 24px -6px rgba(0,0,0,0.4)',
  duration: 0.2,
});
```

### FR-008: Modal Animations (300ms)

```typescript
// Enter animation
const enterTl = gsap.timeline({ paused: true });
enterTl
  .to('.modal-overlay', { opacity: 1, duration: 0.2 })
  .to('.modal-content', {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    ease: 'back.out(1.7)',
  }, '-=0.1');

// Exit animation (reverse)
enterTl.reverse();
```

### FR-009: Scroll-Triggered Stagger (50ms delay)

```typescript
gsap.from('.task-card', {
  y: 30,
  opacity: 0,
  stagger: 0.05,  // 50ms between each card
  duration: 0.5,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.task-list',
    start: 'top 80%',
    once: true,
  },
});
```

### FR-010: Reduced Motion Support

```typescript
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

useGSAP(() => {
  if (prefersReducedMotion) {
    // Skip animations, apply final state immediately
    gsap.set('.task-card', { opacity: 1, y: 0 });
    return;
  }

  // Run full animations
  gsap.from('.task-card', { y: 30, opacity: 0, stagger: 0.05 });
}, { scope: containerRef });
```

### FR-015: Error Shake Animation

```typescript
gsap.to(inputRef.current, {
  x: [-10, 10, -10, 10, 0],
  duration: 0.4,
  ease: 'power2.inOut',
});
```

---

## 5. Bundle Size Analysis

### GSAP Core
- `gsap` core: ~23KB gzipped
- `ScrollTrigger`: ~8KB gzipped
- `@gsap/react`: ~1KB gzipped
- **Total**: ~32KB gzipped

### Tree-Shaking Strategy

Only import what's needed:
```typescript
// lib/gsap/index.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

---

## 6. SSR Considerations (Next.js)

### Safe Initialization

```typescript
// Check for browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

### useGSAP Hook

The `useGSAP` hook handles SSR automatically:
- Uses `useLayoutEffect` on client
- Uses `useEffect` on server
- No hydration mismatches

---

## 7. Performance Best Practices

### Use transforms over layout properties
```typescript
// Good: GPU-accelerated
gsap.to(element, { x: 100, y: 50, scale: 1.1 });

// Avoid: Triggers layout reflow
gsap.to(element, { left: 100, top: 50, width: '110%' });
```

### Use `will-change` sparingly
CSS Modules can hint at animated elements:
```css
.task-card {
  will-change: transform, box-shadow;
}
```

### Batch animations with timelines
```typescript
const tl = gsap.timeline();
tl.to('.a', { x: 100 })
  .to('.b', { x: 100 }, '<')  // Start at same time
  .to('.c', { x: 100 }, '<'); // Start at same time
```

---

## 8. Conclusions

1. **GSAP is the optimal choice** for this premium redesign due to its ScrollTrigger capability, timeline sequencing, and React integration.

2. **Bundle impact is acceptable** (~32KB) given the animation complexity required by the spec.

3. **useGSAP hook simplifies React integration** with automatic cleanup and scoped selectors.

4. **Reduced motion support** must be implemented for accessibility compliance (FR-010).

5. **All 22 functional requirements** can be achieved with GSAP + CSS Modules.
