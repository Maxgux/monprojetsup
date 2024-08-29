import { dépendances } from "@/configuration/dépendances/dépendances";
import { type Formation } from "@/features/formation/domain/formation.interface";
import { queryOptions } from "@tanstack/react-query";

export const récupérerFormationQueryOptions = (formationId: Formation["id"]) =>
  queryOptions({
    queryKey: ["formation", formationId],
    queryFn: async () => {
      return (await dépendances.récupérerFormationUseCase.run(formationId)) ?? null;
    },
  });

export const récupérerFormationsQueryOptions = (formationIds: Array<Formation["id"]>) =>
  queryOptions({
    queryKey: ["formations", formationIds],
    queryFn: async () => {
      if (formationIds.length === 0) return [];

      const formations = await dépendances.récupérerFormationsUseCase.run(formationIds);

      return formations ?? [];
    },
    enabled: true,
  });

export const rechercherFormationsQueryOptions = (recherche?: string) =>
  queryOptions({
    queryKey: ["formations", "rechercher", recherche],
    queryFn: async () => {
      if (recherche === undefined) return [];

      const formations = await dépendances.rechercherFormationsUseCase.run(recherche);

      return formations ?? [];
    },
    enabled: false,
  });
