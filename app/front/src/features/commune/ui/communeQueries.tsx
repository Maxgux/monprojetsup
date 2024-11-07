import { dépendances } from "@/configuration/dépendances/dépendances";
import { queryOptions } from "@tanstack/react-query";

export const rechercheCommunesQueryOptions = (recherche?: string) =>
  queryOptions({
    queryKey: ["communes", "recherche"],
    queryFn: async () => {
      if (recherche === undefined) return [];

      const réponse = await dépendances.rechercherCommunesUseCase.run(recherche);

      if (réponse instanceof Error) return [];

      return réponse ?? [];
    },
    enabled: false,
  });
