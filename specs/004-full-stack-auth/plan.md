# Implementation Plan: Full-Stack Authentication

**Branch**: `004-full-stack-auth` | **Date**: 2025-12-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-full-stack-auth/spec.md`

## Summary

Implement full-stack authentication using Better Auth (frontend) with JWT/JWKS verification (backend). The system provides email/password authentication with optional Google/GitHub OAuth, session management via HTTP-only cookies, and backend API authorization through JWT verification.

**Key Technical Decisions** (from research.md):
1. Use `getSessionCookie` for Next.js middleware route protection
2. Use `nextCookies` plugin for Better Auth server actions
3. Use PyJWT with `PyJWKClient` for backend JWKS verification
4. Auto-provision backend users from JWT claims on first authenticated request

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x, Node.js 18+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 15, Better Auth, @better-fetch/fetch
- Backend: FastAPI, PyJWT, cryptography

**Storage**: PostgreSQL via Neon DB (connection pooling enabled)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, pytest-asyncio

**Target Platform**: Web (desktop/mobile browsers)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- JWT verification: < 50ms (with cached JWKS)
- Auth page load: < 2 seconds
- Session validation: < 100ms

**Constraints**:
- Session cookies: Secure, HttpOnly, SameSite=Lax
- JWKS cache TTL: 1 hour (configurable)
- Session expiry: 7 days

**Scale/Scope**: Single-tenant, ~10k users, 9 user stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety First | ✅ PASS | TypeScript strict mode, Python type hints, Pydantic models |
| II. Context7 MCP | ✅ PASS | Used Context7 for Better Auth, Next.js middleware, PyJWT docs |
| III. Spec-Driven Development | ✅ PASS | Following SDD workflow: spec → plan → tasks → implement |
| IV. Better Auth | ✅ PASS | Using Better Auth as sole auth framework |
| V. Full-Stack Type Consistency | ✅ PASS | Types defined in contracts/auth-types.ts |
| VI. Developer Productivity | ✅ PASS | Auto-provisioning, cookie-based sessions, minimal config |

**All gates passed.** Implementation can proceed.

## Project Structure

### Documentation (this feature)

```text
specs/004-full-stack-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output (completed)
├── data-model.md        # Phase 1 output (completed)
├── quickstart.md        # Phase 1 output (completed)
├── contracts/           # Phase 1 output (completed)
│   ├── auth-openapi.yaml
│   └── auth-types.ts
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (pending /sp.tasks)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Add BETTER_AUTH_URL, JWKS_CACHE_TTL
│   │   ├── security.py        # NEW: JWT/JWKS verification
│   │   └── database.py        # Existing
│   ├── api/
│   │   ├── deps.py            # NEW: get_current_user dependency
│   │   └── v1/
│   │       ├── users.py       # Update: protect with auth
│   │       ├── tasks.py       # Update: protect with auth
│   │       ├── projects.py    # Update: protect with auth
│   │       └── tags.py        # Update: protect with auth
│   ├── models/
│   │   └── user.py            # Existing (no changes)
│   └── main.py                # Existing
└── tests/
    ├── unit/
    │   └── test_security.py   # NEW: JWT verification tests
    └── integration/
        └── test_auth.py       # NEW: Auth flow tests

frontend/
├── app/
│   ├── auth/
│   │   ├── sign-in/
│   │   │   └── page.tsx       # NEW: Sign-in page
│   │   ├── sign-up/
│   │   │   └── page.tsx       # NEW: Sign-up page
│   │   └── layout.tsx         # NEW: Auth layout
│   ├── dashboard/
│   │   ├── page.tsx           # NEW: Protected dashboard
│   │   └── layout.tsx         # NEW: Dashboard layout
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts   # NEW: Better Auth handler
│   ├── layout.tsx             # Update: conditionally show auth state
│   └── page.tsx               # Existing
├── features/
│   └── auth/
│       ├── SignInForm/
│       │   ├── SignInForm.tsx
│       │   └── signInForm.module.css
│       ├── SignUpForm/
│       │   ├── SignUpForm.tsx
│       │   └── signUpForm.module.css
│       ├── SocialAuthButtons/
│       │   ├── SocialAuthButtons.tsx
│       │   └── socialAuthButtons.module.css
│       ├── UserMenu/
│       │   ├── UserMenu.tsx
│       │   └── userMenu.module.css
│       └── index.ts
├── lib/
│   ├── auth.ts               # NEW: Better Auth server config
│   └── auth-client.ts        # NEW: Better Auth client
├── middleware.ts             # NEW: Route protection
└── tests/
    └── auth/
        └── auth.test.tsx     # NEW: Auth component tests
```

**Structure Decision**: Web application with separate frontend (Next.js) and backend (FastAPI). This aligns with existing project structure from 003-backend-implementation.

## Architecture Overview

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐                    ┌──────────┐                ┌──────────┐
  │  Browser │                    │  Next.js │                │ FastAPI  │
  │  (User)  │                    │ Frontend │                │ Backend  │
  └────┬─────┘                    └────┬─────┘                └────┬─────┘
       │                               │                           │
       │ 1. Sign In Form               │                           │
       │──────────────────────────────>│                           │
       │                               │                           │
       │                               │ 2. Better Auth            │
       │                               │    /api/auth/sign-in      │
       │                               │────────┐                  │
       │                               │        │ Verify           │
       │                               │<───────┘ Credentials      │
       │                               │                           │
       │ 3. Set Session Cookie         │                           │
       │<──────────────────────────────│                           │
       │                               │                           │
       │ 4. Request /api/v1/tasks      │                           │
       │──────────────────────────────>│                           │
       │                               │                           │
       │                               │ 5. Get JWT from Session   │
       │                               │────────┐                  │
       │                               │        │                  │
       │                               │<───────┘                  │
       │                               │                           │
       │                               │ 6. Forward with JWT       │
       │                               │──────────────────────────>│
       │                               │                           │
       │                               │                           │ 7. Verify JWT
       │                               │                           │    via JWKS
       │                               │                           │────────┐
       │                               │                           │        │
       │                               │                           │<───────┘
       │                               │                           │
       │                               │ 8. Response               │
       │<──────────────────────────────│<──────────────────────────│
       │                               │                           │
```

### Key Components

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Auth Server | Better Auth | User registration, login, OAuth, session management |
| Auth Client | better-auth/react | Client-side hooks, sign-in/out methods |
| Middleware | Next.js | Route protection, session cookie checks |
| JWT Verifier | PyJWT + PyJWKClient | Backend token verification |
| User Provisioner | FastAPI Dependency | Auto-create users from JWT claims |

## Implementation Phases

### Phase 1: Frontend Authentication Setup (MVP)
- Better Auth configuration
- Auth API route handler
- Sign-in/sign-up pages
- Session hooks

### Phase 2: Backend JWT Verification (MVP)
- PyJWT/JWKS setup
- Security module
- get_current_user dependency
- Protect existing endpoints

### Phase 3: Route Protection (MVP)
- Next.js middleware
- Protected layouts
- Auth-only redirects

### Phase 4: User Experience (P2)
- User menu component
- Profile display
- Sign-out flow

### Phase 5: Social OAuth (P3)
- Google OAuth setup
- GitHub OAuth setup
- Account linking

### Phase 6: Testing & Polish
- Unit tests
- Integration tests
- E2E auth flow tests

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| JWKS endpoint unavailable | Cache JWKS for 1 hour, retry with exponential backoff |
| OAuth provider outage | Email/password as fallback, clear error messages |
| Session cookie theft | HttpOnly, Secure, SameSite cookies |
| JWT algorithm confusion | Strict RS256 validation in backend |
| User ID mismatch | UUID validation, auto-provisioning from JWT |

## Complexity Tracking

No constitution violations. All requirements align with principles.

---

## Generated Artifacts

| Artifact | Status | Path |
|----------|--------|------|
| research.md | ✅ Complete | specs/004-full-stack-auth/research.md |
| data-model.md | ✅ Complete | specs/004-full-stack-auth/data-model.md |
| contracts/auth-openapi.yaml | ✅ Complete | specs/004-full-stack-auth/contracts/auth-openapi.yaml |
| contracts/auth-types.ts | ✅ Complete | specs/004-full-stack-auth/contracts/auth-types.ts |
| quickstart.md | ✅ Complete | specs/004-full-stack-auth/quickstart.md |
| tasks.md | ⏳ Pending | Run `/sp.tasks` to generate |

---

**Plan Status**: COMPLETE - Ready for `/sp.tasks` to generate implementation tasks.
