import { dépendances } from "@/configuration/dépendances/dépendances";
import { type Formation } from "@/features/formation/domain/formation.interface";
import { NonTrouvéError } from "@/services/errors/errors";
import { queryOptions } from "@tanstack/react-query";

export const récupérerFormationQueryOptions = (formationId: Formation["id"] | null) =>
  queryOptions({
    queryKey: ["formations", formationId],
    queryFn: async () => {
      if (formationId === null) {
        return null;
      }

      const réponse = await dépendances.récupérerFormationUseCase.run(formationId);

      if (réponse instanceof NonTrouvéError) {
        return null;
      }

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse ?? null;
    },
  });

export const récupérerFormationsQueryOptions = (formationIds: Array<Formation["id"]>) =>
  queryOptions({
    queryKey: ["formations", formationIds],
    queryFn: async () => {
      if (formationIds.length === 0) return [];

      const réponse = await dépendances.récupérerFormationsUseCase.run(formationIds);

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse;
    },
  });

export const rechercherFormationsQueryOptions = (recherche?: string) =>
  queryOptions({
    queryKey: ["formations", "rechercher", recherche],
    queryFn: async () => {
      if (recherche === undefined) return [];

      const réponse = await dépendances.rechercherFormationsUseCase.run(recherche);

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse;
    },
    enabled: false,
  });

export const suggérerFormationsQueryOptions = queryOptions({
  queryKey: ["formationsSuggestions"],
  queryFn: async () => {
    const réponse = await dépendances.suggérerFormationsUseCase.run();

    if (réponse instanceof Error) {
      throw réponse;
    }

    return réponse;
  },
});
