import ModaleParcourSup from "./ModaleParcourSup/ModaleParcourSup";
import parcourSupMPSSVG from "@/assets/parcoursup-mps.svg";
import Bouton from "@/components/Bouton/Bouton";
import LienExterne from "@/components/Lien/LienExterne/LienExterne";
import { constantes } from "@/configuration/constantes";
import { i18n } from "@/configuration/i18n/i18n";
import useÉlève from "@/features/élève/ui/hooks/useÉlève/useÉlève";
import CarteSecondaireTableauDeBordÉlève from "@/features/élève/ui/TableauDeBordÉlèvePage/CarteSecondaireTableauDeBordÉlève/CarteSecondaireTableauDeBordÉlève";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useMemo } from "react";

const CarteParcourSupÉlève = () => {
  const { élèveAAssociéSonCompteParcoursup } = useÉlève();

  const modaleParcourSup = useMemo(
    () =>
      createModal({
        id: "modale-parcoursup",
        isOpenedByDefault: false,
      }),
    [],
  );

  return (
    <>
      <CarteSecondaireTableauDeBordÉlève
        altIllustration={i18n.ÉLÈVE.TABLEAU_DE_BORD.CARTES.PARCOURSUP.ALT_ILLUSTRATION}
        illustration={parcourSupMPSSVG}
        sousTitre={i18n.ÉLÈVE.TABLEAU_DE_BORD.CARTES.PARCOURSUP.SOUS_TITRE}
        titre={i18n.ÉLÈVE.TABLEAU_DE_BORD.CARTES.PARCOURSUP.TITRE}
      >
        {élèveAAssociéSonCompteParcoursup ? (
          <p className="mb-0 whitespace-pre-line">
            {i18n.ÉLÈVE.TABLEAU_DE_BORD.CARTES.PARCOURSUP.SI_SYNCHRO.SOUS_TITRE}{" "}
            <LienExterne
              ariaLabel={constantes.CONTACT.EMAIL}
              href={`mailto:${constantes.CONTACT.EMAIL}`}
            >
              {constantes.CONTACT.EMAIL}
            </LienExterne>
          </p>
        ) : (
          <Bouton
            auClic={modaleParcourSup.open}
            icône={{ position: "droite", classe: "fr-icon-refresh-line" }}
            taille="grand"
            type="button"
          >
            {i18n.ÉLÈVE.TABLEAU_DE_BORD.CARTES.PARCOURSUP.BOUTON}
          </Bouton>
        )}
      </CarteSecondaireTableauDeBordÉlève>
      <ModaleParcourSup modale={modaleParcourSup} />
    </>
  );
};

export default CarteParcourSupÉlève;
