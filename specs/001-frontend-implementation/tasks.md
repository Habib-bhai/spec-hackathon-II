# Tasks: Frontend Implementation

**Feature**: 001-frontend-implementation | **Date**: 2025-12-24
**Input**: Design documents from `specs/001-frontend-implementation/`

**MANDATORY REQUIREMENTS**:
1. **Context7 MCP usage is MANDATORY** for all technical documentation lookup
2. **ui-ux skill usage is NON-NEGOTIABLE** for all frontend/UI-UX creation (use `/.claude/skills/ui-ux`)
3. **Relevant skill usage is NON-NEGOTIABLE** wherever they apply, use their yaml part to analyze which skill to apply where. (use `/.claude/skills/`)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with required dependencies and structure per constitution

- [ ] T001 Create frontend/ directory structure per constitution (app/, Components/, features/, lib/)
- [ ] T002 [P] Initialize Next.js 15 with App Router and TypeScript strict mode in frontend/
- [ ] T003 [P] Install dependencies: @tanstack/react-query, zustand, react-hook-form, zod, date-fns, @tanstack/react-virtual
- [ ] T004 [P] Configure CSS Modules support and barrel exports in tsconfig.json and next.config.ts
- [ ] T005 [P] Setup ESLint and Prettier with constitution-compliant rules
- [ ] T006 [P] Create lib/types/ directory with barrel export for TypeScript types

**Checkpoint**: Project initialized with all dependencies and constitution-mandated structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T007 Configure React Query client in lib/api/client.ts with cache and refetching settings (MUST use Context7 MCP for patterns)
- [ ] T008 [P] Create Zustand store for UI state (command palette, filter states) in lib/stores/uiStore.ts
- [ ] T009 Setup TypeScript types matching backend Pydantic models in lib/types/ (User, Task, Project, Tag)
- [ ] T010 [P] Create Zod schemas matching backend for form validation in lib/types/schemas.ts (MUST use Context7 MCP for Zod + React Hook Form patterns)
- [ ] T011 [P] Configure date-fns for natural language parsing in lib/utils/dateParser.ts (MUST use Context7 MCP for date-fns patterns)
- [ ] T012 [P] Create API client functions in lib/api/ (tasks.ts, projects.ts, auth.ts) with React Query hooks
- [ ] T013 [P] Create custom React Query hooks in lib/hooks/ (useTasks.ts, useProjects.ts, useAuth.ts)
- [ ] T014 Create base virtual scrolling configuration with @tanstack/react-virtual (MUST use Context7 MCP for virtual scrolling patterns)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Landing and User Onboarding (Priority: P1) MVP

**Goal**: Visually compelling landing page that converts visitors to sign up

**Independent Test**: Visit home page, see hero section and CTAs, navigate to sign-up, create account, redirect to dashboard

### Implementation for User Story 1

- [ ] T015 [US1] Create Header component in Components/Header/Header.tsx with Header.module.css (MUST use ui-ux skill)
- [ ] T016 [P] [US1] Create Footer component in Components/Footer/Footer.tsx with Footer.module.css (MUST use ui-ux skill)
- [ ] T017 [P] [US1] Create Hero component in Components/Hero/Hero.tsx with Hero.module.css (MUST use ui-ux skill for compelling visual design)
- [ ] T018 [P] [US1] Create HomePage feature component in features/HomePage/HomePage.tsx with homePage.module.css (MUST use ui-ux skill)
- [ ] T019 [US1] Implement root layout.tsx in app/layout.tsx with Header and Footer integration
- [ ] T020 [US1] Create landing page.tsx in app/page.tsx as server component wrapping HomePage
- [ ] T021 [US1] Add navigation links to Header (Home, About, Sign In, Sign Up)
- [ ] T022 [US1] Ensure responsive design on all components (mobile, tablet, desktop)
- [ ] T023 [US1] Create Components/index.ts barrel export
- [ ] T024 [US1] Create features/index.ts barrel export

**Checkpoint**: Landing page complete and testable independently

---

## Phase 4: User Story 6 - About and Information Pages (Priority: P3)

**Goal**: About page with product information and CTAs

**Independent Test**: Navigate to about page, verify information and links work

### Implementation for User Story 6

- [ ] T025 [P] [US6] Create AboutPage feature component in features/AboutPage/AboutPage.tsx with AboutPage.module.css (MUST use ui-ux skill)
- [ ] T026 [US6] Create about page.tsx in app/about/page.tsx as server component wrapping AboutPage
- [ ] T027 [US6] Update Header navigation with About link
- [ ] T028 [US6] Add sign-up CTA to About page

**Checkpoint**: About page complete and testable independently

---

## Phase 5: User Story 3 - Authentication and Session Management (Priority: P1) MVP

**Goal**: Sign In and Sign Up pages with authentication integration

**Independent Test**: Sign up with valid credentials, sign in, session persists across refresh, sign out works

### Implementation for User Story 3

- [ ] T029 [US3] [P] Research Better Auth + Next.js App Router integration patterns (MUST use Context7 MCP for Better Auth docs)
- [ ] T030 [P] [US3] Create auth API client functions in lib/api/auth.ts
- [ ] T031 [P] [US3] Create useAuth hook in lib/hooks/useAuth.ts (MUST use Context7 MCP for React Query + Next.js patterns)
- [ ] T032 [P] [US3] Create SignInPage feature component in features/SignInPage/SignInPage.tsx with SignInPage.module.css (MUST use ui-ux skill)
- [ ] T033 [P] [US3] Create SignUpPage feature component in features/SignUpPage/SignUpPage.tsx with SignUpPage.module.css (MUST use ui-ux skill)
- [ ] T034 [US3] Create sign-in page.tsx in app/signin/page.tsx wrapping SignInPage
- [ ] T035 [US3] Create sign-up page.tsx in app/signup/page.tsx wrapping SignUpPage
- [ ] T036 [US3] Add form validation with Zod schemas matching backend (MUST use Context7 MCP for Zod + React Hook Form patterns)
- [ ] T037 [US3] Implement session persistence across page refreshes
- [ ] T038 [US3] Add sign-out functionality
- [ ] T039 [US3] Implement protected route middleware (MUST use Context7 MCP for Next.js route protection patterns)

**Checkpoint**: Authentication complete and testable independently

---

## Phase 6: User Story 2 - Task Management in Dashboard (Priority: P1) MVP

**Goal**: Dashboard page with task CRUD, filtering, and virtual scrolling

**Independent Test**: Create task, view tasks, edit task, delete task, filter by priority/status, search tasks, virtual scrolling with 100+ items

### Implementation for User Story 2

- [ ] T040 [US2] [P] Create TaskCard component in Components/TaskCard/TaskCard.tsx with TaskCard.module.css (MUST use ui-ux skill)
- [ ] T041 [US2] [P] Create TaskList component in Components/TaskList/TaskList.tsx with TaskList.module.css (MUST use ui-ux skill)
- [ ] T042 [US2] Integrate @tanstack/react-virtual in TaskList for 100+ items (MUST use Context7 MCP for virtual scrolling patterns)
- [ ] T043 [US2] Create tasks API client in lib/api/tasks.ts with React Query hooks
- [ ] T044 [US2] Create useTasks hook in lib/hooks/useTasks.ts
- [ ] T045 [US2] Create Dashboard feature component in features/Dashboard/Dashboard.tsx with Dashboard.module.css (MUST use ui-ux skill)
- [ ] T046 [US2] Create dashboard page.tsx in app/dashboard/page.tsx as protected route wrapping Dashboard
- [ ] T047 [US2] Implement task creation form with React Hook Form + Zod validation
- [ ] T048 [US2] Implement task edit functionality
- [ ] T049 [US2] Implement task delete with confirmation
- [ ] T050 [US2] Add task priority visual indicators (Critical > High > Medium > Low)
- [ ] T051 [US2] Implement task filtering (status, priority, tags, deadline)
- [ ] T052 [US2] Implement task sorting (deadline, priority, creation date)
- [ ] T053 [US2] Add search functionality for tasks
- [ ] T054 [US2] Display empty state when no tasks exist
- [ ] T055 [US2] Add loading indicators for async operations
- [ ] T056 [US2] Handle network errors gracefully with retry mechanisms

**Checkpoint**: Dashboard task management complete and testable independently

---

## Phase 7: User Story 4 - Task Organization with Projects and Tags (Priority: P2)

**Goal**: Create projects, assign tasks to projects, apply tags, filter by project/tag

**Independent Test**: Create project, assign task to project, add tags, filter by project, filter by tag

### Implementation for User Story 4

- [ ] T057 [US4] [P] Create projects API client in lib/api/projects.ts with React Query hooks
- [ ] T058 [US4] Create useProjects hook in lib/hooks/useProjects.ts
- [ ] T059 [US4] Add project creation form in Dashboard
- [ ] T060 [US4] Add project editing in Dashboard
- [ ] T061 [US4] Add project deletion with task reassignment to Inbox
- [ ] T062 [US4] Add tag creation and management in Task creation/edit forms
- [ ] T063 [US4] Add project filter in Dashboard
- [ ] T064 [US4] Add tag filter (click to filter by tag)

**Checkpoint**: Task organization complete and testable independently

---

## Phase 8: User Story 5 - Productivity Features (Priority: P2)

**Goal**: Keyboard shortcuts, command palette, natural language date parsing, time estimates

**Independent Test**: Cmd+K opens command palette, keyboard shortcuts work, natural language dates parse, time estimates display

### Implementation for User Story 5

- [ ] T065 [US5] [P] Create CommandPalette component in Components/CommandPalette/CommandPalette.tsx with CommandPalette.module.css (MUST use ui-ux skill)
- [ ] T066 [US5] Create commandPaletteStore in lib/stores/commandPaletteStore.ts
- [ ] T067 [US5] Implement Cmd+K (or Ctrl+K) keyboard shortcut to open command palette (MUST use Context7 MCP for keyboard shortcut patterns)
- [ ] T068 [US5] Implement keyboard shortcuts for task actions (c=create, e=edit, d=delete, n=next, p=previous)
- [ ] T069 [US5] Implement natural language date parsing with date-fns in lib/utils/dateParser.ts (MUST use Context7 MCP for date-fns patterns)
- [ ] T070 [US5] Integrate date parser into task creation form
- [ ] T071 [US5] Add time estimate input to task creation/edit forms
- [ ] T072 [US5] Display time estimates on task cards
- [ ] T073 [US5] Add time-based task groupings (Today, This Week, Later, Completed)
- [ ] T074 [US5] Display total task count and completion progress
- [ ] T075 [US5] Add bulk mark as complete functionality
- [ ] T076 [US5] Add bulk delete functionality
- [ ] T077 [US5] Collapse completed tasks by default with expand option

**Checkpoint**: Productivity features complete and testable independently

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories

- [ ] T078 [P] Ensure all forms use React Hook Form + Zod validation matching backend
- [ ] T079 [P] Ensure all API calls use React Query with proper error handling and retry
- [ ] T080 [P] Verify accessibility across all pages (keyboard navigation, screen reader support, color contrast)
- [ ] T081 [P] Add loading states to all async operations
- [ ] T082 [P] Implement prefers-reduced-motion support
- [ ] T083 [P] Add hover states and visual feedback to all interactive elements
- [ ] T084 [P] Ensure responsive design on all pages
- [ ] T085 [P] Add smooth animations and transitions
- [ ] T086 Verify all barrel exports (Components/index.ts, features/index.ts) are correct
- [ ] T087 Run TypeScript type checking (no any types, strict mode)
- [ ] T088 Update quickstart.md with local development setup

**Checkpoint**: Application polished and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - Stories can proceed sequentially in priority order: P1 (US1, US3, US2) > P2 (US4, US5) > P3 (US6)
  - Within each story: Tasks marked [P] can run in parallel
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 6 (P3)**: No dependencies on other stories
- **User Story 3 (P1)**: Depends on Foundational phase
- **User Story 2 (P1)**: Depends on Foundational phase and US3 (authentication)
- **User Story 4 (P2)**: Depends on US2 (task management)
- **User Story 5 (P2)**: Depends on US2 (task management)

### Parallel Opportunities

- All [P] tasks within a phase can run in parallel
- Components marked [P] in same story can be created simultaneously
- US1 and US6 can be worked on in parallel (both public pages)
- US4 and US5 (both P2) can be worked on in parallel once US2 is complete

### Within Each User Story

- Form and API client tasks marked [P] can run in parallel
- Components can be built in parallel
- Integration happens after components are complete
- Story complete before moving to next priority level

---

## Parallel Example: User Story 1

```bash
# Launch all components together (can run in parallel):
Task: Create Header component in Components/Header/Header.tsx
Task: Create Footer component in Components/Footer/Footer.tsx
Task: Create Hero component in Components/Hero/Hero.tsx
Task: Create HomePage feature component in features/HomePage/HomePage.tsx

# Then integrate:
Task: Implement root layout.tsx with Header and Footer
Task: Create landing page.tsx wrapping HomePage
```

---

## Implementation Strategy

### MVP First (User Stories 1, 6, 3, 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Landing Page)
4. Complete Phase 4: User Story 6 (About Page)
5. Complete Phase 5: User Story 3 (Authentication)
6. Complete Phase 6: User Story 2 (Dashboard CRUD)
7. **STOP AND VALIDATE**: Test core user journey (Landing -> Sign Up -> Sign In -> Dashboard -> Task CRUD)
8. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add US1 (Landing) + US6 (About) -> Test independently -> Public site ready
3. Add US3 (Auth) -> Test independently -> Authentication ready
4. Add US2 (Dashboard) -> Test independently -> Core app functional (MVP!)
5. Add US4 (Projects/Tags) -> Test independently -> Enhanced organization
6. Add US5 (Productivity) -> Test independently -> Developer-focused features
7. Polish: Each addition adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Landing) + US6 (About)
   - Developer B: US3 (Authentication)
   - Developer A: US2 (Dashboard CRUD)
   - Developer B: US4 (Projects/Tags) + US5 (Productivity)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Context7 MCP usage is MANDATORY** for all technical documentation
- **ui-ux skill usage is NON-NEGOTIABLE** for all frontend/UI-UX creation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
