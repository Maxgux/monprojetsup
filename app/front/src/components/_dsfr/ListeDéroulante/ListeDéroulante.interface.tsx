export type ListeDéroulanteProps = {
  label: string;
  description?: string;
  options: Array<{ valeur: string; label: string }>;
  status?: {
    type: "désactivé" | "erreur" | "succès";
    message?: string;
  };
  valeurOptionSélectionnéeParDéfaut?: string;
  registerHookForm?: {};
};
