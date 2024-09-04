import { type CarteFormationProps } from "./CarteFormation.interface";
import Tag from "@/components/_dsfr/Tag/Tag";
import LienInterne from "@/components/Lien/LienInterne/LienInterne";
import Titre from "@/components/Titre/Titre";
import { i18n } from "@/configuration/i18n/i18n";
import { queryClient } from "@/configuration/lib/tanstack-query";
import { élèveQueryOptions } from "@/features/élève/ui/élèveQueries";
import { useEffect, useRef } from "react";

const CarteFormation = ({
  id,
  nom,
  métiersAccessibles,
  affinité,
  communes,
  sélectionnée = false,
}: CarteFormationProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const élève = queryClient.getQueryData(élèveQueryOptions.queryKey);

  const NOMBRE_MÉTIERS_À_AFFICHER = 3;

  const classEnFonctionDeLaSélection = () => {
    if (sélectionnée) return "border-[--border-active-blue-france]";
    return "border-transparent";
  };

  const estUneFormationFavorite = () => {
    if (élève?.formationsFavorites)
      return élève.formationsFavorites.some((formationFavorite) => formationFavorite.id === id);
    return false;
  };

  useEffect(() => {
    if (ref.current && sélectionnée) {
      ref.current.scrollIntoView({ block: "center" });
      window.scrollTo({ top: 0 });
    }
  }, [sélectionnée]);

  return (
    <div
      className={`fr-enlarge-link grid max-w-[550px] gap-4 border-2 border-solid bg-[--background-default-grey] p-6 shadow-md ${classEnFonctionDeLaSélection()}`}
      ref={ref}
    >
      <div className="grid grid-flow-col justify-between gap-1">
        <div className="*:mb-0">
          <LienInterne<"/formations/$formationId">
            ariaLabel={nom}
            href="/formations/$formationId"
            paramètresPath={{ formationId: id }}
            variante="neutre"
          >
            <Titre
              niveauDeTitre="h2"
              styleDeTitre="h4"
            >
              {nom}
            </Titre>
          </LienInterne>
        </div>
        {estUneFormationFavorite() && (
          <div>
            <span
              aria-hidden="true"
              className="fr-icon-heart-fill fr-icon--sm rounded bg-[--background-contrast-error] px-1 text-[--text-default-error]"
            />
            <span className="sr-only">{i18n.ACCESSIBILITÉ.FAVORIS}</span>
          </div>
        )}
      </div>
      {affinité && affinité > 0 ? (
        <div className="grid grid-flow-col justify-start gap-2">
          <span
            aria-hidden="true"
            className="fr-icon-checkbox-fill fr-icon--sm text-[--background-flat-success]"
          />
          <p className="fr-text--sm mb-0 text-[--text-label-green-emeraude]">
            {affinité} {i18n.CARTE_FORMATION.POINTS_AFFINITÉ}
          </p>
        </div>
      ) : null}
      {communes.length > 0 && (
        <div className="grid grid-flow-col justify-start gap-2">
          <span
            aria-hidden="true"
            className="fr-icon-map-pin-2-fill fr-icon--sm"
          />
          <p className="fr-text--sm mb-0">
            {i18n.CARTE_FORMATION.FORMATION_DISPONIBLES}{" "}
            <strong>
              {communes.length} {i18n.CARTE_FORMATION.FORMATION_DISPONIBLES_SUITE}
            </strong>
          </p>
        </div>
      )}
      {métiersAccessibles.length > 0 && (
        <div className="grid gap-3">
          <p className="fr-text--sm mb-0 text-[--text-label-grey]">{i18n.CARTE_FORMATION.MÉTIERS_ACCESSIBLES}</p>
          <ul className="m-0 flex list-none flex-wrap justify-start gap-2 p-0">
            {métiersAccessibles.slice(0, NOMBRE_MÉTIERS_À_AFFICHER).map((métier) => (
              <li key={métier.id}>
                <Tag
                  libellé={métier.nom}
                  taille="petit"
                />
              </li>
            ))}
            {métiersAccessibles.length > NOMBRE_MÉTIERS_À_AFFICHER && (
              <li>
                <Tag
                  libellé={`+${(métiersAccessibles.length - NOMBRE_MÉTIERS_À_AFFICHER).toString()}`}
                  taille="petit"
                />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CarteFormation;
