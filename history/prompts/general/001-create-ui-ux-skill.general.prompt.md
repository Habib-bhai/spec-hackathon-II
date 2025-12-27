---
id: 001
title: Create UI/UX skill
stage: general
date: 2024-12-23
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: Habib
command: use context7 mcp server and fetch syntax for creating skills in the /.claude directory. and create a UI/UX skill that does these: 1) makes the agent think out of the box in designing, theme creation, font selection and animations (doesn't choose generic things) 2) must use shadcn and aceternity UI components (after fetching their docs and commands using context7 mcp server) as the base of its design system. 3) customize those components to go out of the box and create beyond imagination frontend and UI/UX.
labels: ["skills","ui","ux","shadcn","aceternity","creativity"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/ui-ux/SKILL.md
tests: []

---

## Prompt

use context7 mcp server and fetch syntax for creating skills in the /.claude directory. and create a UI/UX skill that does these: 1) makes the agent think out of the box in designing, theme creation, font selection and animations (doesn't choose generic things) 2) must use shadcn and aceternity UI components (after fetching their docs and commands using context7 mcp server) as the base of its design system. 3) customize those components to go out of the box and create beyond imagination frontend and UI/UX.

## Response snapshot

Created comprehensive UI/UX skill at `.claude/skills/ui-ux/SKILL.md` with:

**Skill Metadata:**
- name: ui-ux
- description: This skill should be used when designing, implementing, or refactoring frontend UI/UX. It specializes in creative, out-of-the-box design thinking using shadcn/ui and Aceternity UI as base design system, with customized components that go beyond imagination.

**Key Sections (Condensed from ~490 to ~146 lines):**
1. Core Philosophy - Reject convention, surprise and delight
2. Design Stack - shadcn/ui base + Aceternity UI effects layer
3. Design Principles:
   - Theme (never generic - unique colors, contrasting typography, breathing space, multi-layer shadows)
   - Animation (timing, easing curves, stagger delays)
   - Backgrounds (never solid, low opacity, blend modes)
4. Component Patterns - 4 transformation patterns:
   - Living Card: shadcn → border gradient → spotlight → ripple → stagger
   - Intelligent Input: shadcn → focus ring → sparkles → floating label → meteors
   - Storytelling Button: shadcn → magnetic hover → morphing gradient → sparkles burst → aurora
   - Reveal Section: shadcn → hero → tracing-beam → scroll animations → layout-grid
5. Anti-Patterns - Generic, over-animated, inaccessible designs
6. Quick Checklist - 10-point validation
7. CSS Theme Example - Copy-paste ready "Sunset Glow"

**Component Libraries with CLI Commands:**
- shadcn/ui: `npx shadcn@latest add [component]` - Accessible base
- Aceternity UI: `npx shadcn@latest add @aceternity/[component]` - Effects layer

**Design Transformation Patterns:**
- Card: shadcn Card + spotlight + ripple + staggered reveal
- Input: shadcn Input + focus ring + sparkles + floating label + meteors
- Button: shadcn Button + magnetic hover + morphing gradient + sparkles + aurora
- Section: shadcn layout + hero + tracing-beam + scroll animations

**Key Principles Enforced:**
- Reject standard colors, generic gradients, Bootstrap layouts
- Multi-layered effects for depth
- Purposeful animations with proper timing/easing
- Accessibility maintained (contrast, keyboard, prefers-reduced-motion)

## Outcome

- Impact: High - New skill will transform agent into creative UI/UX specialist that builds beyond-imagination interfaces
- Tests: N/A (skill creation)
- Files: Created .claude/skills/ui-ux/SKILL.md
- Next prompts: None
- Reflection: Successfully created comprehensive skill that balances creativity with accessibility, provides concrete implementation patterns, and includes complete documentation for both shadcn/ui and Aceternity UI

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill by using it to redesign an existing component
