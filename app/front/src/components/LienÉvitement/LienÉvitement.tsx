import Bouton from "@/components/Bouton/Bouton";
import { constantes } from "@/configuration/constantes";
import { i18n } from "@/configuration/i18n/i18n";

const LienÉvitement = () => {
  return (
    <div className="fr-skiplinks">
      <nav
        aria-label={i18n.ACCESSIBILITÉ.ACCÈS_RAPIDE}
        className="fr-container"
        role="navigation"
      >
        <ul className="fr-skiplinks__list">
          <li>
            <Bouton
              auClic={() => document.querySelector<HTMLElement>(`#${constantes.ACCESSIBILITÉ.CONTENU_ID}`)?.focus()}
              label={i18n.ACCESSIBILITÉ.CONTENU}
              type="button"
              variante="quaternaire"
            />
          </li>
          <li>
            <Bouton
              auClic={() =>
                document.querySelector<HTMLElement>(`#${constantes.ACCESSIBILITÉ.PIED_DE_PAGE_ID}`)?.focus()
              }
              label={i18n.ACCESSIBILITÉ.PIED_PAGE}
              type="button"
              variante="quaternaire"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LienÉvitement;
