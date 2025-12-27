---
id: 004
title: Create Better Auth master skill
stage: general
date: 2024-12-23
surface: agent
model: claude-sonnet-4.5-20250929
feature: none
branch: master
user: Habib
command: now fetch better auth docs using context7, and create a senior software level skill for better auth, so, even implementing enterprise grade authentication becomes piece of cake for my agent.
labels: ["better-auth","authentication","2FA","sessions","middleware","shadcn"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/better-auth/SKILL.md
tests: []

---

## Prompt

now fetch better auth docs using context7, and create a senior software level skill for better auth, so, even implementing enterprise grade authentication becomes piece of cake for my agent.

## Response snapshot

Created comprehensive Better Auth master skill at `.claude/skills/better-auth/SKILL.md` with:

**Skill Metadata:**
- name: better-auth
- description: This skill should be used when designing, implementing, or refactoring authentication systems using Better Auth framework. It specializes in enterprise-grade authentication including email/password, social providers, 2FA, sessions, middleware, and database integration.

**Key Sections:**

1. Installation & Quick Start
   - npm install, npx create-better-auth
   - Email/password authentication setup
   - Social provider configuration (GitHub, Google, GitLab)

2. Core Concepts
   - Framework-agnostic (Next.js, Nuxt, SvelteKit, Hono, Astro)
   - Providers: email/password, social, username
   - Plugins: 2FA, JWT, multi-tenancy, SSO
   - Sessions: cookie-based or database-backed
   - Tracing: built-in observability

3. Authentication Methods
   - Email/password with advanced options (password rules, cookie-based)
   - Social providers (GitHub, Google, Facebook, Atlassian)
   - Username plugin support
   - Comprehensive provider examples

4. 2FA (Two-Factor Authentication)
   - Enable 2FA configuration
   - Database schema for 2FA (users + twoFactor tables)
   - Server-side and client-side 2FA flows
   - Disable 2FA with password verification

5. Sessions (Persistent State)
   - Database session with PostgreSQL
   - Custom session provider
   - Cookie cache for performance
   - Session validation middleware

6. Middleware (Request Validation)
   - Next.js 15.2.0+ middleware with session validation
   - Hono middleware with session context
   - Astro middleware with request handling
   - Auth guard for Nitro (401 error)
   - JWT extraction from session headers

7. Shadcn/UI Integration
   - Sign In page component
   - Sign Up page component
   - Seamless integration with better-auth

8. Best Practices
   - Design principles: framework agnostic, type safety, secure defaults
   - Security: environment variables, HttpOnly cookies, CSRF, rate limiting
   - Performance: connection pooling, session caching, lazy loading

9. Production Deployment
   - Docker deployment
   - Environment configuration
   - Health check endpoint

10. Advanced Patterns
   - Multi-tenant authentication
   - Custom plugin development with hooks
   - JWT integration from session headers
   - Custom session provider implementation

**Code Examples Provided:**
- Email/password, social provider setup (Python/TypeScript)
- 2FA enable/disable (both server and client)
- Database sessions (PostgreSQL, custom provider)
- Middleware patterns (Next.js, Hono, Astro, Nitro)
- Session validation and guard
- Shadcn/UI components (SignIn, SignUp)
- Plugin development with endpoints and hooks
- JWT extraction from response
- Health check tool

**Key Patterns Documented:**
- Email/password with advanced options (min/max password length, cookie passwords)
- Social authentication with OAuth (GitHub, Google, GitLab, Facebook, Atlassian)
- 2FA with encrypted secrets and backup codes
- Database-backed sessions with connection pooling
- Cookie-based session caching for performance
- Framework-agnostic middleware (Next.js, Hono, Astro, Nitro)
- JWT-based service-to-service authentication
- Custom plugin system with hooks and before/after handlers
- Multi-tenant account linking with trusted providers
- Shadcn/UI integration for frontend components

## Outcome

- Impact: High - New skill transforms agent into Better Auth master capable of building enterprise-grade, production-ready authentication systems
- Tests: N/A (skill creation)
- Files: Created .claude/skills/better-auth/SKILL.md
- Next prompts: None
- Reflection: Successfully created comprehensive Better Auth master skill covering email/password, social providers, 2FA, sessions, middleware, plugins, and production deployment. Skill provides enterprise-grade authentication guidance with framework-agnostic examples.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill by using it to build an actual authentication system with 2FA
