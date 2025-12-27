# Feature Specification: Full-Stack Authentication with Better Auth

**Feature Branch**: `004-full-stack-auth`
**Created**: 2025-12-27
**Status**: Draft
**Input**: User description: "Full-stack authentication implementation covering frontend, backend, and database wiring using Better Auth"

## Overview

This specification defines the complete authentication system for the Full-Stack Todo application using Better Auth as the authentication framework. The implementation spans three layers:

1. **Frontend (Next.js)**: Better Auth client integration with session management
2. **Backend (FastAPI)**: JWT/JWKS verification and user auto-provisioning
3. **Database (PostgreSQL/Neon)**: Shared auth tables managed by Better Auth

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email/Password Registration (Priority: P1) 🎯 MVP

New users can create an account using their email address and a secure password. Upon successful registration, users are automatically signed in and can immediately access the todo application.

**Why this priority**: Account creation is the entry point for all new users. Without registration, no other features are accessible. This is the foundational authentication flow.

**Independent Test**: Can be fully tested by visiting the registration page, entering email/password, submitting the form, and verifying redirect to dashboard with authenticated session. Delivers immediate user onboarding capability.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user on the registration page, **When** they enter a valid email and password (min 8 characters), **Then** an account is created and they are redirected to the dashboard with an active session.

2. **Given** an unauthenticated user on the registration page, **When** they enter an email that already exists, **Then** they see an error message "Email already registered" and the form remains on the page.

3. **Given** an unauthenticated user on the registration page, **When** they enter a password less than 8 characters, **Then** they see a validation error "Password must be at least 8 characters" before form submission.

4. **Given** a user completing registration, **When** registration succeeds, **Then** a user record is created in the backend database with matching UUID from Better Auth.

---

### User Story 2 - Email/Password Sign In (Priority: P1) 🎯 MVP

Existing users can sign in using their registered email and password credentials. Upon successful authentication, users are redirected to the dashboard where they can access their tasks.

**Why this priority**: Sign-in is equally critical as registration—returning users must be able to access their accounts. Combined with US1, this completes the core authentication loop.

**Independent Test**: Can be fully tested by navigating to sign-in page, entering valid credentials, and verifying successful authentication with session cookie set.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user with an existing account, **When** they enter correct email and password, **Then** they are authenticated and redirected to the dashboard.

2. **Given** an unauthenticated user, **When** they enter an incorrect password, **Then** they see an error message "Invalid credentials" and remain on the sign-in page.

3. **Given** an unauthenticated user, **When** they enter a non-existent email, **Then** they see an error message "Invalid credentials" (same message for security).

4. **Given** a successfully authenticated user, **When** authentication completes, **Then** a secure HTTP-only session cookie is set with appropriate expiration.

---

### User Story 3 - Session Persistence and Management (Priority: P1) 🎯 MVP

Authenticated users remain signed in across browser sessions until they explicitly sign out or their session expires. The system maintains session state securely without requiring re-authentication on every page load.

**Why this priority**: Session management is critical for user experience—nobody wants to sign in repeatedly. This enables persistent authentication state.

**Independent Test**: Can be tested by signing in, closing the browser, reopening, and verifying the user is still authenticated.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they close and reopen the browser within 7 days, **Then** they remain authenticated without re-entering credentials.

2. **Given** an authenticated user, **When** they access any protected page, **Then** the session is validated and extended (sliding window).

3. **Given** a user with an expired session (>7 days inactive), **When** they access a protected page, **Then** they are redirected to the sign-in page.

4. **Given** an authenticated user on the frontend, **When** they make an API request to the backend, **Then** the backend validates the JWT and authorizes the request.

---

### User Story 4 - Sign Out (Priority: P1) 🎯 MVP

Authenticated users can sign out of the application, which invalidates their current session and redirects them to the home page. Sign out should work reliably and immediately.

**Why this priority**: Users must be able to securely terminate their sessions, especially on shared devices. This completes the authentication lifecycle.

**Independent Test**: Can be tested by signing in, clicking sign out, and verifying the session is invalidated and protected routes are no longer accessible.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they click the sign out button, **Then** their session is invalidated and they are redirected to the home page.

2. **Given** a user who just signed out, **When** they navigate to a protected route, **Then** they are redirected to the sign-in page.

3. **Given** a user who just signed out, **When** they try to use the old session cookie, **Then** the backend rejects the request with 401 Unauthorized.

---

### User Story 5 - Protected Route Access Control (Priority: P1) 🎯 MVP

The application enforces authentication on protected routes. Unauthenticated users attempting to access protected pages are redirected to sign-in, while authenticated users can access their resources.

**Why this priority**: Route protection is essential for security—it ensures only authenticated users can access private data. This is the enforcement mechanism for all other auth features.

**Independent Test**: Can be tested by accessing /dashboard while unauthenticated (expect redirect) and while authenticated (expect access).

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate to /dashboard, **Then** they are redirected to /auth/sign-in with a return URL parameter.

2. **Given** an authenticated user, **When** they navigate to /dashboard, **Then** they see the dashboard with their tasks.

3. **Given** an unauthenticated user who completes sign-in with a return URL, **When** sign-in succeeds, **Then** they are redirected to the original requested URL.

4. **Given** a request to the backend API without a valid JWT, **When** the request reaches a protected endpoint, **Then** the backend returns 401 Unauthorized.

---

### User Story 6 - Backend JWT Verification (Priority: P1) 🎯 MVP

The FastAPI backend verifies JWT tokens issued by Better Auth using JWKS (JSON Web Key Set). Valid tokens grant access to user-specific resources; invalid or expired tokens are rejected.

**Why this priority**: Backend authorization is non-negotiable for security. The frontend cannot be trusted—all data access must be authenticated at the API level.

**Independent Test**: Can be tested by making API requests with valid JWT (expect 200), expired JWT (expect 401), and no JWT (expect 401).

**Acceptance Scenarios**:

1. **Given** a request with a valid JWT in the Authorization header, **When** the backend verifies the token, **Then** the request is processed and returns the requested data.

2. **Given** a request with an expired JWT, **When** the backend attempts verification, **Then** the request is rejected with 401 Unauthorized and message "Token expired".

3. **Given** a request with an invalid JWT signature, **When** the backend attempts verification, **Then** the request is rejected with 401 Unauthorized and message "Invalid token".

4. **Given** a request without an Authorization header to a protected endpoint, **When** the backend checks authentication, **Then** the request is rejected with 401 Unauthorized.

5. **Given** a valid JWT for a new user not in the backend database, **When** the backend processes the request, **Then** it auto-creates the user record from JWT claims (sub, email, name) and proceeds.

---

### User Story 7 - User Profile Display (Priority: P2)

Authenticated users can view their profile information (email, display name) in the application header and on a dedicated profile page. Profile data comes from the authenticated session.

**Why this priority**: Profile display enhances user experience by personalizing the interface. Lower priority than core auth flows but important for usability.

**Independent Test**: Can be tested by signing in and verifying the user's name/email appears in the header and profile section.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they view the application header, **Then** they see their display name or email.

2. **Given** an authenticated user, **When** they navigate to /profile, **Then** they see their email and display name.

3. **Given** a user who registered with only an email, **When** display name is rendered, **Then** the system shows the email prefix as fallback (e.g., "john" from "john@example.com").

---

### User Story 8 - Social OAuth Sign In - Google (Priority: P3)

Users can sign in or register using their Google account. OAuth flow handles the authentication, and new users are automatically provisioned in the system.

**Why this priority**: Social auth reduces friction for users who prefer not to create new credentials. Google is the most common OAuth provider but not MVP-critical.

**Independent Test**: Can be tested by clicking "Sign in with Google", completing Google OAuth flow, and verifying successful authentication.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they click "Sign in with Google", **Then** they are redirected to Google OAuth consent screen.

2. **Given** a user completing Google OAuth for the first time, **When** consent is granted, **Then** a new account is created with Google profile info and they are signed in.

3. **Given** a user with an existing Google-linked account, **When** they sign in with Google, **Then** they are authenticated to their existing account.

4. **Given** a user completing Google OAuth, **When** the user denies consent, **Then** they are returned to the sign-in page with an error message.

---

### User Story 9 - Social OAuth Sign In - GitHub (Priority: P3)

Users can sign in or register using their GitHub account. This is particularly useful for the developer-focused todo application audience.

**Why this priority**: GitHub OAuth appeals to the developer target audience. Same priority as Google OAuth—nice to have but not MVP-critical.

**Independent Test**: Can be tested by clicking "Sign in with GitHub", completing GitHub OAuth flow, and verifying successful authentication.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they click "Sign in with GitHub", **Then** they are redirected to GitHub OAuth consent screen.

2. **Given** a user completing GitHub OAuth for the first time, **When** consent is granted, **Then** a new account is created with GitHub profile info and they are signed in.

3. **Given** a user with an existing GitHub-linked account, **When** they sign in with GitHub, **Then** they are authenticated to their existing account.

---

### Edge Cases

- **What happens when** a user tries to sign in while already authenticated?
  - Redirect to dashboard with existing session preserved.

- **What happens when** a user's session becomes invalid mid-request (e.g., admin revokes session)?
  - Backend returns 401, frontend clears local session state, redirects to sign-in.

- **What happens when** Better Auth JWKS endpoint is temporarily unavailable?
  - Backend caches JWKS with reasonable TTL (1 hour), uses cached keys during outage.

- **What happens when** a user registers with email, then tries to OAuth with same email?
  - Better Auth handles account linking per its configuration (configurable behavior).

- **What happens when** network fails during OAuth redirect?
  - User remains on original page with error message, can retry.

- **What happens when** the database connection fails during user auto-provisioning?
  - Backend returns 503 Service Unavailable, logs error, user can retry.

## Requirements *(mandatory)*

### Functional Requirements

#### Frontend (Next.js + Better Auth Client)

- **FR-001**: System MUST initialize Better Auth client with appropriate configuration (API base URL, session management)
- **FR-002**: System MUST provide sign-up page at `/auth/sign-up` with email/password form
- **FR-003**: System MUST provide sign-in page at `/auth/sign-in` with email/password form
- **FR-004**: System MUST support "Sign in with Google" OAuth button on auth pages
- **FR-005**: System MUST support "Sign in with GitHub" OAuth button on auth pages
- **FR-006**: System MUST protect routes under `/dashboard/*` requiring authentication
- **FR-007**: System MUST redirect unauthenticated users to sign-in with return URL preservation
- **FR-008**: System MUST provide sign-out functionality accessible from authenticated pages
- **FR-009**: System MUST display current user info (name/email) in the authenticated UI
- **FR-010**: System MUST persist session state in HTTP-only cookies (managed by Better Auth)
- **FR-011**: System MUST validate password strength (minimum 8 characters) before submission
- **FR-012**: System MUST display appropriate error messages for auth failures

#### Backend (FastAPI + JWT/JWKS)

- **FR-013**: System MUST verify JWT tokens from Authorization header using Better Auth JWKS
- **FR-014**: System MUST reject requests with missing, expired, or invalid tokens with 401
- **FR-015**: System MUST extract user identity (sub, email, name) from valid JWT claims
- **FR-016**: System MUST auto-create user records on first authenticated request if not exists
- **FR-017**: System MUST map JWT 'sub' claim to User.id (UUID) for all database queries
- **FR-018**: System MUST provide `get_current_user` dependency for protected endpoints
- **FR-019**: System MUST cache JWKS with configurable TTL to reduce auth latency
- **FR-020**: System MUST log all authentication events (success, failure, token expiry)
- **FR-021**: System MUST return appropriate error response schema for auth failures

#### Database (PostgreSQL via Neon)

- **FR-022**: System MUST use Better Auth managed tables for sessions and accounts
- **FR-023**: System MUST maintain User table with id (UUID), email, display_name, created_at
- **FR-024**: System MUST ensure User.id matches Better Auth user ID from JWT 'sub' claim
- **FR-025**: System MUST support foreign key relationships from Task, Project, Tag to User

### Non-Functional Requirements

- **NFR-001**: JWT verification MUST complete in < 50ms (with cached JWKS)
- **NFR-002**: Auth pages MUST load in < 2 seconds on 3G connection
- **NFR-003**: Session cookies MUST use Secure, HttpOnly, SameSite=Lax flags
- **NFR-004**: Failed login attempts MUST be rate-limited (10 attempts per 15 minutes per IP)
- **NFR-005**: JWKS cache TTL MUST be configurable (default 1 hour)
- **NFR-006**: System MUST work with Neon DB connection pooling

### Key Entities

- **User**: Represents an authenticated user. Attributes: id (UUID from Better Auth), email (unique), display_name, created_at. Owns Tasks, Projects, and Tags.

- **Session (Better Auth managed)**: Represents an active user session. Managed entirely by Better Auth, stored in PostgreSQL. Contains session token, user reference, expiration.

- **Account (Better Auth managed)**: Links authentication providers to users. Supports email/password and OAuth providers (Google, GitHub). Managed by Better Auth.

## Technical Architecture

### Authentication Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │     │   Next.js   │     │   FastAPI   │     │   Neon DB   │
│   (User)    │     │  (Frontend) │     │  (Backend)  │     │ (PostgreSQL)│
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ 1. Sign In        │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ 2. Better Auth    │                   │
       │                   │    Sign In API    │                   │
       │                   │──────────────────────────────────────>│
       │                   │                   │                   │
       │                   │ 3. Session Cookie │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
       │ 4. API Request    │                   │                   │
       │   (with cookie)   │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ 5. Get JWT from   │                   │
       │                   │    Better Auth    │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │ 6. API Request    │                   │
       │                   │    (Bearer JWT)   │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ 7. Verify JWT     │
       │                   │                   │    via JWKS       │
       │                   │                   │────────┐          │
       │                   │                   │        │          │
       │                   │                   │<───────┘          │
       │                   │                   │                   │
       │                   │                   │ 8. Query User     │
       │                   │                   │    Data           │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │ 9. Response       │                   │
       │<──────────────────│<──────────────────│<──────────────────│
       │                   │                   │                   │
```

### Frontend Architecture

```
frontend/
├── app/
│   ├── auth/
│   │   ├── sign-in/
│   │   │   └── page.tsx          # Sign-in page (Server Component wrapper)
│   │   ├── sign-up/
│   │   │   └── page.tsx          # Sign-up page (Server Component wrapper)
│   │   └── layout.tsx            # Auth layout (no header for clean UX)
│   ├── dashboard/
│   │   ├── page.tsx              # Protected dashboard
│   │   └── layout.tsx            # Dashboard layout with auth check
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts      # Better Auth API route handler
│   └── layout.tsx                # Root layout
├── features/
│   ├── auth/
│   │   ├── SignInForm/
│   │   │   ├── SignInForm.tsx
│   │   │   └── signInForm.module.css
│   │   ├── SignUpForm/
│   │   │   ├── SignUpForm.tsx
│   │   │   └── signUpForm.module.css
│   │   ├── SocialAuthButtons/
│   │   │   ├── SocialAuthButtons.tsx
│   │   │   └── socialAuthButtons.module.css
│   │   └── index.ts
│   └── index.ts
├── lib/
│   ├── auth.ts                   # Better Auth client configuration
│   └── auth-client.ts            # Better Auth client instance
└── middleware.ts                 # Next.js middleware for route protection
```

### Backend Architecture

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py             # Settings including BETTER_AUTH_URL
│   │   ├── security.py           # JWT/JWKS verification
│   │   └── database.py           # Database connection
│   ├── api/
│   │   ├── deps.py               # get_current_user dependency
│   │   └── v1/
│   │       ├── users.py          # User endpoints (protected)
│   │       ├── tasks.py          # Task endpoints (protected)
│   │       └── ...
│   ├── models/
│   │   └── user.py               # User SQLModel
│   └── main.py                   # FastAPI app
└── tests/
    ├── unit/
    │   └── test_security.py      # JWT verification tests
    └── integration/
        └── test_auth.py          # Auth flow integration tests
```

### Database Schema (Better Auth + Application)

```sql
-- Better Auth managed tables (created by Better Auth)
-- Reference: https://www.better-auth.com/docs/concepts/database

-- user table (Better Auth core)
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    emailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- session table (Better Auth core)
CREATE TABLE "session" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- account table (Better Auth core - OAuth)
CREATE TABLE "account" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    accessTokenExpiresAt TIMESTAMP,
    refreshTokenExpiresAt TIMESTAMP,
    scope TEXT,
    idToken TEXT,
    password TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- verification table (Better Auth core - email verification)
CREATE TABLE "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application tables (existing, modified)
-- Note: users table already exists, will be synced with Better Auth "user" table

CREATE TABLE users (
    id UUID PRIMARY KEY,  -- Maps to Better Auth user.id
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign keys from existing tables reference users.id
-- tasks.user_id -> users.id
-- projects.user_id -> users.id
-- tags.user_id -> users.id
```

### Configuration Requirements

```typescript
// Frontend: lib/auth.ts
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: {
    // Neon PostgreSQL connection
    type: "postgres",
    url: process.env.DATABASE_URL,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,      // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,             // Cache for 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,  // MVP: skip email verification
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

```python
# Backend: app/core/config.py
class Settings(BaseSettings):
    # Existing settings...

    # Better Auth settings
    BETTER_AUTH_URL: str = "http://localhost:3000"  # Frontend URL
    JWKS_CACHE_TTL: int = 3600  # 1 hour in seconds
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration in under 30 seconds (form fill + submit + redirect)
- **SC-002**: Users can complete sign-in in under 15 seconds
- **SC-003**: Protected route access check completes in < 100ms (frontend middleware)
- **SC-004**: JWT verification completes in < 50ms with cached JWKS
- **SC-005**: 100% of API requests to protected endpoints without valid JWT return 401
- **SC-006**: Session persistence works across browser restarts for 7 days
- **SC-007**: OAuth flow completes in < 5 seconds (excluding provider UI time)
- **SC-008**: Zero authentication-related console errors in production

### Acceptance Tests

- [ ] User can register with email/password
- [ ] User can sign in with email/password
- [ ] User can sign out
- [ ] Protected routes redirect unauthenticated users
- [ ] Backend rejects requests without valid JWT
- [ ] Backend auto-creates user on first authenticated request
- [ ] Session persists across browser sessions
- [ ] OAuth (Google) sign-in works
- [ ] OAuth (GitHub) sign-in works

## Out of Scope

- Email verification (deferred to future iteration)
- Password reset flow (deferred to future iteration)
- Two-factor authentication (deferred to future iteration)
- Account deletion/GDPR compliance (deferred to future iteration)
- Admin user management (deferred to future iteration)
- Refresh token rotation (handled by Better Auth defaults)

## Dependencies

- **External**: Google OAuth credentials, GitHub OAuth credentials
- **Internal**: Existing backend User model, Neon DB connection
- **Libraries**: Better Auth (frontend), PyJWT + python-jose (backend)

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| JWKS endpoint unavailable | Users can't authenticate | Low | Cache JWKS aggressively (1h TTL), retry logic |
| OAuth provider outage | Users can't use social login | Low | Email/password as fallback, clear error messages |
| Session cookie theft | Account compromise | Medium | HttpOnly, Secure, SameSite cookies; session binding to IP |
| JWT algorithm confusion | Security vulnerability | Low | Strict algorithm validation (RS256 only) |
| User ID mismatch between systems | Data integrity issues | Medium | UUID consistency, migration script for existing users |

---

**Specification Complete**: Ready for `/sp.plan` to generate implementation plan.
