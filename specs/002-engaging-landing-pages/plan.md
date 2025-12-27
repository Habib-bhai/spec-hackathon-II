# Implementation Plan: Engaging Landing Pages

**Branch**: `002-engaging-landing-pages` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-engaging-landing-pages/spec.md`

## Summary

Recreate the home page, about page, header, footer, and hero components with highly engaging UI/UX and expert animation capabilities. The implementation uses a coral/slate color palette, scroll-triggered animations via Motion library, and creative effects designed through the **ui-ux skill** including magnetic hover effects, staggered reveals, and ambient background animations. All animations respect `prefers-reduced-motion` and target 60fps performance.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.x (App Router), React 19.x, Motion (animation library)
**Storage**: N/A (frontend-only feature, no backend/database)
**Testing**: Jest + React Testing Library for component tests
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - modern versions)
**Project Type**: Web application (frontend-only for this feature)
**Performance Goals**: 60fps animations, LCP < 1.5s, CLS = 0
**Constraints**: Animations < 600ms entrance, < 100ms micro-interactions, prefers-reduced-motion support
**Scale/Scope**: 2 pages (Home, About), 3 core components (Header, Footer, Hero), 6+ section components

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Type Safety First | PASS | All components use explicit TypeScript interfaces (see data-model.md) |
| II. Documentation via Context7 MCP | PASS | Next.js App Router and Motion docs researched via Context7 (see research.md) |
| III. Spec-Driven Development | PASS | Following SDD workflow: spec → plan → tasks |
| IV. Authentication via Better Auth | N/A | No auth required for landing pages |
| V. Full-Stack Type Consistency | PASS | TypeScript interfaces defined for all props |
| VI. Developer Productivity Focus | PASS | CSS Modules for scoped styling, Motion for clean animation API |

**Constitution Compliance**: FULL COMPLIANCE - No violations requiring justification.

---

## Skills Used (Mandatory)

### ui-ux Skill
The **ui-ux skill** from `.claude/skills/ui-ux/SKILL.md` was invoked to design:

1. **Color Palette**: Coral sunset + slate night theme
   - `--landing-primary: 12 85% 62%` (coral)
   - `--landing-bg: 220 25% 6%` (deep slate)
   - `--landing-accent: 32 95% 58%` (golden amber)

2. **Animation Architecture**:
   - **Hero "Gravity Pull"**: Background particles drift toward CTA center
   - **Header "Glass Morphism Transform"**: Transparent → compact blur on scroll
   - **Footer "Rising Reveal"**: Content emerges with wave distortion effect
   - **Sections "Constellation Pattern"**: Connected nodes with drawing lines

3. **Micro-interactions**:
   - Magnetic hover on CTA buttons (moves toward cursor)
   - Underline draw effect on nav links
   - Sparkle burst on click
   - Staggered cascade reveals for mobile menu

4. **Animation Timing**:
   - Micro: 150-300ms (hovers)
   - State: 300-500ms (modals)
   - Page: 500-800ms (entrances)
   - Ambient: 2-10s (backgrounds)

5. **Easing Functions**:
   - Standard: `cubic-bezier(0.4, 0, 0.2, 1)`
   - Delight: `cubic-bezier(0.34, 1.56, 0.64, 1)`
   - Premium: `cubic-bezier(0.16, 1, 0.3, 1)`

---

## Project Structure

### Documentation (this feature)

```text
specs/002-engaging-landing-pages/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions and rationale
├── data-model.md        # TypeScript interfaces
├── quickstart.md        # Setup instructions
├── checklists/
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (frontend only)

```text
frontend/
├── app/
│   ├── globals.css           # Landing page color variables added
│   ├── layout.tsx            # Root layout (Header, Footer integration)
│   ├── page.tsx              # HomePage wrapper (Server Component)
│   └── about/
│       └── page.tsx          # AboutPage wrapper (Server Component)
│
├── Components/
│   ├── Header/
│   │   ├── Header.tsx        # Client Component - scroll detection, mobile menu
│   │   ├── header.module.css # Glassmorphism, underline draw, cascade reveal
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx        # Client Component - reveal animation
│   │   ├── footer.module.css # Rising reveal, staggered columns
│   │   └── index.ts
│   ├── Hero/
│   │   ├── Hero.tsx          # Client Component - interactive effects
│   │   ├── hero.module.css   # Gravity pull, spotlight, meteors
│   │   └── index.ts
│   └── index.ts              # Barrel exports
│
├── features/
│   ├── HomePage/
│   │   ├── HomePage.tsx      # Client Component - orchestrates sections
│   │   ├── homePage.module.css
│   │   ├── sections/
│   │   │   ├── FeaturesSection.tsx    # Constellation pattern
│   │   │   ├── StatsSection.tsx       # Counter reveal
│   │   │   ├── TestimonialsSection.tsx # Carousel depth
│   │   │   └── CTASection.tsx         # Aurora glow
│   │   └── index.ts
│   ├── AboutPage/
│   │   ├── AboutPage.tsx     # Client Component
│   │   ├── aboutPage.module.css
│   │   ├── sections/
│   │   │   ├── AboutHero.tsx         # Typewriter reveal
│   │   │   ├── MissionSection.tsx    # Quote char-by-char
│   │   │   ├── ValuesTimeline.tsx    # Timeline draw
│   │   │   └── AboutCTA.tsx          # Parallax + aurora
│   │   └── index.ts
│   └── index.ts
│
├── hooks/
│   ├── useScrollPosition.ts   # Scroll detection for header
│   ├── useInView.ts           # Wrapper for Motion inView
│   └── useMousePosition.ts    # Mouse tracking for magnetic effects
│
├── lib/
│   └── animations/
│       ├── config.ts          # Animation constants (durations, easings)
│       └── effects.ts         # Reusable animation presets
│
└── types/
    └── landing.ts             # TypeScript interfaces from data-model.md
```

**Structure Decision**: Frontend-only implementation following constitution's architecture with Components/ for reusable UI and features/ for page orchestration. Added hooks/ for animation utilities and lib/animations/ for shared configuration.

---

## Architecture Design

### Component Hierarchy

```
app/layout.tsx (Server Component)
├── Header (Client Component)
│   ├── Logo
│   ├── DesktopNav
│   │   └── NavLink (with underline draw)
│   ├── MobileMenuButton
│   ├── MobileMenu (overlay with cascade)
│   └── CTAButton (magnetic hover)
├── {children} - page content
└── Footer (Client Component)
    ├── FooterLogo
    ├── LinkColumns (staggered reveal)
    ├── SocialLinks
    └── Copyright

app/page.tsx (Server Component)
└── HomePage (Client Component)
    ├── Hero
    │   ├── BackgroundEffects (gradient mesh, orbs, meteors)
    │   ├── Spotlight (mouse-reactive)
    │   ├── Headline (char-by-char reveal)
    │   ├── Subheadline (blur-up)
    │   └── CTAButtons (magnetic hover)
    ├── FeaturesSection (constellation pattern)
    ├── StatsSection (counter reveal)
    ├── TestimonialsSection (carousel depth)
    └── CTASection (aurora glow)

app/about/page.tsx (Server Component)
└── AboutPage (Client Component)
    ├── AboutHero (typewriter)
    ├── MissionSection (quote reveal)
    ├── ValuesTimeline (draw animation)
    └── AboutCTA (parallax + aurora)
```

### Animation Flow

```
Page Load Sequence (800ms total):
┌──────────────────────────────────────────────────────┐
│ 0ms    Header fades in                               │
│ 100ms  Hero background gradient appears              │
│ 200ms  Hero headline chars reveal (stagger 30ms)     │
│ 400ms  Hero subheadline blurs up                     │
│ 600ms  Hero CTA scales in with bounce                │
│ 800ms  Ambient animations begin (continuous)         │
└──────────────────────────────────────────────────────┘

Scroll-Triggered (per section):
┌──────────────────────────────────────────────────────┐
│ Element enters viewport (threshold: 0.25)            │
│     ↓                                                │
│ Animation triggered (duration: 300-600ms)            │
│     ↓                                                │
│ Final state reached (no reversal on scroll out)      │
└──────────────────────────────────────────────────────┘
```

### State Management

No global state required. Component-local state only:
- `Header`: `isScrolled`, `isMobileMenuOpen`
- `Hero`: `mousePosition` (for spotlight)
- `Sections`: `hasAnimated` (prevent re-animation)

---

## Key Technical Decisions

### 1. Motion Library over Framer Motion
- **Decision**: Use `motion` package (3KB) instead of `framer-motion` (30KB)
- **Rationale**: Smaller bundle, same `inView` API, sufficient for scroll triggers
- **Reference**: research.md Section 1

### 2. CSS Animations as Primary
- **Decision**: CSS animations for transforms/opacity, Motion only for scroll triggers
- **Rationale**: GPU-accelerated by default, no JS overhead for simple animations
- **Reference**: ui-ux skill guidelines

### 3. Client Components for Animation
- **Decision**: All animated components use `'use client'` directive
- **Rationale**: Required for useEffect, useState, event listeners per Next.js App Router
- **Reference**: Context7 Next.js documentation

### 4. Intersection Observer Pattern
- **Decision**: Use Motion's `inView` with threshold options
- **Rationale**: Native browser API, optimal performance, cleaner than scroll listeners
- **Reference**: research.md Section 3

---

## Complexity Tracking

> No violations requiring justification. All decisions align with constitution.

| Aspect | Complexity Level | Justification |
|--------|------------------|---------------|
| Animation System | Medium | Required for engaging UX per spec |
| Component Count | Medium | 15+ components but clear separation |
| Dependencies | Low | Only adding `motion` package |
| State Management | Low | Component-local only |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Animation performance issues | Medium | High | GPU-only properties, will-change strategy, performance testing |
| Layout shifts (CLS) | Low | High | Reserve space for animated elements, test with Lighthouse |
| Accessibility issues | Low | High | prefers-reduced-motion support, keyboard navigation |
| Bundle size increase | Low | Medium | Motion is only 3KB, tree-shaking enabled |

---

## Phase Artifacts

| Artifact | Status | Path |
|----------|--------|------|
| research.md | Complete | specs/002-engaging-landing-pages/research.md |
| data-model.md | Complete | specs/002-engaging-landing-pages/data-model.md |
| quickstart.md | Complete | specs/002-engaging-landing-pages/quickstart.md |
| contracts/ | N/A | No API contracts (frontend-only) |
| tasks.md | Pending | Created by `/sp.tasks` command |

---

## Next Steps

1. Run `/sp.tasks` to generate dependency-ordered implementation tasks
2. Tasks will be organized by user story priority (P1 → P2 → P3)
3. Each task will include specific acceptance criteria from spec
4. Implementation follows TDD approach per constitution

---

**Plan Status**: COMPLETE - Ready for `/sp.tasks`
