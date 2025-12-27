/**
 * Authentication Type Definitions
 *
 * Shared types for frontend-backend type consistency.
 * These types align with Better Auth session types and backend Pydantic models.
 */

// ============================================================================
// User Types
// ============================================================================

/**
 * User profile as returned by the backend API
 */
export interface User {
  id: string; // UUID
  email: string;
  display_name: string;
  created_at: string; // ISO 8601 datetime
}

/**
 * Better Auth user from session
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Session Types
// ============================================================================

/**
 * Better Auth session object
 */
export interface Session {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Session state for UI components
 */
export interface SessionState {
  data: Session | null;
  isPending: boolean;
  error: Error | null;
}

// ============================================================================
// Authentication Request/Response Types
// ============================================================================

/**
 * Email/password sign up request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Email/password sign in request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Social sign in request
 */
export interface SocialSignInRequest {
  provider: "google" | "github";
  callbackURL?: string;
}

/**
 * Authentication response (success)
 */
export interface AuthResponse {
  user: AuthUser;
  session: Session["session"];
}

/**
 * Authentication error response
 */
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

// ============================================================================
// JWT Types
// ============================================================================

/**
 * JWT claims from Better Auth token
 */
export interface JWTClaims {
  sub: string; // User ID (UUID)
  email: string;
  name?: string;
  iat: number; // Issued at (Unix timestamp)
  exp: number; // Expiration (Unix timestamp)
  iss: string; // Issuer (Better Auth URL)
}

// ============================================================================
// API Error Types
// ============================================================================

/**
 * Backend API error response
 */
export interface APIError {
  detail: string;
  code?: string;
}

/**
 * Validation error response (422)
 */
export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

// ============================================================================
// Auth State Types (for React Context)
// ============================================================================

/**
 * Authentication context state
 */
export interface AuthContextState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Authentication context actions
 */
export interface AuthContextActions {
  signIn: (request: SignInRequest) => Promise<void>;
  signUp: (request: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: "google" | "github") => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Complete auth context type
 */
export type AuthContext = AuthContextState & AuthContextActions;

// ============================================================================
// Route Protection Types
// ============================================================================

/**
 * Protected route configuration
 */
export interface ProtectedRouteConfig {
  /** Routes that require authentication */
  protected: string[];
  /** Routes that redirect to dashboard if authenticated */
  authOnly: string[];
  /** Routes accessible to everyone */
  public: string[];
}

/**
 * Default route configuration
 */
export const defaultRouteConfig: ProtectedRouteConfig = {
  protected: ["/dashboard", "/profile", "/settings"],
  authOnly: ["/auth/sign-in", "/auth/sign-up"],
  public: ["/", "/about"],
};

// ============================================================================
// Form Types
// ============================================================================

/**
 * Sign in form state
 */
export interface SignInFormState {
  email: string;
  password: string;
  error: string | null;
  isSubmitting: boolean;
}

/**
 * Sign up form state
 */
export interface SignUpFormState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  error: string | null;
  isSubmitting: boolean;
}

/**
 * Form validation result
 */
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as AuthError).message === "string"
  );
}

/**
 * Check if error is an APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof (error as APIError).detail === "string"
  );
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(session: Session | null): session is Session {
  return session !== null && session.user !== null;
}
