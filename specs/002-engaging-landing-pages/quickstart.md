# Quickstart: Engaging Landing Pages

**Feature**: 002-engaging-landing-pages
**Date**: 2025-12-26

## Prerequisites

- Node.js 18+
- pnpm/npm installed
- Frontend already configured (Next.js App Router)

## Setup

### 1. Install Motion Library

```bash
cd frontend
npm install motion
```

### 2. Verify CSS Modules Setup

CSS Modules should already be configured. Verify in `next.config.ts`:

```typescript
// Should work by default - CSS Modules are built-in to Next.js
```

### 3. Add Landing Page Color Variables

Add to `frontend/app/globals.css`:

```css
:root {
  /* Landing Page Colors */
  --landing-bg: 220 25% 6%;
  --landing-fg: 30 15% 95%;
  --landing-primary: 12 85% 62%;
  --landing-primary-glow: 12 90% 55%;
  --landing-secondary: 220 45% 25%;
  --landing-accent: 32 95% 58%;
  --landing-muted: 220 20% 12%;

  /* Animation Easing */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-delight: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadow System */
  --shadow-ambient: 0 8px 32px -8px hsl(12 85% 40% / 0.25);
  --shadow-elevated: 0 24px 48px -12px hsl(220 50% 5% / 0.5),
                     0 12px 24px -8px hsl(12 85% 40% / 0.15);
  --shadow-glow-coral: 0 0 40px -10px hsl(var(--landing-primary-glow) / 0.6);
}
```

## Development Commands

```bash
# Start development server
cd frontend
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build
```

## File Structure

After implementation, structure will be:

```
frontend/
├── Components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── header.module.css
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── footer.module.css
│   │   └── index.ts
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   ├── hero.module.css
│   │   └── index.ts
│   └── index.ts
├── features/
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   ├── homePage.module.css
│   │   ├── sections/
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── CTASection.tsx
│   │   └── index.ts
│   ├── AboutPage/
│   │   ├── AboutPage.tsx
│   │   ├── aboutPage.module.css
│   │   ├── sections/
│   │   │   ├── MissionSection.tsx
│   │   │   ├── ValuesSection.tsx
│   │   │   └── CTASection.tsx
│   │   └── index.ts
│   └── index.ts
└── app/
    ├── page.tsx
    └── about/page.tsx
```

## Quick Verification

After setup, verify:

1. **Motion installed**: `npm list motion` shows version
2. **Dev server runs**: `npm run dev` starts without errors
3. **CSS variables work**: Inspect root element, see `--landing-*` vars

## Common Issues

### Motion not found
```bash
npm install motion
```

### CSS Modules not scoping
- Ensure files end with `.module.css`
- Import as: `import styles from './component.module.css'`

### Animations janky
- Check browser dev tools Performance tab
- Ensure only `transform` and `opacity` are animated
- Verify `will-change` is applied dynamically

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Follow tasks in priority order (P1 → P2 → P3)
3. Test each component in isolation before integration
