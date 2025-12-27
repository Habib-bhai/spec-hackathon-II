# Quickstart: Full-Stack Authentication

**Feature**: 004-full-stack-auth
**Date**: 2025-12-27

This guide walks through setting up and testing the authentication system.

---

## Prerequisites

- Node.js 18+ (frontend)
- Python 3.11+ (backend)
- PostgreSQL database (Neon DB recommended)
- Google OAuth credentials (optional, for social auth)
- GitHub OAuth credentials (optional, for social auth)

---

## Step 1: Environment Setup

### Frontend (.env.local)

Create `frontend/.env.local`:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-random-secret-key
```

### Backend (.env)

Update `backend/.env`:

```bash
# Existing settings...

# Better Auth Integration
BETTER_AUTH_URL=http://localhost:3000
JWKS_CACHE_TTL=3600
```

---

## Step 2: Install Dependencies

### Frontend

```bash
cd frontend
npm install better-auth @better-fetch/fetch
```

### Backend

```bash
cd backend
uv add PyJWT cryptography
```

---

## Step 3: Database Migration

### Better Auth Tables

```bash
cd frontend
npx @better-auth/cli migrate
```

This creates:
- `user` table
- `session` table
- `account` table
- `verification` table

### Backend Tables

No migration needed - `users` table already exists from 003-backend-implementation.

---

## Step 4: Start Development Servers

### Terminal 1: Backend

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

---

## Step 5: Test Authentication Flows

### 5.1 Registration

1. Navigate to `http://localhost:3000/auth/sign-up`
2. Enter email and password (min 8 characters)
3. Click "Sign Up"
4. Verify redirect to `/dashboard`

**Expected Result**: Account created, session cookie set.

### 5.2 Sign In

1. Sign out if authenticated
2. Navigate to `http://localhost:3000/auth/sign-in`
3. Enter credentials
4. Click "Sign In"
5. Verify redirect to `/dashboard`

**Expected Result**: Session restored, user authenticated.

### 5.3 Sign Out

1. While authenticated, click "Sign Out"
2. Verify redirect to home page
3. Try accessing `/dashboard`

**Expected Result**: Redirected to sign-in page.

### 5.4 Protected Routes

1. Sign out
2. Navigate directly to `http://localhost:3000/dashboard`

**Expected Result**: Redirected to `/auth/sign-in`.

### 5.5 Backend API Authorization

```bash
# Get session token from browser (copy from Network tab)
TOKEN="your-jwt-token"

# Test authenticated endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/users/me

# Test without token (should return 401)
curl http://localhost:8000/api/v1/users/me
```

**Expected Result**:
- With token: User profile JSON
- Without token: 401 Unauthorized

### 5.6 Social OAuth (Optional)

1. Navigate to `/auth/sign-in`
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Complete OAuth consent
4. Verify redirect to `/dashboard`

**Expected Result**: OAuth account linked, user authenticated.

---

## Common Issues

### "Invalid token" Error

**Cause**: JWKS endpoint unreachable or misconfigured.

**Fix**:
1. Verify `BETTER_AUTH_URL` is correct in backend `.env`
2. Check frontend is running at expected URL
3. Verify JWKS is accessible: `curl http://localhost:3000/.well-known/jwks.json`

### "Token expired" Error

**Cause**: Session has expired (7+ days inactive).

**Fix**: Sign in again to get a new session.

### "Database connection failed" Error

**Cause**: Neon DB connection issue.

**Fix**:
1. Verify `DATABASE_URL` is correct
2. Check Neon dashboard for connection status
3. Ensure connection pooling is enabled for serverless

### OAuth Redirect Error

**Cause**: Incorrect OAuth callback URL configuration.

**Fix**:
1. Google: Add `http://localhost:3000/api/auth/callback/google` to authorized redirects
2. GitHub: Add `http://localhost:3000/api/auth/callback/github` to callback URLs

### Middleware Not Protecting Routes

**Cause**: Middleware matcher not configured correctly.

**Fix**: Verify `middleware.ts` has correct matcher patterns:
```typescript
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/:path*"]
};
```

---

## Verification Checklist

- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend API docs at `http://localhost:8000/docs`
- [ ] Registration creates account and signs in
- [ ] Sign in restores session
- [ ] Sign out clears session
- [ ] Protected routes redirect when unauthenticated
- [ ] Profile page shows user info at `/profile`
- [ ] Backend API rejects requests without valid JWT
- [ ] Backend auto-creates user on first authenticated request
- [ ] (Optional) Google OAuth works
- [ ] (Optional) GitHub OAuth works

---

## Next Steps

After completing this quickstart:

1. **Customize UI**: Style auth pages to match your brand
2. **Add Profile Page**: Display user info from session
3. **Implement Password Reset**: Add forgot password flow
4. **Enable Email Verification**: Require email confirmation
5. **Add 2FA**: Enable two-factor authentication

---

## Reference Commands

```bash
# Generate Better Auth schema (without applying)
npx @better-auth/cli generate

# Apply Better Auth migrations
npx @better-auth/cli migrate

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && uv run pytest

# Check backend type hints
cd backend && uv run mypy app/
```
