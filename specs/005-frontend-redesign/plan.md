# Implementation Plan: Premium Frontend Redesign

**Branch**: `005-frontend-redesign` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-frontend-redesign/spec.md`

## Summary

Premium frontend redesign implementing sophisticated animations, modern typography (Poppins), and a refined dark theme inspired by Nauticus Robotics and Nulixir websites. Uses GSAP (GreenSock Animation Platform) for advanced animations including scroll-triggered reveals, timeline-based sequences, and interactive micro-interactions that go beyond traditional CSS capabilities.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**:
- Next.js 14+ (App Router)
- GSAP 3.x (`gsap`, `@gsap/react`)
- GSAP ScrollTrigger plugin
- CSS Modules for styling
**Storage**: N/A (frontend-only feature)
**Testing**: Jest + React Testing Library
**Target Platform**: Web (Desktop, Tablet, Mobile)
**Project Type**: Web application (frontend-focused enhancement)
**Performance Goals**:
- 60fps animations
- < 1.5s First Contentful Paint
- < 400ms page transitions
**Constraints**:
- < 50KB GSAP bundle (tree-shakeable)
- Respect prefers-reduced-motion
- SSR-compatible (Next.js)
**Scale/Scope**: ~15 components to enhance

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Type Safety First | PASS | All GSAP animations will be typed; useGSAP hook provides TypeScript support |
| Documentation via Context7 MCP | PASS | GSAP, ScrollTrigger, and @gsap/react docs researched |
| Spec-Driven Development | PASS | Following spec.md with 22 functional requirements |
| CSS Modules Convention | PASS | Continuing CSS Modules pattern for styling |
| Full-Stack Type Consistency | N/A | Frontend-only feature |
| Developer Productivity Focus | PASS | GSAP + useGSAP simplifies animation management |

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output - GSAP patterns
├── data-model.md        # Phase 1 output - Design tokens
├── quickstart.md        # Phase 1 output - Setup guide
├── contracts/           # N/A (no API changes)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── lib/
│   └── gsap/
│       ├── index.ts           # GSAP registration and exports
│       ├── animations.ts      # Reusable animation presets
│       └── hooks/
│           └── useScrollAnimation.ts  # Custom scroll animation hook
├── styles/
│   └── design-tokens.css      # CSS custom properties
├── Components/
│   ├── TaskCard/
│   │   ├── TaskCard.tsx       # Enhanced with GSAP hover effects
│   │   └── TaskCard.module.css
│   ├── EditTaskModal/
│   │   ├── EditTaskModal.tsx  # Enhanced with GSAP modal animations
│   │   └── EditTaskModal.module.css
│   └── ... (other components)
├── features/
│   └── Dashboard/
│       ├── Dashboard.tsx      # Scroll animations, staggered reveals
│       └── Dashboard.module.css
└── app/
    └── layout.tsx             # Poppins font loading
```

**Structure Decision**: Enhance existing frontend structure with new `lib/gsap/` directory for animation utilities. Design tokens centralized in `styles/design-tokens.css`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| GSAP library (new dependency) | Enables advanced animations beyond CSS capabilities: ScrollTrigger, timeline sequencing, physics-based easing | CSS-only animations cannot achieve scroll-triggered staggered reveals, complex timelines, or the premium micro-interactions specified |

---

## Phase 0: Research & Discovery

### GSAP Integration Strategy

**Decision**: Use `@gsap/react` with `useGSAP` hook for React integration

**Rationale**:
- Automatic animation cleanup prevents memory leaks
- SSR-compatible with Next.js App Router
- Scoped selectors prevent animation conflicts
- TypeScript support built-in

**Alternatives Considered**:
- CSS animations only: Insufficient for scroll-triggered staggered effects
- Framer Motion: Heavier bundle, less control over complex timelines
- React Spring: Excellent for spring physics, but weaker for scroll-based animations

### GSAP ScrollTrigger Pattern

**Decision**: Use ScrollTrigger for entrance animations with `once: true`

**Rationale**:
- Elements animate once when entering viewport (per FR-009)
- Staggered timing achievable with `stagger` property
- Pinning not needed for this use case

**Implementation Pattern**:
```typescript
useGSAP(() => {
  gsap.from('.task-card', {
    y: 30,
    opacity: 0,
    stagger: 0.05,
    scrollTrigger: {
      trigger: '.task-list',
      start: 'top 80%',
      once: true,
    },
  });
}, { scope: containerRef });
```

### Hover Animation Pattern

**Decision**: Use timeline-based hover animations with `contextSafe`

**Rationale**:
- Timelines allow sequenced multi-property animations
- `contextSafe` wrapper enables event handler animations
- Reversible animations create satisfying hover-out effects

**Implementation Pattern**:
```typescript
const { contextSafe } = useGSAP({ scope: cardRef });

const onMouseEnter = contextSafe(() => {
  gsap.to(cardRef.current, {
    y: -4,
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    duration: 0.2,
  });
});
```

### Modal Animation Pattern

**Decision**: Use GSAP timeline for modal enter/exit with backdrop blur

**Rationale**:
- CSS `animation` property cannot be interrupted mid-flight
- GSAP timelines can reverse smoothly when user closes quickly
- Scale + fade creates premium feel per FR-008

**Implementation Pattern**:
```typescript
const tl = gsap.timeline({ paused: true });
tl.to('.modal-overlay', { opacity: 1, duration: 0.2 })
  .to('.modal-content', {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    ease: 'back.out(1.7)'
  }, '-=0.1');
```

### Reduced Motion Support

**Decision**: Check `prefers-reduced-motion` before GSAP animations

**Rationale**: FR-010 requires respecting user accessibility preferences

**Implementation Pattern**:
```typescript
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Run GSAP animations
}
```

---

## Phase 1: Design & Architecture

### Design Tokens

See [data-model.md](./data-model.md) for complete token definitions.

**Key Tokens**:
- Colors: `--color-background`, `--color-accent-primary`, `--color-accent-secondary`
- Typography: `--font-family-primary` (Poppins), weight scale
- Spacing: 8px base unit scale
- Shadows: `--shadow-elevation-1` through `--shadow-elevation-3`
- Animation: `--duration-fast` (150ms), `--duration-normal` (300ms), `--duration-slow` (500ms)

### Component Enhancement Map

| Component | GSAP Enhancements | CSS Module Updates |
|-----------|------------------|-------------------|
| TaskCard | Hover elevation, button glow effects | New color tokens, shadow system |
| TaskList | Scroll-triggered staggered entrance | Spacing adjustments |
| EditTaskModal | Scale+fade enter/exit, backdrop blur | Modal styling updates |
| Dashboard | Container scroll animations | Layout refinements |
| Button (shared) | Hover translate, click scale | Gradient backgrounds, glow states |
| Input (shared) | Focus glow, error shake | Focus ring styling |

### Animation Presets

Centralized in `lib/gsap/animations.ts`:

1. **fadeInUp**: `{ y: 30, opacity: 0, duration: 0.5 }`
2. **scaleIn**: `{ scale: 0.95, opacity: 0, duration: 0.3 }`
3. **hoverElevate**: `{ y: -4, boxShadow: elevated, duration: 0.2 }`
4. **shake**: `{ x: [-10, 10, -10, 10, 0], duration: 0.4 }`
5. **pulse**: `{ scale: [1, 1.05, 1], duration: 0.6, repeat: -1 }`

### GSAP Bundle Strategy

**Tree-shaking approach**:
```typescript
// lib/gsap/index.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
```

### Font Loading Strategy

**Next.js Font Optimization**:
```typescript
// app/layout.tsx
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
```

---

## Architecture Decision: GSAP over CSS Animations

**Context**: Spec requires scroll-triggered reveals, staggered list animations, and interruptible modal transitions.

**Decision**: Use GSAP with ScrollTrigger plugin for all complex animations; CSS transitions for simple hover states.

**Consequences**:
- (+) Professional-grade animation quality matching inspiration sites
- (+) Interruptible animations prevent visual glitches
- (+) Unified animation API across all components
- (+) ScrollTrigger handles viewport detection automatically
- (-) ~30KB additional bundle size (gzipped)
- (-) Learning curve for developers unfamiliar with GSAP

**Mitigation**: Bundle size acceptable for premium UX; document patterns in quickstart.md.

---

## Files to Create

1. `specs/005-frontend-redesign/research.md` - Research findings (this plan consolidates it)
2. `specs/005-frontend-redesign/data-model.md` - Design token definitions
3. `specs/005-frontend-redesign/quickstart.md` - Developer setup guide
4. `frontend/lib/gsap/index.ts` - GSAP registration
5. `frontend/lib/gsap/animations.ts` - Animation presets
6. `frontend/lib/gsap/hooks/useScrollAnimation.ts` - Custom hook
7. `frontend/styles/design-tokens.css` - CSS custom properties

## Files to Modify

1. `frontend/app/layout.tsx` - Add Poppins font
2. `frontend/Components/TaskCard/TaskCard.tsx` - GSAP hover effects
3. `frontend/Components/TaskCard/TaskCard.module.css` - New design tokens
4. `frontend/Components/EditTaskModal/EditTaskModal.tsx` - Modal animations
5. `frontend/Components/EditTaskModal/EditTaskModal.module.css` - Modal styling
6. `frontend/features/Dashboard/Dashboard.tsx` - Scroll animations
7. `frontend/features/Dashboard/Dashboard.module.css` - Dashboard styling
8. `frontend/package.json` - Add GSAP dependencies

---

## Next Steps

Run `/sp.tasks` to generate actionable implementation tasks from this plan.
