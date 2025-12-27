/**
 * Authentication API client functions
 *
 * Uses Context7 MCP patterns for useQuery and useMutation.
 * Provides React Query-based API operations for authentication.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SignInInput, SignUpInput, User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Sign up with email and password
 */
async function signUp(input: SignUpInput): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: input.email, password: input.password }),
  });

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }

  return response.json();
}

/**
 * Sign in with email and password
 */
async function signIn(input: SignInInput): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to sign in');
  }

  return response.json();
}

/**
 * Sign out
 */
async function signOut(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to sign out');
  }
}

/**
 * Get current authenticated user
 */
async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}

/**
 * Hook for fetching current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for sign up
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (session) => {
      queryClient.setQueryData(['currentUser'], session.user);
      queryClient.setQueryData(['authSession'], session.token);
    },
  });
}

/**
 * Hook for sign in
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (session) => {
      queryClient.setQueryData(['currentUser'], session.user);
      queryClient.setQueryData(['authSession'], session.token);
    },
  });
}

/**
 * Hook for sign out
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.setQueryData(['authSession'], null);
      queryClient.invalidateQueries();
    },
  });
}
