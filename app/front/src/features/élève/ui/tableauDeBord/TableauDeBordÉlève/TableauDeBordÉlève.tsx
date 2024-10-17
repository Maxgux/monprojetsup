import useTableauDeBordÉlève from "./useTableauDeBordÉlève";
import Head from "@/components/_layout/Head/Head";
import LienExterne from "@/components/Lien/LienExterne/LienExterne";
import Titre from "@/components/Titre/Titre";
import { constantes } from "@/configuration/constantes";
import { environnement } from "@/configuration/environnement";
import { i18n } from "@/configuration/i18n/i18n";
import CarteAvisÉlève from "@/features/élève/ui/tableauDeBord/CarteAvisÉlève/CarteAvisÉlève";
import CarteParcourSupÉlève from "@/features/élève/ui/tableauDeBord/CarteParcourSupÉlève/CarteParcourSupÉlève";
import CartePrimaireTableauDeBordÉlève from "@/features/élève/ui/tableauDeBord/CartePrimaireTableauDeBordÉlève/CartePrimaireTableauDeBordÉlève";
import CarteTémoignageÉlève from "@/features/élève/ui/tableauDeBord/CarteTémoignageÉlève/CarteTémoignageÉlève";
import { Fragment } from "react/jsx-runtime";

const TableauDeBordÉlève = () => {
  const { cartes } = useTableauDeBordÉlève();

  return (
    <>
      <Head titre={i18n.PAGE_TABLEAU_DE_BORD.TITRE_PAGE} />
      <div className="h-full bg-[--background-alt-beige-gris-galet] bg-right-top bg-no-repeat lg:bg-[url('/images-de-fond/tableau-de-bord.svg')]">
        <div className="fr-container pb-20 pt-12">
          <div className="*:mb-2 *:font-normal *:text-[--text-mention-grey]">
            <Titre
              niveauDeTitre="h1"
              styleDeTitre="text--sm"
            >
              {i18n.ÉLÈVE.TABLEAU_DE_BORD.TITRE}
            </Titre>
          </div>
          <p className="fr-h1 mb-10">{i18n.ÉLÈVE.TABLEAU_DE_BORD.MESSAGE_BIENVENUE}</p>
          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
            {cartes.map((carte, index) => (
              <Fragment key={carte.lien}>
                <li>
                  <CartePrimaireTableauDeBordÉlève
                    illustration={carte.illustration}
                    lien={carte.lien}
                    sousTitre={carte.sousTitre}
                    titre={carte.titre}
                  />
                </li>
                {index === 1 && (
                  <li>
                    <CarteTémoignageÉlève
                      auteur={i18n.ÉLÈVE.TABLEAU_DE_BORD.TÉMOIGNAGE.AUTEUR}
                      rôle={i18n.ÉLÈVE.TABLEAU_DE_BORD.TÉMOIGNAGE.RÔLE}
                    >
                      {i18n.ÉLÈVE.TABLEAU_DE_BORD.TÉMOIGNAGE.PHRASE}{" "}
                      <LienExterne
                        ariaLabel={i18n.ÉLÈVE.TABLEAU_DE_BORD.TÉMOIGNAGE.PHRASE_SUITE}
                        href={constantes.LIENS.SIX_NIVEAUX_MPS}
                      >
                        {i18n.ÉLÈVE.TABLEAU_DE_BORD.TÉMOIGNAGE.PHRASE_SUITE}
                      </LienExterne>
                    </CarteTémoignageÉlève>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
          <hr className="mb-4 mt-10" />
          <ul
            className={`grid list-none grid-cols-1 gap-6 p-0 ${environnement.VITE_PARCOURSUP_OAUTH2_URL ? "md:grid-cols-2" : ""} `}
          >
            {environnement.VITE_PARCOURSUP_OAUTH2_URL && (
              <li>
                <CarteParcourSupÉlève />
              </li>
            )}
            <li>
              <CarteAvisÉlève />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TableauDeBordÉlève;
