import { type UseDomainesFormArgs } from "./DomainesForm.interface";
import { domainesValidationSchema } from "./DomainesForm.validation";
import { actionsToastStore } from "@/components/Toast/useToastStore/useToastStore";
import { i18n } from "@/configuration/i18n/i18n";
import useÉlèveForm from "@/features/élève/ui/hooks/useÉlèveForm/useÉlèveForm";
import { référentielDonnéesQueryOptions } from "@/features/référentielDonnées/ui/référentielDonnéesQueries";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";

export default function useDomainesForm({ àLaSoumissionDuFormulaireAvecSuccès }: UseDomainesFormArgs) {
  const { data: référentielDonnées } = useQuery(référentielDonnéesQueryOptions);
  const { déclencherToast } = actionsToastStore();

  const légendeId = useId();

  const { setValue, mettreÀJourÉlève, getValues, erreurs } = useÉlèveForm({
    schémaValidation: domainesValidationSchema,
    àLaSoumissionDuFormulaireAvecSuccès,
  });

  const filtresGroupésParCatégories =
    référentielDonnées?.domainesProfessionnels.map((catégorie) => ({
      nom: catégorie.nom,
      emoji: catégorie.emoji,
      afficherDétail: catégorie.sousCatégoriesdomainesProfessionnels.some(
        (sousCatégorie) => sousCatégorie.description !== null,
      ),
      filtres: catégorie.sousCatégoriesdomainesProfessionnels,
    })) ?? [];

  const auChangementFiltresSélectionnés = (filtreIdsSélectionnés: string[]) =>
    setValue("domaines", filtreIdsSélectionnés);

  if (erreurs.domaines?.message) {
    déclencherToast(i18n.COMMUN.ERREURS_FORMULAIRES.TITRE_GÉNÉRIQUE, erreurs.domaines.message, "error");
  }

  return {
    mettreÀJourÉlève,
    filtresGroupésParCatégories,
    filtreIdsSélectionnésParDéfaut: getValues("domaines") ?? [],
    auChangementFiltresSélectionnés,
    légendeId,
  };
}
