# Tasks: Engaging Landing Pages

**Input**: Design documents from `/specs/002-engaging-landing-pages/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: NOT included (not explicitly requested in spec). Tests can be added later.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Skills**: Usage of **ui-ux skill** is MANDATORY for creative animation effects per plan requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory
- Components: `frontend/Components/`
- Features: `frontend/features/`
- Hooks: `frontend/hooks/`
- Types: `frontend/types/`
- Lib: `frontend/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and shared configuration

- [ ] T001 Install Motion animation library in frontend/package.json via `npm install motion`
- [ ] T002 [P] Create TypeScript interfaces from data-model.md in frontend/types/landing.ts
- [ ] T003 [P] Add landing page color variables (coral/slate palette) to frontend/app/globals.css
- [ ] T004 [P] Create animation configuration constants (durations, easings) in frontend/lib/animations/config.ts
- [ ] T005 [P] Create reusable animation effects presets in frontend/lib/animations/effects.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Custom hooks and utilities that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create useScrollPosition hook for header scroll detection in frontend/hooks/useScrollPosition.ts
- [ ] T007 [P] Create useInView hook wrapper for Motion inView in frontend/hooks/useInView.ts
- [ ] T008 [P] Create useMousePosition hook for magnetic effects in frontend/hooks/useMousePosition.ts
- [ ] T009 Update barrel exports in frontend/Components/index.ts to include new components
- [ ] T010 Update barrel exports in frontend/features/index.ts to include new features

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - First Impression Experience (Priority: P1)

**Goal**: Hero section with captivating entrance animations and interactive effects that hook users within 3 seconds

**Independent Test**: Load homepage and verify hero displays with animations, value proposition, and visible CTA within 1 second

**Skills Required**: MUST invoke **ui-ux skill** for Hero "Gravity Pull" design with spotlight, meteors, and magnetic CTA

### Implementation for User Story 1

- [ ] T011 [US1] **SKILL: ui-ux** Design Hero component with Gravity Pull effect, consulting .claude/skills/ui-ux/SKILL.md
- [ ] T012 [P] [US1] Create Hero.tsx client component structure in frontend/Components/Hero/Hero.tsx
- [ ] T013 [P] [US1] Create hero.module.css with entrance animations (char reveal, blur-up, scale bounce) in frontend/Components/Hero/hero.module.css
- [ ] T014 [US1] Implement background effects layer (gradient mesh, floating orbs) in frontend/Components/Hero/Hero.tsx
- [ ] T015 [US1] Implement meteor shower ambient animation in frontend/Components/Hero/hero.module.css
- [ ] T016 [US1] Implement mouse-reactive spotlight effect using useMousePosition in frontend/Components/Hero/Hero.tsx
- [ ] T017 [US1] Implement headline char-by-char reveal animation in frontend/Components/Hero/Hero.tsx
- [ ] T018 [US1] Implement subheadline blur-up animation in frontend/Components/Hero/Hero.tsx
- [ ] T019 [US1] Implement magnetic hover CTA button (moves toward cursor) in frontend/Components/Hero/Hero.tsx
- [ ] T020 [US1] Add prefers-reduced-motion support to all Hero animations in frontend/Components/Hero/hero.module.css
- [ ] T021 [US1] Create Hero barrel export in frontend/Components/Hero/index.ts
- [ ] T022 [US1] Add responsive styles for Hero (320px to 2560px) in frontend/Components/Hero/hero.module.css

**Checkpoint**: Hero component fully functional with all P1 animations - can be tested independently

---

## Phase 4: User Story 2 - Seamless Navigation Experience (Priority: P1)

**Goal**: Header with scroll-transform behavior, mobile menu, and smooth navigation with visual feedback

**Independent Test**: Click navigation links and verify active states, scroll transform, and mobile menu animations

**Skills Required**: MUST invoke **ui-ux skill** for Header "Glass Morphism Transform" and underline draw effects

### Implementation for User Story 2

- [ ] T023 [US2] **SKILL: ui-ux** Design Header component with Glass Morphism transform, consulting .claude/skills/ui-ux/SKILL.md
- [ ] T024 [P] [US2] Create Header.tsx client component structure in frontend/Components/Header/Header.tsx
- [ ] T025 [P] [US2] Create header.module.css with scroll state styles in frontend/Components/Header/header.module.css
- [ ] T026 [US2] Implement scroll detection and transform (transparent → compact glass) in frontend/Components/Header/Header.tsx
- [ ] T027 [US2] Implement desktop navigation with underline draw effect on hover in frontend/Components/Header/header.module.css
- [ ] T028 [US2] Implement active page indicator styling in frontend/Components/Header/header.module.css
- [ ] T029 [US2] Implement mobile menu button (hamburger icon) in frontend/Components/Header/Header.tsx
- [ ] T030 [US2] Implement mobile menu overlay with cascade reveal animation in frontend/Components/Header/Header.tsx
- [ ] T031 [US2] Implement staggered nav item animations in mobile menu in frontend/Components/Header/header.module.css
- [ ] T032 [US2] Add prefers-reduced-motion support to Header animations in frontend/Components/Header/header.module.css
- [ ] T033 [US2] Create Header barrel export in frontend/Components/Header/index.ts
- [ ] T034 [US2] Add responsive breakpoint at 768px for mobile menu in frontend/Components/Header/header.module.css
- [ ] T035 [US2] Update root layout.tsx to render Header component in frontend/app/layout.tsx

**Checkpoint**: Header component fully functional with scroll transform and mobile menu - can be tested independently

---

## Phase 5: User Story 3 - Value Discovery Through Content Sections (Priority: P2)

**Goal**: HomePage content sections with scroll-triggered animations that reveal features, stats, testimonials, and CTA

**Independent Test**: Scroll homepage and verify each section animates into view with distinct visual treatments

**Skills Required**: MUST invoke **ui-ux skill** for Constellation pattern, counter reveal, and carousel depth effects

### Implementation for User Story 3

- [ ] T036 [US3] **SKILL: ui-ux** Design HomePage sections with Constellation pattern and scroll effects, consulting .claude/skills/ui-ux/SKILL.md
- [ ] T037 [P] [US3] Create HomePage.tsx client component structure in frontend/features/HomePage/HomePage.tsx
- [ ] T038 [P] [US3] Create homePage.module.css base styles in frontend/features/HomePage/homePage.module.css
- [ ] T039 [P] [US3] Create FeaturesSection.tsx with constellation pattern in frontend/features/HomePage/sections/FeaturesSection.tsx
- [ ] T040 [P] [US3] Create StatsSection.tsx with counter reveal animation in frontend/features/HomePage/sections/StatsSection.tsx
- [ ] T041 [P] [US3] Create TestimonialsSection.tsx with carousel depth effect in frontend/features/HomePage/sections/TestimonialsSection.tsx
- [ ] T042 [P] [US3] Create CTASection.tsx with aurora glow effect in frontend/features/HomePage/sections/CTASection.tsx
- [ ] T043 [US3] Implement scroll-triggered animations using useInView for FeaturesSection
- [ ] T044 [US3] Implement animated counter (eased counting) for StatsSection
- [ ] T045 [US3] Implement depth illusion (translateZ, scale, rotateY) for TestimonialsSection
- [ ] T046 [US3] Implement aurora background animation for CTASection
- [ ] T047 [US3] Add prefers-reduced-motion support to all section animations
- [ ] T048 [US3] Create HomePage barrel export in frontend/features/HomePage/index.ts
- [ ] T049 [US3] Update app/page.tsx to render HomePage with Hero in frontend/app/page.tsx

**Checkpoint**: HomePage fully functional with all content sections and scroll animations - can be tested independently

---

## Phase 6: User Story 4 - About Page Brand Story (Priority: P2)

**Goal**: AboutPage with narrative-driven layout, typewriter reveal, values timeline, and creative scroll animations

**Independent Test**: Navigate to /about and verify brand story sections with engaging animations

**Skills Required**: MUST invoke **ui-ux skill** for typewriter effect, timeline draw, and parallax + aurora

### Implementation for User Story 4

- [ ] T050 [US4] **SKILL: ui-ux** Design AboutPage sections with timeline and typewriter effects, consulting .claude/skills/ui-ux/SKILL.md
- [ ] T051 [P] [US4] Create AboutPage.tsx client component structure in frontend/features/AboutPage/AboutPage.tsx
- [ ] T052 [P] [US4] Create aboutPage.module.css base styles in frontend/features/AboutPage/aboutPage.module.css
- [ ] T053 [P] [US4] Create AboutHero.tsx with typewriter reveal effect in frontend/features/AboutPage/sections/AboutHero.tsx
- [ ] T054 [P] [US4] Create MissionSection.tsx with quote char-by-char reveal in frontend/features/AboutPage/sections/MissionSection.tsx
- [ ] T055 [P] [US4] Create ValuesTimeline.tsx with draw animation in frontend/features/AboutPage/sections/ValuesTimeline.tsx
- [ ] T056 [P] [US4] Create AboutCTA.tsx with parallax + aurora effect in frontend/features/AboutPage/sections/AboutCTA.tsx
- [ ] T057 [US4] Implement typewriter animation with cursor blink for AboutHero
- [ ] T058 [US4] Implement timeline draw animation (stroke-dashoffset) for ValuesTimeline
- [ ] T059 [US4] Implement parallax background with floating shapes for AboutCTA
- [ ] T060 [US4] Add prefers-reduced-motion support to all AboutPage animations
- [ ] T061 [US4] Create AboutPage barrel export in frontend/features/AboutPage/index.ts
- [ ] T062 [US4] Update app/about/page.tsx to render AboutPage in frontend/app/about/page.tsx

**Checkpoint**: AboutPage fully functional with brand story sections and animations - can be tested independently

---

## Phase 7: User Story 5 - Footer Utility and Brand Closure (Priority: P3)

**Goal**: Footer with rising reveal animation, organized links, social media, and mobile-responsive layout

**Independent Test**: Scroll to page bottom and verify footer reveals with proper links and animations

**Skills Required**: MUST invoke **ui-ux skill** for Rising Reveal effect and staggered column animations

### Implementation for User Story 5

- [ ] T063 [US5] **SKILL: ui-ux** Design Footer component with Rising Reveal effect, consulting .claude/skills/ui-ux/SKILL.md
- [ ] T064 [P] [US5] Create Footer.tsx client component structure in frontend/Components/Footer/Footer.tsx
- [ ] T065 [P] [US5] Create footer.module.css with rising reveal animations in frontend/Components/Footer/footer.module.css
- [ ] T066 [US5] Implement footer logo and brand mark in frontend/Components/Footer/Footer.tsx
- [ ] T067 [US5] Implement link columns with staggered reveal animation in frontend/Components/Footer/Footer.tsx
- [ ] T068 [US5] Implement social media links with hover micro-animations in frontend/Components/Footer/Footer.tsx
- [ ] T069 [US5] Implement copyright line with draw animation in frontend/Components/Footer/footer.module.css
- [ ] T070 [US5] Add prefers-reduced-motion support to Footer animations in frontend/Components/Footer/footer.module.css
- [ ] T071 [US5] Create Footer barrel export in frontend/Components/Footer/index.ts
- [ ] T072 [US5] Add responsive layout for mobile viewports in frontend/Components/Footer/footer.module.css
- [ ] T073 [US5] Update root layout.tsx to render Footer component in frontend/app/layout.tsx

**Checkpoint**: Footer component fully functional with reveal animations and links - can be tested independently

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, performance optimization, and validation

- [ ] T074 [P] Verify all Components barrel exports are correct in frontend/Components/index.ts
- [ ] T075 [P] Verify all features barrel exports are correct in frontend/features/index.ts
- [ ] T076 Run Lighthouse audit and ensure LCP < 1.5s, CLS = 0
- [ ] T077 Test all animations at 60fps using Chrome DevTools Performance tab
- [ ] T078 Verify keyboard navigation works for all interactive elements (FR-006, SC-006)
- [ ] T079 Test responsive design at 320px, 768px, 1024px, 1440px, 2560px viewports
- [ ] T080 Test prefers-reduced-motion across all components (FR-032)
- [ ] T081 Verify touch targets are minimum 44x44px on mobile (FR-036, SC-010)
- [ ] T082 Run quickstart.md validation to ensure setup instructions work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001-T005 completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Hero) and US2 (Header) are both P1 - can run in parallel
  - US3 (HomePage sections) depends on US1 Hero being complete
  - US4 (AboutPage) can run independently of US3
  - US5 (Footer) can run independently of US3 and US4
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P2)**: Depends on US1 (Hero is part of HomePage) - Can be done after US1
- **User Story 4 (P2)**: Can start after Foundational - Independent of other stories
- **User Story 5 (P3)**: Can start after Foundational - Independent of other stories

### Within Each User Story

- SKILL task (if present) MUST be done first to get creative direction
- CSS and component structure files marked [P] can run in parallel
- Implementation tasks depend on structure being in place
- Barrel exports last
- prefers-reduced-motion support after main animations

### Parallel Opportunities

- All Setup tasks T002-T005 marked [P] can run in parallel
- All Foundational tasks T007-T010 marked [P] can run in parallel
- Once Foundational completes:
  - US1 (T011-T022) and US2 (T023-T035) can run in parallel
  - After US1 completes, US3 (T036-T049) can start
  - US4 (T050-T062) can run in parallel with US3
  - US5 (T063-T073) can run in parallel with US3 and US4
- Within each story, files marked [P] can be created in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all parallel setup tasks together:
Task: "Create TypeScript interfaces from data-model.md in frontend/types/landing.ts"
Task: "Add landing page color variables (coral/slate palette) to frontend/app/globals.css"
Task: "Create animation configuration constants in frontend/lib/animations/config.ts"
Task: "Create reusable animation effects presets in frontend/lib/animations/effects.ts"
```

## Parallel Example: User Story 3 Section Components

```bash
# Launch all section component structures in parallel:
Task: "Create FeaturesSection.tsx with constellation pattern"
Task: "Create StatsSection.tsx with counter reveal animation"
Task: "Create TestimonialsSection.tsx with carousel depth effect"
Task: "Create CTASection.tsx with aurora glow effect"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Hero)
4. Complete Phase 4: User Story 2 (Header)
5. **STOP and VALIDATE**: Hero + Header with basic layout is a functional MVP
6. Deploy/demo the engaging first impression

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Hero) + US2 (Header) → MVP! Users see engaging landing
3. Add US3 (HomePage sections) → Full homepage experience
4. Add US4 (AboutPage) → Brand story complete
5. Add US5 (Footer) → Full site structure
6. Polish phase → Production-ready

### Skills Usage (MANDATORY)

Each user story phase has a SKILL task that MUST be completed first:
- **T011**: ui-ux skill for Hero Gravity Pull design
- **T023**: ui-ux skill for Header Glass Morphism design
- **T036**: ui-ux skill for HomePage section patterns
- **T050**: ui-ux skill for AboutPage narrative effects
- **T063**: ui-ux skill for Footer Rising Reveal design

These skill invocations ensure creative, non-generic animations per spec requirements.

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 82 |
| **Phase 1: Setup** | 5 tasks |
| **Phase 2: Foundational** | 5 tasks |
| **Phase 3: US1 (Hero)** | 12 tasks |
| **Phase 4: US2 (Header)** | 13 tasks |
| **Phase 5: US3 (HomePage)** | 14 tasks |
| **Phase 6: US4 (AboutPage)** | 13 tasks |
| **Phase 7: US5 (Footer)** | 11 tasks |
| **Phase 8: Polish** | 9 tasks |
| **Parallel Opportunities** | 25 tasks marked [P] |
| **MVP Scope** | Phases 1-4 (35 tasks) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable after completion
- SKILL tasks are MANDATORY - invoke ui-ux skill before implementing animations
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All animations must respect prefers-reduced-motion
- Target 60fps performance for all animations
