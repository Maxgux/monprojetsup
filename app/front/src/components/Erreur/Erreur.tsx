import { ErreurProps } from "./Erreur.interface";
import Entête from "@/components/_layout/Entête/Entête";
import PiedDePage from "@/components/_layout/PiedDePage/PiedDePage";
import LienÉvitement from "@/components/LienÉvitement/LienÉvitement";
import Toast from "@/components/Toast/Toast";
import { i18n } from "@/configuration/i18n/i18n";
import useUtilisateur from "@/features/utilisateur/ui/hooks/useUtilisateur/useUtilisateur";
import { ScrollRestoration } from "@tanstack/react-router";

const Erreur = ({ erreur }: ErreurProps) => {
  const utilisateur = useUtilisateur();

  if (erreur.constructor.name === "NonIdentifiéErreurHttp" || erreur.constructor.name === "NonAutoriséErreurHttp") {
    void utilisateur.seDéconnecter();
    return null;
  }

  scrollTo({ top: 0 });

  return (
    <>
      <LienÉvitement />
      <Entête />
      <main id="contenu">
        <ScrollRestoration />
        <Toast />
        <div className="my-60 grid gap-2 place-self-center text-center lg:w-[45%]">
          <div
            aria-hidden="true"
            className="fr-display--lg fr-mb-0"
          >
            {erreur.constructor.name === "ServeurTemporairementIndisponibleErreurHttp"
              ? i18n.ERREURS.SERVEUR_INDISPONIBLE.EMOJI
              : i18n.ERREURS.GÉNÉRIQUE.EMOJI}
          </div>
          <p className="fr-display--xs mb-0">
            {erreur.constructor.name === "ServeurTemporairementIndisponibleErreurHttp"
              ? i18n.ERREURS.SERVEUR_INDISPONIBLE.TITRE
              : i18n.ERREURS.GÉNÉRIQUE.TITRE}
          </p>
          <p className="fr-h3">
            {erreur.constructor.name === "ServeurTemporairementIndisponibleErreurHttp"
              ? i18n.ERREURS.SERVEUR_INDISPONIBLE.SOUS_TITRE
              : i18n.ERREURS.GÉNÉRIQUE.SOUS_TITRE}
          </p>
        </div>
      </main>
      <PiedDePage />
    </>
  );
};

export default Erreur;
