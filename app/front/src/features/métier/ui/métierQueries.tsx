import { dépendances } from "@/configuration/dépendances/dépendances";
import { type Métier } from "@/features/métier/domain/métier.interface";
import { NonTrouvéError } from "@/services/errors/errors";
import { queryOptions } from "@tanstack/react-query";

export const récupérerMétierQueryOptions = (métierId: Métier["id"] | null) =>
  queryOptions({
    queryKey: ["métiers", métierId],
    queryFn: async () => {
      if (métierId === null) {
        return null;
      }

      const réponse = await dépendances.récupérerMétierUseCase.run(métierId);

      if (réponse instanceof NonTrouvéError) {
        return null;
      }

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse ?? null;
    },
  });

export const récupérerMétiersQueryOptions = (métierIds: Array<Métier["id"]>) =>
  queryOptions({
    queryKey: ["métiers", métierIds],
    queryFn: async () => {
      if (métierIds.length === 0) return [];

      const réponse = await dépendances.récupérerMétiersUseCase.run(métierIds);

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse;
    },
    enabled: true,
  });

export const rechercherMétiersQueryOptions = (recherche?: string) =>
  queryOptions({
    queryKey: ["métiers", "rechercher", recherche],
    queryFn: async () => {
      if (recherche === undefined) return [];

      const réponse = await dépendances.rechercherMétiersUseCase.run(recherche);

      if (réponse instanceof Error) {
        throw réponse;
      }

      return réponse;
    },
    enabled: false,
  });
