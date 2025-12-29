# Data Model: Design Tokens

**Feature Branch**: `005-frontend-redesign`
**Date**: 2025-12-28

## Overview

This document defines the design token system for the premium frontend redesign. Tokens are implemented as CSS custom properties for consistency across all components.

---

## Color Tokens

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background-primary` | `#1a1a2e` | Main page background |
| `--color-background-secondary` | `#252541` | Card backgrounds, elevated surfaces |
| `--color-background-tertiary` | `#32373c` | Subtle distinction areas |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-primary` | `#fa451f` | Primary CTAs, highlights, priority indicators |
| `--color-accent-secondary` | `#0170B9` | Links, secondary actions |
| `--color-accent-success` | `#83d2e4` | Success states, completed tasks |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#ffffff` | Primary text on dark backgrounds |
| `--color-text-secondary` | `#f5f5f5` | Secondary text, descriptions |
| `--color-text-muted` | `#a0a0b0` | Placeholder text, timestamps |
| `--color-text-error` | `#ff4d4d` | Error messages |

### State Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-priority-critical` | `#ff3b30` | Critical priority indicator |
| `--color-priority-high` | `#ff9500` | High priority indicator |
| `--color-priority-medium` | `#ffcc00` | Medium priority indicator |
| `--color-priority-low` | `#34c759` | Low priority indicator |

### Border & Overlay

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-default` | `rgba(255, 255, 255, 0.1)` | Default borders |
| `--color-border-focus` | `#fa451f` | Focus ring color |
| `--color-overlay` | `rgba(0, 0, 0, 0.8)` | Modal backdrop |

---

## Typography Tokens

### Font Family

| Token | Value |
|-------|-------|
| `--font-family-primary` | `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-family-mono` | `'Fira Code', 'Monaco', monospace` |

### Font Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `--font-size-xs` | `0.75rem` (12px) | Small labels, timestamps |
| `--font-size-sm` | `0.875rem` (14px) | Secondary text |
| `--font-size-base` | `1rem` (16px) | Body text |
| `--font-size-lg` | `1.125rem` (18px) | Card titles |
| `--font-size-xl` | `1.25rem` (20px) | Section headers |
| `--font-size-2xl` | `1.5rem` (24px) | Page titles |
| `--font-size-3xl` | `2rem` (32px) | Hero text |
| `--font-size-4xl` | `2.625rem` (42px) | Large hero headings |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | `400` | Body text |
| `--font-weight-medium` | `500` | Emphasized text |
| `--font-weight-semibold` | `600` | Headings |
| `--font-weight-bold` | `700` | Strong emphasis |

### Line Heights

| Token | Value |
|-------|-------|
| `--line-height-tight` | `1.25` |
| `--line-height-normal` | `1.5` |
| `--line-height-relaxed` | `1.75` |

---

## Spacing Tokens

Based on 4px base unit (0.25rem):

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-1` | `0.25rem` (4px) | Micro gaps |
| `--spacing-2` | `0.5rem` (8px) | Tight gaps |
| `--spacing-3` | `0.75rem` (12px) | Small gaps |
| `--spacing-4` | `1rem` (16px) | Default spacing |
| `--spacing-5` | `1.25rem` (20px) | Medium gaps |
| `--spacing-6` | `1.5rem` (24px) | Section padding |
| `--spacing-8` | `2rem` (32px) | Large gaps |
| `--spacing-10` | `2.5rem` (40px) | Section margins |
| `--spacing-12` | `3rem` (48px) | Page padding |

---

## Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.2)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.3)` | Cards at rest |
| `--shadow-lg` | `0 8px 16px -4px rgba(0, 0, 0, 0.4)` | Card hover |
| `--shadow-xl` | `0 12px 24px -6px rgba(0, 0, 0, 0.5)` | Modals, dropdowns |
| `--shadow-glow-primary` | `0 0 20px rgba(250, 69, 31, 0.4)` | Accent glow effect |
| `--shadow-glow-secondary` | `0 0 20px rgba(1, 112, 185, 0.4)` | Secondary glow |

---

## Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.25rem` (4px) | Small elements |
| `--radius-md` | `0.5rem` (8px) | Buttons, inputs |
| `--radius-lg` | `1rem` (16px) | Cards |
| `--radius-xl` | `1.5rem` (24px) | Modals |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Animation Tokens

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `100ms` | Immediate feedback |
| `--duration-fast` | `150ms` | Quick interactions |
| `--duration-normal` | `300ms` | Standard transitions |
| `--duration-slow` | `500ms` | Emphasis animations |
| `--duration-slower` | `800ms` | Page transitions |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Accelerating |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Decelerating |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot |

### GSAP Ease Equivalents

| CSS Token | GSAP Equivalent |
|-----------|-----------------|
| `--ease-in` | `power2.in` |
| `--ease-out` | `power2.out` |
| `--ease-in-out` | `power2.inOut` |
| `--ease-bounce` | `back.out(1.7)` |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default layer |
| `--z-dropdown` | `100` | Dropdowns |
| `--z-sticky` | `200` | Sticky headers |
| `--z-modal-backdrop` | `900` | Modal overlay |
| `--z-modal` | `1000` | Modal content |
| `--z-toast` | `1100` | Notifications |

---

## Breakpoints

| Token | Value | Description |
|-------|-------|-------------|
| `--breakpoint-sm` | `640px` | Mobile landscape |
| `--breakpoint-md` | `768px` | Tablet |
| `--breakpoint-lg` | `1024px` | Laptop |
| `--breakpoint-xl` | `1240px` | Desktop |

---

## CSS Implementation

```css
/* frontend/styles/design-tokens.css */

:root {
  /* Colors - Primary */
  --color-background-primary: #1a1a2e;
  --color-background-secondary: #252541;
  --color-background-tertiary: #32373c;

  /* Colors - Accent */
  --color-accent-primary: #fa451f;
  --color-accent-secondary: #0170B9;
  --color-accent-success: #83d2e4;

  /* Colors - Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #f5f5f5;
  --color-text-muted: #a0a0b0;
  --color-text-error: #ff4d4d;

  /* Colors - Priority */
  --color-priority-critical: #ff3b30;
  --color-priority-high: #ff9500;
  --color-priority-medium: #ffcc00;
  --color-priority-low: #34c759;

  /* Colors - Border & Overlay */
  --color-border-default: rgba(255, 255, 255, 0.1);
  --color-border-focus: #fa451f;
  --color-overlay: rgba(0, 0, 0, 0.8);

  /* Typography */
  --font-family-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Monaco', monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.625rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 12px 24px -6px rgba(0, 0, 0, 0.5);
  --shadow-glow-primary: 0 0 20px rgba(250, 69, 31, 0.4);
  --shadow-glow-secondary: 0 0 20px rgba(1, 112, 185, 0.4);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Animation */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-Index */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 900;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

---

## Entity Relationships

### Design Token → Component Mapping

```
Design Tokens (CSS Custom Properties)
├── Colors
│   ├── TaskCard → background-secondary, text-primary, priority colors
│   ├── Button → accent-primary, text-primary
│   ├── Input → background-tertiary, border colors, text colors
│   └── Modal → overlay, background-secondary
├── Typography
│   ├── Headings → font-size-xl to 4xl, weight-semibold/bold
│   └── Body → font-size-base/sm, weight-normal
├── Spacing
│   ├── Cards → spacing-4 to spacing-6
│   └── Layout → spacing-8 to spacing-12
├── Shadows
│   ├── Card rest → shadow-md
│   ├── Card hover → shadow-lg
│   └── Modal → shadow-xl
└── Animation
    ├── Hover → duration-fast, ease-out
    ├── Modal → duration-normal, ease-bounce
    └── Scroll → duration-slow, ease-out
```

---

## Validation Rules

1. **Color Contrast**: All text colors must meet WCAG AA standards (4.5:1 for normal text)
2. **Animation Duration**: No animation exceeds 800ms per spec SC-002
3. **Spacing Consistency**: Only use defined spacing tokens
4. **Shadow Layering**: Use appropriate shadow for elevation level
