import { type CarteMétierProps } from "./CarteMétier.interface";
import Carte from "@/components/Carte/Carte";
import { i18n } from "@/configuration/i18n/i18n";
import useÉlève from "@/features/élève/ui/hooks/useÉlève/useÉlève";

const CarteMétier = ({ id, titre, formations, sélectionnée = false }: CarteMétierProps) => {
  const { élève } = useÉlève();

  const estUnMétierFavori = () => {
    return élève?.métiersFavoris?.includes(id) ?? false;
  };

  return (
    <Carte
      estFavori={estUnMétierFavori()}
      estMasqué={false}
      id={id}
      sélectionnée={sélectionnée}
      titre={titre}
    >
      {formations.length > 0 && (
        <p className="fr-text--sm mb-0">
          {formations.length} {i18n.CARTE_MÉTIER.FORMATIONS}
        </p>
      )}
    </Carte>
  );
};

export default CarteMétier;
