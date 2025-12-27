# Tasks: Full-Stack Authentication

**Input**: Design documents from `/specs/004-full-stack-auth/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 [P] Install Better Auth dependencies in frontend: `npm install better-auth @better-fetch/fetch` in `frontend/`
- [x] T002 [P] Install PyJWT dependencies in backend: `uv add PyJWT cryptography` in `backend/`
- [x] T003 [P] Add environment variables to `frontend/.env.local` (BETTER_AUTH_SECRET, DATABASE_URL, NEXT_PUBLIC_APP_URL)
- [x] T004 [P] Add environment variables to `backend/.env` (BETTER_AUTH_URL, JWKS_CACHE_TTL)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [ ] T005 Run Better Auth migrations: `npx @better-auth/cli migrate` in `frontend/` to create user, session, account, verification tables (requires .env.local with DATABASE_URL)

### Backend Security Module

- [x] T006 Create security module with JWKS client at `backend/app/core/security.py`:
  - Initialize `PyJWKClient` with BETTER_AUTH_URL/.well-known/jwks.json
  - Implement `verify_jwt_token(token: str) -> dict` function
  - Handle `ExpiredSignatureError` and `InvalidTokenError`
  - Enforce RS256 algorithm only

- [x] T007 Update config settings at `backend/app/core/config.py`:
  - Add `BETTER_AUTH_URL: str` setting
  - Add `JWKS_CACHE_TTL: int` setting (default 3600)

- [x] T008 Create auth dependency at `backend/app/api/deps.py`:
  - Implement `get_current_user()` dependency
  - Extract Bearer token from Authorization header
  - Verify token using security module
  - Implement `get_or_create_user()` for auto-provisioning

### Frontend Auth Core

- [x] T009 Create Better Auth server config at `frontend/lib/auth.ts`:
  - Configure database connection (Neon PostgreSQL)
  - Enable emailAndPassword provider
  - Configure session settings (7-day expiry, cookie cache)
  - Add nextCookies() plugin (MUST be last)

- [x] T010 Create Better Auth client at `frontend/lib/auth-client.ts`:
  - Export `authClient` with createAuthClient()
  - Configure baseURL from environment

- [x] T011 Create Better Auth API route handler at `frontend/app/api/auth/[...all]/route.ts`:
  - Export GET and POST handlers using toNextJsHandler()

### Type Definitions

- [x] T012 [P] Copy auth types from contracts to frontend at `frontend/lib/types/auth.ts`:
  - Copy types from `specs/004-full-stack-auth/contracts/auth-types.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Email/Password Registration (Priority: P1) 🎯 MVP

**Goal**: New users can create an account using email and password

**Independent Test**: Visit `/auth/sign-up`, enter email/password, submit form, verify redirect to dashboard

### Implementation for User Story 1

- [x] T013 [US1] Create auth layout at `frontend/app/auth/layout.tsx`:
  - Clean layout without navigation header
  - Center content vertically and horizontally
  - Apply consistent styling

- [x] T014 [US1] Create SignUpForm component at `frontend/features/auth/SignUpForm/SignUpForm.tsx`:
  - Email input with validation
  - Password input with min 8 character validation
  - Confirm password field with matching validation
  - Name input (optional)
  - Submit button with loading state
  - Error message display
  - Use authClient.signUp.email() for submission
  - Redirect to /dashboard on success

- [x] T015 [P] [US1] Create SignUpForm styles at `frontend/features/auth/SignUpForm/signUpForm.module.css`

- [x] T016 [US1] Create sign-up page at `frontend/app/auth/sign-up/page.tsx`:
  - Server component wrapper
  - Render SignUpForm
  - Link to sign-in page

- [x] T017 [US1] Export auth components from `frontend/features/auth/index.ts`

**Checkpoint**: User Story 1 complete - users can register with email/password

---

## Phase 4: User Story 2 - Email/Password Sign In (Priority: P1) 🎯 MVP

**Goal**: Existing users can sign in using their credentials

**Independent Test**: Visit `/auth/sign-in`, enter valid credentials, verify redirect to dashboard

### Implementation for User Story 2

- [x] T018 [US2] Create SignInForm component at `frontend/features/auth/SignInForm/SignInForm.tsx`:
  - Email input with validation
  - Password input
  - Submit button with loading state
  - Error message display ("Invalid credentials" for both wrong email/password)
  - Use authClient.signIn.email() for submission
  - Redirect to /dashboard on success (or returnUrl if present)

- [x] T019 [P] [US2] Create SignInForm styles at `frontend/features/auth/SignInForm/signInForm.module.css`

- [x] T020 [US2] Create sign-in page at `frontend/app/auth/sign-in/page.tsx`:
  - Server component wrapper
  - Render SignInForm
  - Link to sign-up page
  - Handle returnUrl query parameter

- [x] T021 [US2] Update auth component exports in `frontend/features/auth/index.ts`

**Checkpoint**: User Story 2 complete - users can sign in with email/password

---

## Phase 5: User Story 3 - Session Persistence and Management (Priority: P1) 🎯 MVP

**Goal**: Authenticated users remain signed in across browser sessions

**Independent Test**: Sign in, close browser, reopen, verify still authenticated

### Implementation for User Story 3

- [x] T022 [US3] Implement session hook usage in dashboard at `frontend/app/dashboard/page.tsx`:
  - Use authClient.useSession() to get current session
  - Display loading state while session is pending
  - Display user info when authenticated (existing Dashboard component handles task display)

- [x] T023 [US3] Create dashboard layout at `frontend/app/dashboard/layout.tsx`:
  - Server component that checks session
  - Redirect to sign-in if not authenticated

**Checkpoint**: User Story 3 complete - sessions persist across browser restarts

---

## Phase 6: User Story 4 - Sign Out (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can sign out of the application

**Independent Test**: While authenticated, click sign out, verify redirect to home and session cleared

### Implementation for User Story 4

- [x] T024 [US4] Create UserMenu component at `frontend/features/auth/UserMenu/UserMenu.tsx`:
  - Display user name/email
  - Sign out button
  - Use authClient.signOut() for sign out
  - Redirect to home page on sign out success

- [x] T025 [P] [US4] Create UserMenu styles at `frontend/features/auth/UserMenu/userMenu.module.css`

- [x] T026 [US4] Update auth component exports in `frontend/features/auth/index.ts`

- [x] T027 [US4] Update Header component at `frontend/Components/Header/Header.tsx`:
  - Conditionally show UserMenu when authenticated
  - Show sign-in link when not authenticated

**Checkpoint**: User Story 4 complete - users can sign out

---

## Phase 7: User Story 5 - Protected Route Access Control (Priority: P1) 🎯 MVP

**Goal**: Enforce authentication on protected routes with redirects

**Independent Test**: Access /dashboard while unauthenticated, verify redirect to /auth/sign-in

### Implementation for User Story 5

- [x] T028 [US5] Create Next.js middleware at `frontend/middleware.ts`:
  - Use getSessionCookie from better-auth/cookies
  - Protect /dashboard/* routes
  - Redirect unauthenticated users to /auth/sign-in with returnUrl
  - Redirect authenticated users from /auth/* to /dashboard
  - Configure matcher for /dashboard/:path* and /auth/:path*

**Checkpoint**: User Story 5 complete - protected routes redirect unauthenticated users

---

## Phase 8: User Story 6 - Backend JWT Verification (Priority: P1) 🎯 MVP

**Goal**: Backend verifies JWT tokens and auto-provisions users

**Independent Test**: Make API request with valid JWT (200), expired JWT (401), no JWT (401)

### Implementation for User Story 6

- [x] T029 [US6] Protect users endpoint at `backend/app/api/v1/users.py`:
  - Add get_current_user dependency to /users/me endpoint
  - Return current user profile from database

- [x] T030 [US6] Protect tasks endpoint at `backend/app/api/v1/tasks.py`:
  - Add get_current_user dependency to all endpoints
  - Filter tasks by current user ID

- [x] T031 [US6] Protect projects endpoint at `backend/app/api/v1/projects.py`:
  - Add get_current_user dependency to all endpoints
  - Filter projects by current user ID

- [x] T032 [US6] Protect tags endpoint at `backend/app/api/v1/tags.py`:
  - Add get_current_user dependency to all endpoints
  - Filter tags by current user ID

- [x] T033 [US6] Add logging for auth events at `backend/app/core/security.py`:
  - Log successful verifications
  - Log token expiry events
  - Log invalid token events
  - Log user auto-provisioning events

**Checkpoint**: User Story 6 complete - backend rejects requests without valid JWT

---

## Phase 9: User Story 7 - User Profile Display (Priority: P2)

**Goal**: Authenticated users can view their profile information

**Independent Test**: Sign in, verify user name/email in header and profile page

### Implementation for User Story 7

- [x] T034 [US7] Create profile page at `frontend/app/profile/page.tsx`:
  - Display user email
  - Display user display name
  - Display account creation date
  - Protected route (requires authentication)
  - use skill at `.claude/skills/ui-ux`

- [x] T035 [US7] Update UserMenu to show user info at `frontend/features/auth/UserMenu/UserMenu.tsx`:
  - Show user avatar/initial
  - Show user email or name
  - Link to profile page

- [x] T036 [US7] Update middleware to protect profile route at `frontend/middleware.ts`:
  - Add /profile to protected routes matcher

**Checkpoint**: User Story 7 complete - users can view profile info

---

## Phase 10: User Story 8 - Social OAuth - Google (Priority: P3)

**Goal**: Users can sign in using their Google account

**Independent Test**: Click "Sign in with Google", complete OAuth flow, verify authentication

### Implementation for User Story 8

- [x] T037 [US8] Add Google OAuth provider to auth config at `frontend/lib/auth.ts`:
  - Configure Google clientId from environment
  - Configure Google clientSecret from environment
  - Set callback URL

- [x] T038 [US8] Create SocialAuthButtons component at `frontend/features/auth/SocialAuthButtons/SocialAuthButtons.tsx`:
  - "Sign in with Google" button
  - Use authClient.signIn.social({ provider: "google" })
  - Loading state during OAuth redirect
  - Handle OAuth errors

- [x] T039 [P] [US8] Create SocialAuthButtons styles at `frontend/features/auth/SocialAuthButtons/socialAuthButtons.module.css`

- [x] T040 [US8] Add SocialAuthButtons to sign-in page at `frontend/app/auth/sign-in/page.tsx`:
  - Add divider with "or"
  - Render SocialAuthButtons below email form

- [x] T041 [US8] Add SocialAuthButtons to sign-up page at `frontend/app/auth/sign-up/page.tsx`:
  - Add divider with "or"
  - Render SocialAuthButtons below email form

- [x] T042 [US8] Update auth component exports in `frontend/features/auth/index.ts`

**Checkpoint**: User Story 8 complete - users can sign in with Google

---

## Phase 11: User Story 9 - Social OAuth - GitHub (Priority: P3)

**Goal**: Users can sign in using their GitHub account

**Independent Test**: Click "Sign in with GitHub", complete OAuth flow, verify authentication

### Implementation for User Story 9

- [x] T043 [US9] Add GitHub OAuth provider to auth config at `frontend/lib/auth.ts`:
  - Configure GitHub clientId from environment
  - Configure GitHub clientSecret from environment
  - Set callback URL

- [x] T044 [US9] Update SocialAuthButtons component at `frontend/features/auth/SocialAuthButtons/SocialAuthButtons.tsx`:
  - Add "Sign in with GitHub" button
  - Use authClient.signIn.social({ provider: "github" })

**Checkpoint**: User Story 9 complete - users can sign in with GitHub

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T045 [P] Add unit tests for security module at `backend/tests/unit/test_security.py`:
  - Test valid JWT verification
  - Test expired JWT handling
  - Test invalid JWT handling
  - Test missing token handling

- [x] T046 [P] Add integration tests for auth flow at `backend/tests/integration/test_auth.py`:
  - Test protected endpoint with valid token
  - Test protected endpoint without token
  - Test user auto-provisioning

- [x] T047 [P] Add frontend auth tests at `frontend/tests/auth/auth.test.tsx`:
  - Test SignInForm rendering and submission
  - Test SignUpForm rendering and validation
  - Test sign out functionality

- [x] T048 Run quickstart.md validation:
  - Follow all steps in quickstart.md
  - Verify all flows work as documented
  - Update quickstart.md if needed

- [x] T049 Security hardening review:
  - Verify all cookies are HttpOnly, Secure, SameSite=Lax
  - Verify JWKS cache TTL is configured
  - Verify RS256 algorithm enforcement
  - Check for any hardcoded secrets

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-11)**: All depend on Foundational phase completion
  - US1-US6 (P1 MVP) should be completed first
  - US7 (P2) can be done after MVP
  - US8-US9 (P3) can be done last
- **Polish (Phase 12)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (Registration)**: Depends on Foundational only
- **US2 (Sign In)**: Depends on Foundational only
- **US3 (Session)**: Depends on US2 (needs sign in to test)
- **US4 (Sign Out)**: Depends on US2 (needs sign in to test)
- **US5 (Protected Routes)**: Depends on US2 (needs auth to test)
- **US6 (Backend JWT)**: Depends on Foundational only
- **US7 (Profile)**: Depends on US2 and US5
- **US8 (Google OAuth)**: Depends on Foundational only
- **US9 (GitHub OAuth)**: Depends on US8 (reuses SocialAuthButtons)

### Parallel Opportunities

- T001-T004 (Setup) can all run in parallel
- T012 can run in parallel with other foundational tasks
- T015, T019, T025, T039 (CSS files) can run in parallel with their component tasks
- T029-T032 (protect endpoints) can all run in parallel
- T045-T047 (tests) can all run in parallel

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T012)
3. Complete Phases 3-8: User Stories 1-6 (T013-T033)
4. **STOP and VALIDATE**: Test all P1 stories independently
5. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Registration) → Users can sign up
3. Add US2 (Sign In) → Users can sign in
4. Add US3+US4+US5 → Complete session management
5. Add US6 → Backend fully protected (MVP COMPLETE!)
6. Add US7 → Profile display
7. Add US8+US9 → Social OAuth

---

## Notes

- All environment variables must be set before running tasks
- Better Auth migrations create tables in the same database as the application
- OAuth providers require configuration in Google/GitHub developer consoles
- Verify tests fail before implementing (if writing tests first)
- Commit after each task or logical group
