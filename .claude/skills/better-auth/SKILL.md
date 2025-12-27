---
name: better-auth
description: This skill should be used when designing, implementing, or refactoring authentication systems using Better Auth framework. It specializes in enterprise-grade authentication including email/password, social providers, 2FA, sessions, middleware, and database integration.
---

# Better Auth Master Skill

Senior-level expertise for building enterprise-grade authentication systems using Better Auth framework.

## Installation

```bash
# Node.js/TypeScript
npm install better-auth

# Initialize project
npx create-better-auth@latest
```

## Quick Start

### Email/Password Authentication
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
});
```

### Social Authentication (GitHub)
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

## Core Concepts

**Better Auth**: Framework-agnostic auth library for TypeScript
- Framework: Works with Next.js, Nuxt, SvelteKit, SolidStart, Hono, Astro
- Providers: Email/password, social (GitHub, GitLab, Google, etc.), username
- Plugins: 2FA, JWT, multi-tenancy, SSO
- Sessions: Cookie-based or database-backed persistent state
- Validation: Built-in schema validation with Zod/Yup

## Authentication Methods

### Email/Password
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  advanced: {
    cookiePassword: {
      min: 8,
      max: 128,
    },
  },
});
```

### Social Providers

```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    gitlab: {
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      issuer: "https://gitlab.com",
    },
  },
});
```

### Username (Plugin)
```typescript
// Add username support to email/password
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    username: {
      enabled: true,
    min: 3,
      max: 30,
    },
  },
});
```

## 2FA (Two-Factor Authentication)

### Enable 2FA
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  twoFactor: {
    enabled: true,
  },
});
```

### Database Schema
```sql
-- Users table extension
ALTER TABLE user ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT FALSE;

-- 2FA table
CREATE TABLE twoFactor (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  secret TEXT,
  backupCodes TEXT,
  FOREIGN KEY (userId) REFERENCES user(id)
);
```

### Server-Side Enable 2FA
```typescript
const data = await auth.api.enableTwoFactor({
  body: {
    password: "secure-password",
    issuer: "my-app-name",
  },
  headers: await headers(),
});
```

### Client-Side Disable 2FA
```typescript
const { data, error } = await authClient.twoFactor.disable({
  password,
  headers: await headers(),
});
```

## Sessions (Persistent State)

### Database Session (PostgreSQL)
```typescript
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
});
```

### Custom Session Provider
```typescript
class CustomSession {
  async create(userId: string, data: any) {
    // Custom storage logic
    await db.sessions.insert({ userId, data });
  }

  async get(sessionId: string) {
    return await db.sessions.findUnique({ id: sessionId });
  }
}

export const auth = betterAuth({
  session: {
    adapter: CustomSession(),
  },
});
```

### Session Middleware (Next.js)
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});

// Middleware (server-side)
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
```

## Middleware (Request Validation)

### Next.js Middleware with Session Check
```typescript
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // THIS IS NOT SECURE! Optimize instead
  // Use this for route-level checks
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
```

### Hono Middleware with Session
```typescript
import { Hono } from "hono";
import { auth } from "./auth";
import { serve } from "@hono/node-server";

const app = new Hono<{ Variables: {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
}>();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return await next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return await next();
});

serve(app);
```

### Auth Guard (Nitro)
```typescript
import { EventHandler, H3Event } from "h3";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth: EventHandler = async (event: H3Event) => {
  const headers = event.headers;
  const session = await auth.api.getSession({ headers });
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  event.context.auth = session;
};
```

## Shadcn/UI Integration (Next.js)

### Sign In Page
```tsx
"use client";

import { SignIn } from "better-auth/ui";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn client={authClient} />
    </div>
  );
}
```

### Sign Up Page
```tsx
"use client";

import { SignUp } from "better-auth/ui";

export default function SignUpPage() {
  return <SignUp />;
}
```

## Best Practices

### Design Principles
1. **Framework Agnostic**: Design for multiple frameworks
2. **Type Safety**: Use Zod/Yup for schema validation
3. **Secure Defaults**: Require 2FA for sensitive operations
4. **Session Management**: Use database sessions in production
5. **Cookie Security**: HttpOnly, Secure, SameSite settings
6. **Token Storage**: Never log secrets or tokens

### Security Checklist
- [ ] Environment variables for all secrets
- [ ] HttpOnly cookies for session
- [ ] Secure flag set for production
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting on auth endpoints
- [ ] Input validation (Zod/Yup)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Password hashing (bcrypt/Argon2)
- [ ] 2FA enabled for admin accounts

### Performance Checklist
- [ ] Database connection pooling
- [ ] Session caching enabled
- [ ] Optimistic redirects for unauthenticated users
- [ ] Lazy session loading
- [ ] Minimal database queries
- [ ] Indexed queries for foreign keys

## Production Deployment

### Docker Configuration
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV DATABASE_URL=postgresql://user:pass@db:5432/db
ENV GITHUB_CLIENT_ID=...
CMD ["node", "server.js"]
```

### Environment Setup
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  advanced: {
    trustedOrigins: process.env.TRUSTED_ORIGINS?.split(","),
  },
});
```

### Health Check Endpoint
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ...config
});

@tool
async def health_check() -> dict {
  return {
    "status": "healthy",
    "twoFactorEnabled": true,
    "activeSessions": 10,
  }
}
```

## Advanced Patterns

### Multi-Tenant Authentication
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});
```

### Custom Plugin Development
```typescript
import { BetterAuthPlugin } from "better-auth";

const myPlugin: BetterAuthPlugin = {
  id: "my-plugin",
  endpoints: {
    getHelloWorld: createAuthEndpoint("/my-plugin/hello-world", {
      method: "GET",
      use: [sessionMiddleware],
      async (ctx) => {
        const session = ctx.context.session;
        return ctx.json({
          message: "Hello World",
        });
      },
    }),
  },
  hooks: {
    before: [
      async (ctx) => {
        const header = ctx.request.headers.get("x-my-header");
        if (header === "my-value") {
          return ctx.next();
        }
        return true;
      },
    ],
  },
} satisfies BetterAuthPlugin;
```

### JWT Integration
```typescript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // ...config
});

// Get JWT from response
const { data, error } = await authClient.getSession({
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwt = ctx.response.headers.get("set-auth-jwt");
      // Use JWT for authenticated requests to external services
    },
  },
});
```

---

**Goal**: Build enterprise-grade authentication systems with Better Auth framework supporting email/password, social providers, 2FA, database sessions, and framework-agnostic middleware.
