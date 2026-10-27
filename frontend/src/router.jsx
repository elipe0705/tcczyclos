import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
export const getRouter = () => {
  // Erros 4xx (ex.: 403, 404) não melhoram tentando de novo; os demais tentam mais uma vez
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (count, error) => !(error?.status >= 400 && error?.status < 500) && count < 1,
      },
    },
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  return router;
};
