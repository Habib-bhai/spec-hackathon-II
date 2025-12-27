<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Updated sections:
  * Technology Stack - Added CSS Modules as styling approach
  * Architecture - Complete rewrite to reflect actual frontend structure
  * Added Frontend Architecture Principles section
- Frontend structure patterns:
  * Components/ - Reusable UI components with CSS Modules
  * features/ - Feature-specific page components
  * app/ - Next.js App Router pages as thin wrappers
  * Barrel exports (index.ts) for clean imports
  * CSS Modules: componentName.module.css with kebab-case classes
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# Full-Stack Todo Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)

All code MUST enforce strict type safety across the entire stack. This is a foundational non-negotiable principle.

**TypeScript Requirements:**
- All data structures MUST use explicit `interface` or `type` definitions
- No `any` types allowed unless explicitly documented with mitigation strategy
- Strict mode enabled in tsconfig.json
- All function parameters and return types MUST be explicitly typed
- Props MUST be typed using interfaces for components and type aliases for unions/tuples

**Python Requirements:**
- All API models MUST use Pydantic BaseModels for validation
- All function parameters and return types MUST have type hints
- Type checking with mypy MUST pass in CI/CD
- Database models MUST use SQLModel (which inherits from Pydantic)

**Rationale:** Type safety catches bugs at compile time, improves developer experience with autocomplete, serves as documentation, and enables fearless refactoring. With a full-stack TypeScript/Python setup, strict typing is the single biggest productivity lever.

---

### II. Documentation via Context7 MCP (NON-NEGOTIABLE)

Before implementing ANY technology or framework, developers MUST use the Context7 MCP server to fetch and review the latest official documentation.

**Required Workflow:**
1. Before using a new library, framework, or API pattern
2. Query Context7 MCP for the most current documentation
3. Review the official documentation thoroughly
4. Implement according to official best practices, not assumptions

**Examples of Required Context7 Queries:**
- Next.js app router patterns, server components, and best practices
- FastAPI dependency injection, middleware, and async patterns
- SQLModel relationships, migrations, and query optimization
- Better Auth integration patterns and session management
- Neon DB connection handling and pooling strategies

**Rationale:** Technology evolves rapidly. Assumptions about APIs quickly become outdated. Context7 ensures implementations are based on current documentation, preventing subtle bugs and security issues.

---

### III. Spec-Driven Development (NON-NEGOTIABLE)

All features MUST follow the Spec-Driven Development (SDD) workflow:

1. **Specify**: Create `spec.md` with user stories, acceptance criteria, and requirements
2. **Plan**: Generate `plan.md` with architecture, data models, and API contracts
3. **Tasks**: Create `tasks.md` with actionable, dependency-ordered implementation steps
4. **Implement**: Execute tasks following the plan
5. **Record**: Create Prompt History Records (PHR) for every development cycle

**Non-Negotiable Order:**
- No code written before spec is approved
- No implementation before plan is complete
- No plan broken into tasks before spec is clear
- All work recorded in PHR for traceability

**Rationale:** Spec-Driven Development prevents scope creep, ensures all stakeholders align on requirements, reduces rework, and creates auditable development history.

---

### IV. Authentication via Better Auth

All authentication and authorization MUST use Better Auth exclusively. No custom auth implementations allowed.

**Required Implementation:**
- Use Better Auth for all user authentication flows
- Configure session management per Better Auth best practices
- Implement authorization checks using Better Auth middleware
- Store session data securely per Better Auth recommendations
- Handle edge cases (expired sessions, concurrent logouts) per documentation

**Rationale:** Custom auth implementations are security nightmares. Better Auth provides battle-tested, secure authentication out-of-the-box, reducing attack surface and development time.

---

### V. Full-Stack Type Consistency

Types MUST flow consistently across the entire stack. Frontend and backend type definitions MUST align.

**Required Implementation:**
- API response types defined once in Pydantic models (backend)
- TypeScript interfaces generated or manually created to match backend models
- Use shared types when possible (e.g., via code generation or tRPC patterns)
- Frontend fetch functions MUST be typed with backend response types
- Form inputs MUST be validated using types matching backend Pydantic models

**Rationale:** Inconsistent types between frontend and backend lead to runtime errors. Type consistency enables compile-time error detection across the full stack.

---

### VI. Developer Productivity Focus

Every architectural decision and implementation pattern MUST be evaluated against its impact on developer productivity.

**Productivity Principles:**
- Developer time > machine time (within reason)
- Clear error messages and debugging paths over micro-optimizations
- Fast feedback loops (CI/CD, local testing, hot reload)
- Clear abstractions that don't leak implementation details
- Convention over configuration where sensible
- Tooling that automates repetitive tasks

**Anti-Patterns (Do NOT do):**
- Premature optimization without profiling data
- Over-engineering for hypothetical scale
- Complex abstractions that save minimal code
- Manual processes that could be automated
- Unclear error messages

**Rationale:** This is a productivity tool for developers. The development experience should reflect the product mission.

---

## Technology Stack

### Frontend
- **Framework**: Next.js (latest stable version with App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules (scoped styles with `.module.css`)
- **State Management**: TBD (to be decided with Context7 research)
- **Form Handling**: TBD (to be decided with Context7 research)

### Backend
- **Framework**: FastAPI (latest stable version)
- **Language**: Python (3.11+)
- **ORM**: SQLModel
- **Database**: Neon DB (PostgreSQL)
- **Authentication**: Better Auth

### Type Safety
- **Frontend**: TypeScript with strict typing, interfaces, and types
- **Backend**: Python type hints + Pydantic models
- **Database**: SQLModel (Pydantic + SQLAlchemy)
- **API**: OpenAPI spec auto-generated by FastAPI

---

## Architecture

### Project Structure

```
full-stack-todo/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router (Next.js App Router)
│   │   ├── (homepage)/       # Homepage route group
│   │   ├── about/            # About page route
│   │   ├── layout.tsx        # Root layout (Header, Footer)
│   │   └── page.tsx          # Main landing page
│   ├── Components/            # Reusable UI components
│   │   ├── Header/           # Header component + header.module.css
│   │   ├── Footer/           # Footer component + footer.module.css
│   │   ├── Hero/             # Hero component + hero.module.css
│   │   └── index.ts          # Component barrel exports
│   ├── features/             # Feature-specific page components
│   │   ├── HomePage/         # HomePage component + homePage.module.css
│   │   ├── AboutPage/        # AboutPage component + aboutPage.module.css
│   │   └── index.ts          # Feature barrel exports
│   ├── public/               # Static assets
│   ├── next.config.ts        # Next.js configuration
│   ├── next-env.d.ts         # Next.js TypeScript definitions
│   └── package.json          # Frontend dependencies
│
├── backend/                  # FastAPI application
│   ├── src/
│   │   ├── api/              # API route handlers
│   │   ├── models/           # SQLModel database models
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── services/         # Business logic
│   │   ├── auth/             # Better Auth integration
│   │   └── db/               # Database connection and session
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   └── integration/      # Integration tests
│   └── alembic/              # Database migrations
│
├── .specify/                 # Spec-Driven Development artifacts
│   ├── memory/
│   │   └── constitution.md   # This file
│   ├── specs/                # Feature specifications
│   ├── templates/            # SDD templates
│   └── scripts/              # SDD scripts
│
└── history/                  # Development history
    ├── prompts/              # Prompt History Records (PHR)
    └── adr/                  # Architecture Decision Records
```

### Frontend Architecture Principles

**Component Organization:**
- **Components/**: Reusable, presentational UI components with CSS Modules for scoped styling
  - Each component has its own folder with `ComponentName.tsx` and `componentName.module.css`
  - Barrel export (`index.ts`) at the Components root for clean imports
  - Example: `import { Header, Footer } from '@/Components'`

- **features/**: Feature-specific page components (containers/orchestration)
  - Each feature has its own folder with `FeatureName.tsx` and `featureName.module.css`
  - Features orchestrate Components and manage feature-specific state
  - Barrel export (`index.ts`) at the features root
  - Example: `import { HomePage } from '@/features'`

- **app/**: Next.js App Router pages
  - `page.tsx` files are **server components** by default
  - Pages act as thin wrappers that render feature components from `@/features`
  - Route groups `(group-name)` for organization without affecting URL structure
  - Global layout in `layout.tsx` handles Header and Footer

**CSS Modules Convention:**
- Use CSS Modules for scoped styling: `componentName.module.css`
- Import styles as: `import styles from "./componentName.module.css"`
- Access styles as: `className={styles['class-name']}` (kebab-case class names)
- Avoid global styles unless in `globals.css`

**Import Path Aliases:**
- `@/Components` → Components directory
- `@/features` → Features directory
- Maintain barrel exports (`index.ts`) for clean imports

**Component Design Guidelines:**
- Components should be reusable and type-safe
- Server components (default in App Router) for data fetching and SEO
- Client components (`"use client"`) only when needed (interactivity, state)
- Feature components orchestrate multiple Components together
- Comments should explain purpose, not obvious code

### API Design Principles

- RESTful API design conventions
- Consistent error response format
- Proper HTTP status codes
- API versioning from day one (v1 in base path)
- Rate limiting per user
- Request validation with Pydantic models
- Automatic OpenAPI documentation via FastAPI

---

## Development Workflow

### Feature Development Lifecycle

1. **Discovery**: User or product team identifies a feature
2. **Specification**: Create feature spec using `/sp.specify`
   - Define user stories with priorities (P1, P2, P3...)
   - Write acceptance criteria
   - Identify edge cases
3. **Planning**: Generate implementation plan using `/sp.plan`
   - Query Context7 MCP for relevant docs
   - Define architecture and data models
   - Create API contracts
4. **Task Breakdown**: Generate tasks using `/sp.tasks`
   - Break into dependency-ordered steps
   - Organize by user story for independent delivery
5. **Implementation**: Execute tasks using `/sp.implement`
   - Follow TDD: write tests, see them fail, then implement
   - Maintain type safety at every step
6. **Documentation**: Record work via automatic PHR creation

### Code Review Standards

All code changes MUST:
- Pass all tests (unit, integration, E2E if applicable)
- Maintain type safety (no `any`, all type hints correct)
- Follow project code style
- Have clear commit messages
- Reference the feature spec and plan

### Branch Naming Convention

- Feature branches: `[###-feature-name]`
- Example: `001-user-authentication`, `002-todo-crud`

---

## Code Quality

### Type Safety Enforcement

**TypeScript:**
- tsconfig.json strict mode enabled
- ESLint rules to catch type issues
- Pre-commit hooks for type checking

**Python:**
- mypy strict mode in CI/CD
- All type hints required
- Pydantic models for all API boundaries

### Testing Strategy

**Backend (FastAPI):**
- Unit tests for services and business logic
- Integration tests for API endpoints
- Contract tests for API responses

**Frontend (Next.js):**
- Component unit tests
- Integration tests for user flows
- E2E tests for critical paths (P1 user stories)

### Linting and Formatting

**Frontend:**
- ESLint for code quality
- Prettier for code formatting
- Pre-commit hooks

**Backend:**
- Ruff or Black for formatting
- Flake8 or Ruff for linting
- Pre-commit hooks

---

## Security

### Authentication and Authorization

- Better Auth for all authentication
- Session management per Better Auth best practices
- Authorization checks on protected routes
- CSRF protection on state-changing operations

### Data Protection

- All user passwords hashed (bcrypt or Argon2)
- Environment variables for secrets (never in code)
- HTTPS in production
- Input validation on all API endpoints
- SQL injection prevention (SQLModel parameterized queries)

### Dependency Management

- Regular dependency updates
- Security scanning in CI/CD
- Vulnerability audits before releases

---

## Non-Functional Requirements

### Performance

- Frontend: Interactive time < 3 seconds
- API: p95 latency < 200ms for CRUD operations
- Database: Use indexes on queried fields
- Optimize bundle size (code splitting, lazy loading)

### Reliability

- Error tracking (e.g., Sentry or similar)
- Structured logging for debugging
- Graceful degradation on errors
- Database connection pooling

### Maintainability

- Clear code organization and naming
- Comments for non-obvious logic
- Comprehensive documentation in README and specs
- ADRs for significant architectural decisions

---

## Governance

### Amendment Procedure

This constitution is the source of truth for all development practices. Amendments require:

1. Proposal: Document the proposed change with rationale
2. Review: Team review and discussion
3. Approval: Majority approval from project maintainers
4. Update: Version bump per semantic versioning rules
5. Propagation: Update dependent templates and documentation

### Versioning

**Version**: 1.1.0 | **Ratified**: 2024-12-23 | **Last Amended**: 2024-12-23

**Version Bump Rules:**
- **MAJOR**: Backward incompatible principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance

All development activities MUST comply with this constitution. Violations must:
- Be documented in the relevant plan's Complexity Tracking section
- Have clear justification
- Be approved before proceeding
- Be considered for constitution amendment if recurring

### Enforcement

- Code reviews check for constitution compliance
- CI/CD checks for type safety and tests
- PHR records document decisions and outcomes
- ADRs capture architectural decisions and tradeoffs

---

**End of Constitution**
