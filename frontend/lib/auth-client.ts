import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Better Auth client for client-side operations.
 *
 * This is used for:
 * - Client components
 * - React hooks (useSession, etc.)
 * - Sign in/out methods
 * - Getting JWT tokens for backend API calls
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

// Export commonly used hooks and methods
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

/**
 * Get JWT token for authenticated API requests to the backend.
 * Returns null if not authenticated or token retrieval fails.
 */
export async function getJwtToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token();
    if (error || !data) {
      return null;
    }
    return data.token;
  } catch {
    return null;
  }
}
