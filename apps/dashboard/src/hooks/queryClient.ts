import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient;
export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 10000,
          refetchInterval: 10000,
        },
      },
    });
  }
  return queryClient;
}
