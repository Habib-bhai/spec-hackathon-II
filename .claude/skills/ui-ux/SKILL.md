---
name: ui-ux
description: This skill should be used when designing, implementing, or refactoring frontend UI/UX. It specializes in creative, out-of-the-box design thinking using shadcn/ui and Aceternity UI as base design system, with customized components that go beyond imagination.
---

# UI/UX Design Skill

Creative UI/UX specialist that builds visually stunning, memorable interfaces.

## Core Philosophy

**Reject Convention**: No generic templates, standard palettes, or Bootstrap-like layouts. Every design should surprise and delight.

## Design Stack

### shadcn/ui - Base Layer
```bash
npx shadcn@latest add [component]
```
Accessible, functional components. Use as foundation.
- Forms: button, input, label, checkbox, select, textarea, switch
- Layout: card, separator, tabs, accordion, collapsible
- Feedback: alert, dialog, popover, sheet, toast, tooltip
- Navigation: breadcrumb, command, dropdown-menu, menubar
- Data: avatar, badge, calendar, chart, progress, table, skeleton

### Aceternity UI - Effects Layer
```bash
npx shadcn@latest add @aceternity/[component]
```
Backgrounds, animations, effects for interactivity.
- Backgrounds: aurora-background, background-gradient-animation, spotlight, background-ripple-effect, meteors
- Effects: sparkles, typewriter-effect, tracing-beam
- Sections: hero-section-demo-1/2, timeline, carousel, world-map, compare, resizable-navbar

## Design Principles

### Theme (Never Generic)
**Avoid**: blue/gray combos, Bootstrap cards, default shadows, common gradients

**Use**:
- Colors: warm+cool neutrals (coral+slate, peach+charcoal), muted+vibrant (gold+lime), monochromatic with glow (purple+lavender)
- Typography: contrasting pairings - Display (Geist, Inter Tight, Outfit, Space Grotesk) + Body (Inter, Geist Sans, DM Sans, JetBrains Mono)
- Spacing: "breathing room" - more white space than typical
- Shadows: multi-layered depth, not single shadow

### Animation
**Timing**:
- Micro: 150-300ms (hover, buttons)
- State: 300-500ms (modals, drawers)
- Page: 500-800ms (transitions)
- Ambient: 2-10s (backgrounds)

**Easing**:
- Standard: `cubic-bezier(0.4, 0, 0.2, 1)`
- Delight: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Premium: `cubic-bezier(0.16, 1, 0.3, 1)`

**Stagger**: Animate children with calculated delays (0ms, 50ms, 100ms...)

### Backgrounds
Never solid colors. Use low opacity (0.05-0.15), slow animations, blend modes (overlay/soft-light).

## Component Patterns

### Living Card
```
shadcn Card
  → custom border gradient
  → Aceternity spotlight (hover)
  → background-ripple-effect
  → staggered content reveal
```

### Intelligent Input
```
shadcn Input
  → cursor-following focus ring
  → sparkles on valid input
  → floating label transform
  → subtle meteors background
```

### Storytelling Button
```
shadcn Button
  → magnetic hover (moves toward cursor)
  → morphing background gradient
  → sparkles burst on click
  → aurora-background for loading
```

### Reveal Section
```
shadcn layout
  → Aceternity hero-section
  → tracing-beam connectors
  → scroll-triggered animations (parallax, fade, scale)
  → layout-grid on interaction
```

## Anti-Patterns

**Generic**: Bootstrap cards, default Tailwind colors, basic shadows, linear gradients, opacity-only hover

**Over-animated**: everything at once, blocking animations, >1s transitions, disorienting effects, constant motion

**Inaccessible**: color-only indicators, no focus states, low contrast, ignores prefers-reduced-motion, no keyboard support

## Quick Checklist

Before implementing:
- [ ] Unique color palette (not generic)?
- [ ] Unexpected but readable typography?
- [ ] shadcn/ui as accessible base?
- [ ] Aceternity effects layered meaningfully?
- [ ] Purposeful animations (feedback/guidance/delight)?
- [ ] Sufficient white space?
- [ ] Performant animations (transform/opacity)?
- [ ] Respects prefers-reduced-motion?
- [ ] Sufficient contrast?
- [ ] Surprises and delights?

## CSS Theme Example

```css
:root {
  --background: 250 20% 7%;
  --foreground: 250 10% 95%;
  --primary: 15 85% 60%;       /* Coral sunset */
  --secondary: 250 60% 35%;    /* Deep indigo */
  --accent: 35 90% 55%;         /* Golden warmth */
  --muted: 250 10% 15%;         /* Charcoal */
  --card: 250 20% 10%;
  --border: 250 15% 20%;
  --ring: 15 85% 60%;
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.3),
                 0 2px 4px -2px rgb(0 0 0 / 0.2);
  --shadow-glow: 0 0 20px -5px hsl(var(--primary) / 0.5);
}
```

---

**Goal**: Interfaces users remember—make them pause and say "wow" while remaining intuitive and accessible.
