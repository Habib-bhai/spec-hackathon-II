/**
 * Frontend authentication tests (T047)
 *
 * Tests for SignInForm, SignUpForm, and sign out functionality.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

// Mock auth client
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: mockSignIn,
      social: vi.fn(),
    },
    signUp: {
      email: mockSignUp,
    },
    signOut: mockSignOut,
  },
  useSession: () => mockUseSession(),
}));

// Import components after mocks
import { SignInForm } from "@/features/auth/SignInForm/SignInForm";
import { SignUpForm } from "@/features/auth/SignUpForm/SignUpForm";
import { UserMenu } from "@/features/auth/UserMenu/UserMenu";

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("validates email format", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("submits form with valid credentials", async () => {
    mockSignIn.mockResolvedValue({ data: { user: { id: "123" } } });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("displays error message on sign in failure", async () => {
    mockSignIn.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });
});

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all required inputs", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("validates password minimum length", async () => {
    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);

    fireEvent.change(passwordInput, { target: { value: "short" } });

    // Password should require minimum 8 characters
    expect(passwordInput).toHaveAttribute("minLength", "8");
  });

  it("validates password confirmation matches", async () => {
    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "differentpassword" } });
    fireEvent.click(submitButton);

    // Should show password mismatch error
    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    mockSignUp.mockResolvedValue({ data: { user: { id: "123" } } });

    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "new@example.com",
          password: "password123",
        })
      );
    });
  });
});

describe("UserMenu - Sign Out", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
        },
      },
      isPending: false,
    });
  });

  it("renders user info when authenticated", () => {
    render(<UserMenu />);

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it("does not render when not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    });

    const { container } = render(<UserMenu />);

    expect(container.firstChild).toBeNull();
  });

  it("shows dropdown menu when clicked", async () => {
    render(<UserMenu />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    });
  });

  it("calls signOut when sign out button is clicked", async () => {
    mockSignOut.mockResolvedValue({});

    render(<UserMenu />);

    // Open dropdown
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    // Click sign out
    const signOutButton = await screen.findByText(/sign out/i);
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
