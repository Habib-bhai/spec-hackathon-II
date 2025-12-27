/**
 * React Query Providers component
 *
 * Provides React Query context to all child components.
 * Must be a client component since it uses useContext internally.
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './client';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component for wrapping the app
 *
 * NOTE: Avoid useState when initializing query client if you don't
 *       have a suspense boundary between this and code that may
 *       suspend because React will throw away the client on initial
 *       render if it suspends and there is no boundary
 */
export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// Export QueryClient for server-side prefetching
export { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export { getQueryClient } from './client';
