# Tasks: Premium Frontend Redesign

**Input**: Design documents from `/specs/005-frontend-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested - tests omitted per template guidelines.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/` directory structure
- Base: `frontend/lib/`, `frontend/styles/`, `frontend/Components/`, `frontend/features/`, `frontend/app/`

---

## Phase 1: Setup (GSAP & Design System Foundation)

**Purpose**: Install dependencies and create core infrastructure files

- [X] T001 Install GSAP dependencies by running `npm install gsap @gsap/react` in frontend/
- [X] T002 [P] Create GSAP registration module in frontend/lib/gsap/index.ts
- [X] T003 [P] Create animation presets in frontend/lib/gsap/animations.ts
- [X] T004 [P] Create useScrollAnimation hook in frontend/lib/gsap/hooks/useScrollAnimation.ts
- [X] T005 [P] Create design tokens CSS in frontend/styles/design-tokens.css (copy from data-model.md)
- [X] T006 [P] Create useReducedMotion utility hook in frontend/lib/gsap/hooks/useReducedMotion.ts

---

## Phase 2: Foundational (Typography & Global Styles)

**Purpose**: Core styling that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Configure Poppins font with Next.js font optimization in frontend/app/layout.tsx
- [X] T008 Import design-tokens.css in frontend/app/globals.css
- [X] T009 Update body styles in globals.css to use design token variables
- [X] T010 Add TypeScript path alias for `@/lib/gsap` in frontend/tsconfig.json

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visual First Impression (Priority: P1)

**Goal**: Premium dark theme with Poppins typography and initial page animations

**Independent Test**: Load the application and verify dark theme, Poppins font, and smooth fade-in animation on page load

### Implementation for User Story 1

- [X] T011 [P] [US1] Update Dashboard.module.css with new color tokens (background, text colors) in frontend/features/Dashboard/Dashboard.module.css
- [X] T012 [P] [US1] Update TaskCard.module.css with design token colors in frontend/Components/TaskCard/TaskCard.module.css
- [X] T013 [P] [US1] Update EditTaskModal.module.css with design token colors in frontend/Components/EditTaskModal/EditTaskModal.module.css
- [X] T014 [US1] Add page entrance animation using useGSAP in frontend/features/Dashboard/Dashboard.tsx
- [X] T015 [US1] Verify color contrast meets WCAG AA standards across all updated components

**Checkpoint**: User Story 1 complete - dark theme with premium typography is functional

---

## Phase 4: User Story 2 - Interactive Task Cards (Priority: P1)

**Goal**: Hover effects, elevation animations, and priority indicator enhancements on task cards

**Independent Test**: Hover over task cards and verify elevation effect, shadow enhancement, and button glow effects

### Implementation for User Story 2

- [X] T016 [US2] Add GSAP hover animation with contextSafe in frontend/Components/TaskCard/TaskCard.tsx
- [X] T017 [US2] Implement card elevation effect (translateY, box-shadow) on mouseEnter in TaskCard.tsx
- [X] T018 [US2] Implement reverse animation on mouseLeave in TaskCard.tsx
- [X] T019 [P] [US2] Update priority indicator bar styles with gradient coloring in TaskCard.module.css
- [X] T020 [P] [US2] Add action button hover effects (scale, glow) in TaskCard.module.css
- [X] T021 [US2] Add will-change hints for GPU-accelerated properties in TaskCard.module.css

**Checkpoint**: User Story 2 complete - task cards have premium hover interactions

---

## Phase 5: User Story 3 - Smooth Page Transitions (Priority: P2)

**Goal**: Modal animations with scale, fade, and backdrop blur effects

**Independent Test**: Open and close EditTaskModal, verify scale-up entrance and smooth reverse on close

### Implementation for User Story 3

- [X] T022 [US3] Create GSAP timeline for modal entrance animation in frontend/Components/EditTaskModal/EditTaskModal.tsx
- [X] T023 [US3] Implement scale + fade modal content animation with back.out easing in EditTaskModal.tsx
- [X] T024 [US3] Implement backdrop opacity animation synchronized with modal in EditTaskModal.tsx
- [X] T025 [US3] Add timeline reverse on modal close (escape key, outside click) in EditTaskModal.tsx
- [X] T026 [P] [US3] Update modal overlay styles with backdrop-filter blur in EditTaskModal.module.css
- [X] T027 [US3] Ensure modal animations respect reduced motion preference in EditTaskModal.tsx

**Checkpoint**: User Story 3 complete - modals have premium enter/exit animations

---

## Phase 6: User Story 4 - Scroll-Triggered Animations (Priority: P2)

**Goal**: Task cards fade-in and slide-up as they enter the viewport with staggered timing

**Independent Test**: Scroll through task list and verify cards animate in with staggered delay

### Implementation for User Story 4

- [X] T028 [US4] Import ScrollTrigger in Dashboard component from frontend/lib/gsap/index.ts
- [X] T029 [US4] Add scroll-triggered animation for task cards using gsap.from with stagger in frontend/features/Dashboard/Dashboard.tsx
- [X] T030 [US4] Configure ScrollTrigger with `once: true` to prevent re-animation on scroll back
- [X] T031 [US4] Set stagger timing to 50ms between consecutive cards per FR-009
- [X] T032 [US4] Add reduced motion check to skip scroll animations when preferred

**Checkpoint**: User Story 4 complete - scroll reveals create engaging browsing experience

---

## Phase 7: User Story 5 - Responsive Design Excellence (Priority: P2)

**Goal**: Ensure premium experience adapts gracefully across mobile, tablet, and desktop

**Independent Test**: Resize browser and verify layout adapts with touch-friendly spacing on mobile

### Implementation for User Story 5

- [X] T033 [P] [US5] Add mobile breakpoint styles (< 640px) to Dashboard.module.css
- [X] T034 [P] [US5] Add tablet breakpoint styles (640px-1024px) to Dashboard.module.css
- [X] T035 [P] [US5] Update TaskCard.module.css with responsive adjustments and 44px touch targets
- [X] T036 [P] [US5] Update EditTaskModal.module.css with mobile-friendly modal sizing
- [X] T037 [US5] Add prefers-reduced-motion media query for all animated components
- [X] T038 [US5] Verify touch interactions work smoothly on mobile devices

**Checkpoint**: User Story 5 complete - responsive design works across all devices

---

## Phase 8: User Story 6 - Premium Form Interactions (Priority: P3)

**Goal**: Enhanced input focus states, validation shake animation, and loading spinners

**Independent Test**: Focus form fields and verify glow effect, submit invalid data to see shake animation

### Implementation for User Story 6

- [X] T039 [P] [US6] Create shared input styles with focus glow effect in frontend/styles/design-tokens.css
- [X] T040 [P] [US6] Add shake animation keyframes for validation errors in design-tokens.css
- [X] T041 [US6] Implement GSAP shake animation on validation failure in frontend/features/Dashboard/Dashboard.tsx
- [X] T042 [US6] Add input focus transition styles to EditTaskModal.module.css
- [X] T043 [US6] Add loading spinner animation to submit buttons in Dashboard.tsx

**Checkpoint**: User Story 6 complete - forms have polished professional interactions

---

## Phase 9: User Story 7 - Button and CTA Design (Priority: P3)

**Goal**: Consistent button styling with gradient backgrounds, hover effects, and click feedback

**Independent Test**: Interact with buttons across the app, verify hover elevation and click scale

### Implementation for User Story 7

- [X] T044 [P] [US7] Create shared button gradient styles in design-tokens.css
- [X] T045 [US7] Update Dashboard form button styles with gradient and rounded corners in Dashboard.module.css
- [X] T046 [US7] Add GSAP hover animation for button elevation effect in Dashboard.tsx
- [X] T047 [US7] Add click feedback animation (scale 0.98) on button press in Dashboard.tsx
- [X] T048 [P] [US7] Update EditTaskModal button styles to match design system in EditTaskModal.module.css
- [X] T049 [US7] Ensure all buttons have consistent hover and active states across components

**Checkpoint**: User Story 7 complete - all buttons have premium consistent interactions

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and validation

- [X] T050 Validate all animations complete within 400ms per SC-002
- [X] T051 Run Lighthouse accessibility audit and ensure 90+ score per SC-004
- [X] T052 Verify 60fps animation performance with Chrome DevTools
- [X] T053 [P] Remove any unused CSS and optimize design token usage
- [X] T054 Test prefers-reduced-motion across all animated components
- [X] T055 Validate design token consistency (95%+ compliance per SC-008)
- [X] T056 Run quickstart.md validation to ensure setup guide works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - Within same priority, can run in parallel if staffed
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Depends On | Can Parallel With |
|-------|----------|------------|-------------------|
| US1 (Visual First Impression) | P1 | Foundational | US2 |
| US2 (Interactive Task Cards) | P1 | Foundational | US1 |
| US3 (Smooth Page Transitions) | P2 | US1, US2 | US4, US5 |
| US4 (Scroll Animations) | P2 | US1, US2 | US3, US5 |
| US5 (Responsive Design) | P2 | US1, US2 | US3, US4 |
| US6 (Form Interactions) | P3 | US1-US5 | US7 |
| US7 (Button Design) | P3 | US1-US5 | US6 |

### Within Each User Story

1. CSS Module updates (marked [P]) can run in parallel
2. GSAP animation implementations follow CSS updates
3. Reduced motion checks complete the story

### Parallel Opportunities

**Phase 1 (Setup)**:
```bash
# All these can run in parallel:
T002: Create frontend/lib/gsap/index.ts
T003: Create frontend/lib/gsap/animations.ts
T004: Create frontend/lib/gsap/hooks/useScrollAnimation.ts
T005: Create frontend/styles/design-tokens.css
T006: Create frontend/lib/gsap/hooks/useReducedMotion.ts
```

**Phase 3-4 (P1 Stories)**:
```bash
# CSS updates can run in parallel:
T011: Dashboard.module.css color tokens
T012: TaskCard.module.css color tokens
T013: EditTaskModal.module.css color tokens
T019: TaskCard priority indicators
T020: TaskCard action button effects
```

**Phase 7 (Responsive)**:
```bash
# All responsive CSS updates can run in parallel:
T033: Dashboard mobile styles
T034: Dashboard tablet styles
T035: TaskCard responsive styles
T036: EditTaskModal responsive styles
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Visual First Impression)
4. Complete Phase 4: User Story 2 (Interactive Task Cards)
5. **STOP and VALIDATE**: Test premium visual design independently
6. Deploy/demo if ready - MVP delivers core premium experience

### Incremental Delivery

| Increment | Phases | Deliverable |
|-----------|--------|-------------|
| 1 | 1-2 | Foundation ready |
| 2 | 3-4 | MVP - Premium visuals + card interactions |
| 3 | 5-7 | Enhanced - Modals, scrolling, responsive |
| 4 | 8-9 | Complete - Forms, buttons |
| 5 | 10 | Polished - Performance validated |

### Critical Path

```
Setup → Foundational → US1 + US2 (parallel) → US3/US4/US5 (parallel) → US6 + US7 (parallel) → Polish
```

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 56 |
| **Setup Tasks** | 6 |
| **Foundational Tasks** | 4 |
| **US1 Tasks** | 5 |
| **US2 Tasks** | 6 |
| **US3 Tasks** | 6 |
| **US4 Tasks** | 5 |
| **US5 Tasks** | 6 |
| **US6 Tasks** | 5 |
| **US7 Tasks** | 6 |
| **Polish Tasks** | 7 |
| **Parallelizable Tasks** | 21 |
| **MVP Scope** | Phases 1-4 (21 tasks) |

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story
- Each user story is independently testable after completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All animations must respect prefers-reduced-motion
