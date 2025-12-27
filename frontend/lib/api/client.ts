/**
 * React Query client configuration utilities
 *
 * Uses Context7 MCP patterns for Next.js integration with SSR support.
 * Ensures proper query client handling for server and client-side rendering.
 */

import { isServer, QueryClient } from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance with default options
 *
 * Configures staleTime to prevent immediate refetching on client hydration
 * which is essential for SSR compatibility.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we set some default staleTime above 0
        // to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 60 seconds
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Browser query client - reused across renders to maintain cache
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets the appropriate QueryClient instance
 *
 * Returns a new client for each server request to prevent data leakage
 * and reuses a single client in the browser to maintain cache.
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important to prevent creating a new client if React
    // suspends during initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
