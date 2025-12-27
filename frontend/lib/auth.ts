import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";

/**
 * Better Auth server configuration.
 *
 * This is used for server-side operations like:
 * - API route handlers
 * - Server actions
 * - Server components
 */
export const auth = betterAuth({
  // Database connection (Neon PostgreSQL)
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP: skip email verification
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache for 5 minutes
    },
  },

  // Social OAuth providers (configured via environment variables)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },

  // Plugins - nextCookies MUST be last
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        },
      },
    }),
    nextCookies(),
  ],
});

// Export type for session
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
