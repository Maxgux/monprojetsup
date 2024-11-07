import { type Formation } from "@/features/formation/domain/formation.interface";

export type FormationRepository = {
  récupérer: (formationId: Formation["id"]) => Promise<Formation | Error>;
  récupérerPlusieurs: (formationIds: Array<Formation["id"]>) => Promise<Formation[] | Error>;
  rechercher: (recherche: string) => Promise<Formation[] | Error>;
  suggérer: () => Promise<Formation[] | Error>;
};
