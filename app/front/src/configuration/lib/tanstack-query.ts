import { NonAutoriséErreurHttp, NonIdentifiéErreurHttp } from "@/services/erreurs/erreursHttp";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      throwOnError: true,
      retry: (nombreTentatives, erreur) => {
        if (erreur instanceof NonIdentifiéErreurHttp || erreur instanceof NonAutoriséErreurHttp) return false;

        // eslint-disable-next-line sonarjs/prefer-single-boolean-return
        if (nombreTentatives >= 2) return false;

        return true;
      },
      retryDelay: 500,
    },

    mutations: {
      throwOnError: true,
    },
  },
});
