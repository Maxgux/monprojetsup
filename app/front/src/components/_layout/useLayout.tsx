import logoMPS from "@/assets/logo/logo-mps-beta.svg";
import { i18n } from "@/configuration/i18n/i18n";
import { HeaderProps } from "@codegouvfr/react-dsfr/Header";

export default function useLayout() {
  const logoOpérateur: HeaderProps["operatorLogo"] = {
    alt: "MPS",
    imgUrl: logoMPS,
    orientation: "horizontal",
  };

  const blocMarque: HeaderProps["brandTop"] = (
    <>
      République
      <br role="presentation" />
      Française
    </>
  );

  const lienAccueil: HeaderProps["homeLinkProps"] = {
    to: "/",
    title: `Accueil - ${i18n.APP.NOM}`,
  };

  return {
    logoOpérateur,
    blocMarque,
    lienAccueil,
  };
}
