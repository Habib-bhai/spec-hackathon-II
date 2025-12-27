# Research: Full-Stack Authentication

**Feature**: 004-full-stack-auth
**Date**: 2025-12-27
**Sources**: Context7 MCP, Better Auth Skill, PyJWT Documentation

## Research Summary

This document consolidates research findings for implementing full-stack authentication using Better Auth (frontend) and JWT/JWKS verification (backend).

---

## 1. Better Auth Next.js Integration

### Decision: Use `getSessionCookie` for Middleware Protection

**Rationale**: Better Auth provides multiple middleware approaches. The `getSessionCookie` helper is the recommended lightweight approach for route protection that works across all Next.js versions.

**Alternatives Considered**:
- `getCookieCache` - More feature-rich but requires cookie caching setup
- HTTP fetch to `/api/auth/get-session` - Required for Edge Runtime (Next.js 13-15.1.x)
- Node.js runtime middleware - Only available in Next.js 15.2.0+

**Implementation Pattern**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Redirect authenticated users from auth pages
  if (sessionCookie && ["/auth/sign-in", "/auth/sign-up"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard routes
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"]
};
```

**Key Insight**: This is an "optimistic" check (cookie presence, not validation). Full validation happens server-side when session is accessed.

---

## 2. Better Auth Server Configuration

### Decision: Use `nextCookies` Plugin for Server Actions

**Rationale**: The `nextCookies` plugin automatically handles `Set-Cookie` headers from Better Auth responses within Next.js server actions.

**Implementation Pattern**:
```typescript
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [nextCookies()] // Must be last plugin
});
```

**Key Insight**: The `nextCookies()` plugin MUST be the last plugin in the array.

---

## 3. Server-Side Session Access

### Decision: Use `auth.api.getSession` with `headers()` from Next.js

**Rationale**: This is the official pattern for accessing sessions in server components and server actions.

**Implementation Pattern**:
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// In a server action or server component
const session = await auth.api.getSession({
  headers: await headers()
});
```

---

## 4. Backend JWT/JWKS Verification

### Decision: Use PyJWT with PyJWKClient for JWKS-based Verification

**Rationale**: PyJWT's `PyJWKClient` provides automatic JWKS fetching, caching, and key rotation handling.

**Alternatives Considered**:
- `python-jose` - Similar functionality but PyJWT has better documentation and simpler API
- Manual JWKS fetching - Too complex, no caching, error-prone

**Implementation Pattern**:
```python
import jwt
from jwt import PyJWKClient
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

# Initialize JWKS client with caching
jwks_client = PyJWKClient(
    uri=f"{BETTER_AUTH_URL}/.well-known/jwks.json",
    cache_keys=True,
    max_cached_keys=16,
    cache_jwk_set=True,
    lifespan=3600,  # 1 hour cache
    timeout=30
)

def verify_token(token: str) -> dict:
    """Verify JWT using JWKS."""
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_exp": True}
        )
        return decoded
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
```

**Key Insights**:
- Use `get_signing_key_from_jwt()` to automatically extract `kid` and fetch correct key
- Always specify `algorithms=["RS256"]` to prevent algorithm confusion attacks
- Cache JWKS with reasonable TTL (1 hour default) for performance
- Handle `ExpiredSignatureError` and `InvalidTokenError` separately for better error messages

---

## 5. Database Schema Management

### Decision: Let Better Auth Manage Its Own Tables, Sync Application User Table

**Rationale**: Better Auth has a well-defined schema. The application's `users` table should sync with Better Auth's `user` table via matching IDs.

**Better Auth Core Tables** (managed by Better Auth CLI):
```sql
-- user table (Better Auth managed)
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    emailVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- session table (Better Auth managed)
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

-- account table (Better Auth managed - for OAuth)
CREATE TABLE "account" (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    password TEXT,  -- For email/password auth
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- verification table (Better Auth managed)
CREATE TABLE "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Migration Strategy**:
1. Run `npx @better-auth/cli migrate` to create Better Auth tables
2. Backend auto-creates application `users` record on first authenticated request
3. User ID from JWT `sub` claim maps to both `user.id` and `users.id`

**Key Insight**: Better Auth uses TEXT for IDs, our backend uses UUID. Need to handle conversion.

---

## 6. User Auto-Provisioning Strategy

### Decision: Auto-Create Backend User on First Authenticated Request

**Rationale**: Better Auth manages user registration. Backend needs to sync user data for foreign key relationships.

**Implementation Pattern**:
```python
async def get_or_create_user(session: AsyncSession, jwt_claims: dict) -> User:
    """Get existing user or create from JWT claims."""
    user_id = UUID(jwt_claims["sub"])

    # Try to find existing user
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        # Auto-create from JWT claims
        user = User(
            id=user_id,
            email=jwt_claims["email"],
            display_name=jwt_claims.get("name") or jwt_claims["email"].split("@")[0],
            created_at=datetime.utcnow()
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        logger.info(f"Auto-provisioned user: {user_id}")

    return user
```

---

## 7. API Route Handler Pattern

### Decision: Create Better Auth Catch-All Route Handler

**Rationale**: Better Auth requires a single API route to handle all auth endpoints.

**Implementation Pattern**:
```typescript
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

This creates endpoints:
- `POST /api/auth/sign-up` - Registration
- `POST /api/auth/sign-in/email` - Email/password login
- `GET /api/auth/sign-in/social` - Social OAuth initiation
- `GET /api/auth/callback/:provider` - OAuth callback
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

---

## 8. Client-Side Auth Hooks

### Decision: Use `authClient` with Type Inference

**Rationale**: Better Auth provides type-safe client hooks that infer types from server configuration.

**Implementation Pattern**:
```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Usage in components
const { data: session, isPending } = authClient.useSession();

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});

// Sign out
await authClient.signOut();

// Social sign in
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard",
});
```

---

## 9. Cookie Security Configuration

### Decision: Use Secure, HttpOnly, SameSite=Lax Cookies

**Rationale**: These settings provide defense-in-depth against XSS and CSRF attacks.

**Configuration** (Better Auth defaults, can be customized):
- `httpOnly: true` - Prevents JavaScript access
- `secure: true` - HTTPS only in production
- `sameSite: "lax"` - Prevents CSRF while allowing top-level navigation

---

## 10. Error Handling Patterns

### Decision: Consistent Error Response Format

**Frontend Error Handling**:
```typescript
const { data, error } = await authClient.signIn.email({
  email,
  password,
});

if (error) {
  // error.message contains user-friendly message
  // error.code contains machine-readable error code
  setError(error.message);
}
```

**Backend Error Handling**:
```python
from fastapi import HTTPException

class AuthenticationError(HTTPException):
    def __init__(self, detail: str = "Authentication required"):
        super().__init__(status_code=401, detail=detail)

class TokenExpiredError(AuthenticationError):
    def __init__(self):
        super().__init__(detail="Token expired")

class InvalidTokenError(AuthenticationError):
    def __init__(self):
        super().__init__(detail="Invalid token")
```

---

## Unresolved Questions

All technical questions have been resolved through Context7 research. Implementation can proceed.

---

## Dependencies Confirmed

| Dependency | Version | Purpose |
|------------|---------|---------|
| better-auth | latest | Frontend auth framework |
| @better-fetch/fetch | latest | HTTP client for Better Auth |
| PyJWT | >=2.0 | Backend JWT verification |
| cryptography | latest | RSA key handling for PyJWT |

---

## References

1. Better Auth Documentation: https://www.better-auth.com/docs
2. Better Auth Next.js Integration: https://www.better-auth.com/docs/integrations/next
3. PyJWT JWKS Client: https://pyjwt.readthedocs.io/en/stable/usage.html
4. Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
