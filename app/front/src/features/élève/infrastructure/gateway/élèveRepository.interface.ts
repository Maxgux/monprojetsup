import { type Élève } from "@/features/élève/domain/élève.interface";

export type ÉlèveRepository = {
  récupérerProfil: () => Promise<Élève | Error>;
  mettreÀJourProfil: (élève: Élève) => Promise<Élève | Error>;
  associerCompteParcourSup: (codeVerifier: string, code: string, redirectUri: string) => Promise<boolean | Error>;
};
