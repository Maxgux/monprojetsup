import BarreLatéraleFavoris from "./BarreLatéraleFavoris/BarreLatéraleFavoris";
import ContenuFavoris from "./ContenuFavoris/ContenuFavoris";
import Head from "@/components/_layout/Head/Head";
import ListeEtAperçuBarreLatérale from "@/components/_layout/ListeEtAperçuLayout/ListeEtAperçuBarreLatérale/ListeEtAperçuBarreLatérale";
import ListeEtAperçuContenu from "@/components/_layout/ListeEtAperçuLayout/ListeEtAperçuContenu/ListeEtAperçuContenu";
import ListeEtAperçuLayout from "@/components/_layout/ListeEtAperçuLayout/ListeEtAperçuLayout";
import { actionsListeEtAperçuStore } from "@/components/_layout/ListeEtAperçuLayout/useListeEtAperçuStore/useListeEtAperçuStore";
import AnimationChargement from "@/components/AnimationChargement/AnimationChargement";
import { i18n } from "@/configuration/i18n/i18n";
import { récupérerFichesFormationsQueryOptions } from "@/features/formation/ui/formationQueries";
import useFormation from "@/features/formation/ui/useFormation";
import { récupérerMétiersQueryOptions } from "@/features/métier/ui/métierQueries";
import useMétier from "@/features/métier/ui/useMétier";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

const FavorisÉlèvePage = () => {
  const { changerÉlémentAffiché } = actionsListeEtAperçuStore();
  const { hash } = useLocation();
  const { estUnIdDeFormation } = useFormation();
  const { estUnIdDeMétier } = useMétier();
  const routeApi = getRouteApi("/_auth/favoris/");
  const élève = routeApi.useLoaderData();
  const { data: formations } = useQuery(récupérerFichesFormationsQueryOptions(élève?.formations ?? []));

  const { data: métiers } = useQuery(récupérerMétiersQueryOptions(élève?.métiersFavoris ?? []));

  useEffect(() => {
    if (hash === "" && formations && formations?.length > 0) {
      changerÉlémentAffiché({
        id: formations[0]?.id ?? null,
        type: "formation",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changerÉlémentAffiché, formations]);

  if (!formations || !métiers) {
    return <AnimationChargement />;
  }

  if (estUnIdDeMétier(hash)) {
    changerÉlémentAffiché({
      id: métiers.some((métier) => métier.id === hash) ? hash : (métiers[0]?.id ?? null),
      type: "métier",
    });
  } else if (estUnIdDeFormation(hash)) {
    changerÉlémentAffiché({
      id: formations.some((formation) => formation.id === hash) ? hash : (formations[0]?.id ?? null),
      type: "formation",
    });
  }

  return (
    <>
      <Head titre={i18n.PAGE_FAVORIS.TITRE_PAGE} />
      <ListeEtAperçuLayout variante="favoris">
        <ListeEtAperçuBarreLatérale nombreRésultats={0}>
          <BarreLatéraleFavoris
            formations={formations}
            métiers={métiers}
          />
        </ListeEtAperçuBarreLatérale>
        <ListeEtAperçuContenu>
          <ContenuFavoris />
        </ListeEtAperçuContenu>
      </ListeEtAperçuLayout>
    </>
  );
};

export default FavorisÉlèvePage;
