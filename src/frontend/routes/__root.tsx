import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { InternetIdentityProvider } from 'ic-use-internet-identity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Actors from '@/actor';

// Mimimize reloading of queries
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryOnMount: false,
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <Actors>
          <Outlet />
          <TanStackRouterDevtools />
        </Actors>
      </InternetIdentityProvider>
    </QueryClientProvider>
  ),
});
