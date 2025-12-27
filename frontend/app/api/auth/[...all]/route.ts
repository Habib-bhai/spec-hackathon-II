import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handler.
 *
 * This catch-all route handles all Better Auth endpoints:
 * - POST /api/auth/sign-up/email - Registration
 * - POST /api/auth/sign-in/email - Email/password login
 * - GET /api/auth/sign-in/social - Social OAuth initiation
 * - GET /api/auth/callback/:provider - OAuth callback
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - GET /.well-known/jwks.json - JWKS for JWT verification
 */
export const { GET, POST } = toNextJsHandler(auth);
