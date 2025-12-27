/**
 * Custom React Query hooks for authentication
 */

import { useQuery } from '@tanstack/react-query';
import { useSignUp, useSignIn, useSignOut } from '../api/auth';
import type { User } from '../types';

/**
 * Hook for authentication state and operations
 */
export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();
  const signOutMutation = useSignOut();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signOut: signOutMutation.mutate,
    isSigningOut: signOutMutation.isPending,
  };
}
