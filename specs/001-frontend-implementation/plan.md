# Implementation Plan: Frontend Implementation

**Branch**: 001-frontend-implementation | **Date**: 2025-12-24 | **Spec**: spec.md
**Input**: Feature specification from /specs/001-frontend-implementation/spec.md

## Summary

Implement a Next.js frontend for a developer-focused todo application. **This iteration focuses on creating 5 core pages: Landing/Home, Dashboard (task CRUD), Sign In, Sign Up, and About.** Frontend uses React Query for server state, Zustand for UI state, React Hook Form + Zod for forms, and CSS Modules for styling. **MUST use ui-ux skill for frontend/UI-UX creation. MUST use Context7 MCP server for all technical documentation.**

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 15 (App Router), React Query (TanStack Query), Zustand, React Hook Form, Zod, date-fns
**Storage**: No local storage; online-only MVP with Neon DB (PostgreSQL) backend
**Testing**: Jest + React Testing Library, Playwright for E2E
**Target Platform**: Web (desktop, tablet, mobile browsers)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Interactive < 3s, first contentful paint < 2s, task sync < 1s
**Constraints**: No offline mode, requires online connection, virtual scrolling for 100+ items
**Scale/Scope**: 5 pages (home, about, sign-in, sign-up, dashboard), 4 core entities (User, Task, Project, Tag)

**Iteration Scope (This Phase)**:
- Landing/Home page with hero section and CTAs
- Dashboard page with task CRUD and filtering
- Sign In page with email/password authentication
- Sign Up page with registration form
- About page with product information

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Type Safety First
- **PASS**: TypeScript strict mode required, no any types allowed
- **PASS**: All interfaces/types must be explicitly defined

### Documentation via Context7 MCP (NON-NEGOTIABLE)
- **PASS**: MUST use Context7 MCP for all technology documentation
- **PASS**: Required queries: Next.js App Router, React Query, Better Auth, date-fns

### Spec-Driven Development
- **PASS**: Following SDD workflow

### Folder Structure (Constitution Mandatory)
- **PASS**: frontend/ with app/ (App Router), Components/, features/
- **PASS**: CSS Modules (componentName.module.css) with kebab-case classes
- **PASS**: Barrel exports (index.ts) for clean imports

### Authentication via Better Auth
- **NEEDS RESEARCH**: Better Auth integration with Next.js App Router

### Full-Stack Type Consistency
- **PASS**: TypeScript interfaces match backend Pydantic models
- **PASS**: Zod schemas match backend

### Developer Productivity Focus
- **PASS**: Productivity features (keyboard shortcuts, command palette)

### UI-UX Skill (NON-NEGOTIABLE)
- **PASS**: MUST use ui-ux skill inside /.claude/skills for frontend and UI-UX creation

### SKILL USAGE (NON-NEGOTIABLE)
- **PASS**: Must use relevant skills inside /.claude/skills, where they can be used, analyze their yaml part, to identify their usage. 

## Project Structure

### Documentation (this feature)

specs/001-frontend-implementation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── types.ts
│   └── api-clients.md
└── tasks.md             # Phase 2 output (/sp.tasks command)

### Source Code (per constitution)

frontend/
├── app/                  # App Router pages (server components)
│   ├── layout.tsx        # Root layout (Header, Footer)
│   ├── page.tsx          # Landing/Home page
│   ├── about/            # About page
│   ├── signin/           # Sign-in page
│   ├── signup/           # Sign-up page
│   └── dashboard/        # Protected dashboard
│
├── Components/            # Reusable UI components
│   ├── Header/
│   ├── Footer/
│   ├── Hero/
│   ├── TaskCard/
│   ├── TaskList/
│   ├── CommandPalette/
│   └── index.ts          # Component barrel exports
│
├── features/             # Feature-specific page components
│   ├── HomePage/
│   ├── AboutPage/
│   ├── SignInPage/
│   ├── SignUpPage/
│   └── Dashboard/
│
├── lib/                  # Utilities and configuration
│   ├── api/              # API client functions
│   ├── hooks/            # Custom React Query hooks
│   ├── stores/           # Zustand stores
│   ├── utils/
│   └── types/            # TypeScript types
│
└── package.json

## Complexity Tracking

> No violations detected. Constitution check passed.

---

## Phase 0: Research (MUST USE Context7 MCP)

### Research Tasks (ALL require Context7 MCP)

1. Next.js App Router patterns (Context7 mandatory)
   - Server vs client components
   - Data fetching patterns
   - Route protection for authenticated pages

2. Better Auth + Next.js App Router Integration (Context7 mandatory)
   - Authentication flow from frontend
   - Session management with App Router
   - Protected route middleware

3. React Query with Next.js App Router (Context7 mandatory)
   - Query client setup in App Router
   - Server vs client component patterns

4. Virtual Scrolling (Context7 mandatory)
   - Library selection for 100+ task lists

5. Command Palette Implementation (Context7 mandatory)
   - Keyboard shortcuts (Cmd+K) integration

6. Natural Language Date Parsing (Context7 mandatory)
   - date-fns patterns for tomorrow, next week

7. UI-UX Skill Integration (MUST use ui-ux skill)
   - Component design using /.claude/skills/ui-ux
   - Creative, out-of-the-box design using shadcn/ui and Aceternity UI

8. Zod + React Hook Form (Context7 mandatory)
   - Schema definition patterns matching backend

---

## Phase 1: Design & Contracts

### Data Model
See data-model.md for entity definitions.

### API Contracts
See contracts/ for TypeScript interfaces.

### Quickstart Guide
See quickstart.md for local development setup.

---

## Next Steps

1. Generate research.md using Context7 MCP for all technology decisions
2. Generate data-model.md with entities
3. Generate contracts/ with API types
4. Generate quickstart.md
5. Update agent context
6. Use ui-ux skill for component design
7. Run /sp.tasks for implementation breakdown
