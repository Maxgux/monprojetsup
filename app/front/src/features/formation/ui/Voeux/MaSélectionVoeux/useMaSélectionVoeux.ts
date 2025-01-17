import { élémentAffichéListeEtAperçuStore } from "@/components/_layout/ListeEtAperçuLayout/useListeEtAperçuStore/useListeEtAperçuStore";
import useÉlève from "@/features/élève/ui/hooks/useÉlève/useÉlève";
import { récupérerFicheFormationQueryOptions } from "@/features/formation/ui/formationQueries";
import useVoeu from "@/features/formation/ui/Voeux/useVoeu";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useMaSélectionVoeux() {
  const { élève } = useÉlève();
  const { voeuVersFavori } = useVoeu();
  const formationAffichée = élémentAffichéListeEtAperçuStore();
  const { data: formation } = useQuery(récupérerFicheFormationQueryOptions(formationAffichée.id));

  const favoris = useMemo(() => {
    const voeuxFavorisPourLaFormation =
      élève?.voeuxFavoris
        ?.map((voeu) => formation?.voeux.find(({ id }) => voeu.id === id))
        .filter((voeu) => voeu !== undefined) ?? [];

    return voeuxFavorisPourLaFormation.map(voeuVersFavori);
  }, [élève?.voeuxFavoris]);

  return {
    favoris,
  };
}
