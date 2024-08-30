import { env } from "@/configuration/environnement";
import { communeHTTPRepository } from "@/features/commune/infrastructure/communeHTTPRepository/communeHTTPRepository";
import { type CommuneRepository } from "@/features/commune/infrastructure/communeRepository.interface";
import { RechercherCommunesUseCase } from "@/features/commune/usecase/RechercherCommunes";
import { ÉlèveHttpRepository } from "@/features/élève/infrastructure/gateway/élèveHttpRepository/élèveHttpRepository";
import { type ÉlèveRepository } from "@/features/élève/infrastructure/gateway/élèveRepository.interface";
import { ÉlèveSessionStorageRepository } from "@/features/élève/infrastructure/gateway/élèveSessionStorageRepository/élèveSessionStorageRepository";
import { MettreÀJourÉlèveUseCase } from "@/features/élève/usecase/MettreÀJourProfilÉlève";
import { RécupérerÉlèveUseCase } from "@/features/élève/usecase/RécupérerProfilÉlève";
import { type FormationRepository } from "@/features/formation/infrastructure/formationRepository.interface";
import { formationHttpRepository } from "@/features/formation/infrastructure/gateway/formationHttpRepository/formationHttpRepository";
import { formationInMemoryRepository } from "@/features/formation/infrastructure/gateway/formationInMemoryRepository/formationInMemoryRepository";
import { RechercherFormationsUseCase } from "@/features/formation/usecase/RechercherFormations";
import { RécupérerFormationUseCase } from "@/features/formation/usecase/RécupérerFormation";
import { RécupérerFormationsUseCase } from "@/features/formation/usecase/RécupérerFormations";
import { métierInMemoryRepository } from "@/features/métier/infrastructure/gateway/métierInMemoryRepository/métierInMemoryRepository";
import { type MétierRepository } from "@/features/métier/infrastructure/métierRepository.interface";
import { RechercherMétiersUseCase } from "@/features/métier/usecase/RechercherMétiers";
import { RécupérerAperçusMétiersUseCase } from "@/features/métier/usecase/RécupérerAperçusMétiers";
import { référentielDonnéesHttpRepository } from "@/features/référentielDonnées/infrastructure/gateway/référentielDonnéesHttpRepository/référentielDonnéesHttpRepository";
import { référentielDonnéesInMemoryRepository } from "@/features/référentielDonnées/infrastructure/gateway/référentielDonnéesInMemoryRepository/référentielDonnéesInMemoryRepository";
import { type RéférentielDonnéesRepository } from "@/features/référentielDonnées/infrastructure/référentielDonnéesRepository.interface";
import { RécupérerRéférentielDonnéesUseCase } from "@/features/référentielDonnées/usecase/RécupérerRéférentielDonnées";
import { HttpClient } from "@/services/httpClient/httpClient";
import { Logger } from "@/services/logger/logger";
import { MpsApiHttpClient } from "@/services/mpsApiHttpClient/mpsApiHttpClient";

export class Dépendances {
  private static instance: Dépendances;

  private readonly _logger: Logger;

  private readonly _httpClient: HttpClient;

  private readonly _mpsApiHttpClient: MpsApiHttpClient;

  private readonly _référentielDonnéesRepository: RéférentielDonnéesRepository;

  private readonly _élèveRepository: ÉlèveRepository;

  private readonly _formationRepository: FormationRepository;

  private readonly _métierRepository: MétierRepository;

  private readonly _communeRepository: CommuneRepository;

  public readonly récupérerRéférentielDonnéesUseCase: RécupérerRéférentielDonnéesUseCase;

  public readonly mettreÀJourProfilÉlèveUseCase: MettreÀJourÉlèveUseCase;

  public readonly récupérerProfilÉlèveUseCase: RécupérerÉlèveUseCase;

  public readonly récupérerFormationUseCase: RécupérerFormationUseCase;

  public readonly récupérerFormationsUseCase: RécupérerFormationsUseCase;

  public readonly rechercherFormationsUseCase: RechercherFormationsUseCase;

  public readonly récupérerAperçusMétiersUseCase: RécupérerAperçusMétiersUseCase;

  public readonly rechercherMétiersUseCase: RechercherMétiersUseCase;

  public readonly rechercherCommunesUseCase: RechercherCommunesUseCase;

  private constructor() {
    this._logger = new Logger();
    this._httpClient = new HttpClient(this._logger);
    this._mpsApiHttpClient = new MpsApiHttpClient(this._httpClient, env.VITE_API_URL);

    // Repositories
    this._référentielDonnéesRepository = env.VITE_TEST_MODE
      ? new référentielDonnéesInMemoryRepository()
      : new référentielDonnéesHttpRepository(this._mpsApiHttpClient);
    this._élèveRepository = env.VITE_TEST_MODE
      ? new ÉlèveSessionStorageRepository()
      : new ÉlèveHttpRepository(this._mpsApiHttpClient);
    this._formationRepository = env.VITE_TEST_MODE
      ? new formationInMemoryRepository()
      : new formationHttpRepository(this._mpsApiHttpClient);
    this._métierRepository = new métierInMemoryRepository();
    this._communeRepository = new communeHTTPRepository(this._httpClient);

    // Référentiel de données
    this.récupérerRéférentielDonnéesUseCase = new RécupérerRéférentielDonnéesUseCase(
      this._référentielDonnéesRepository,
    );

    // Élève
    this.mettreÀJourProfilÉlèveUseCase = new MettreÀJourÉlèveUseCase(this._élèveRepository);
    this.récupérerProfilÉlèveUseCase = new RécupérerÉlèveUseCase(this._élèveRepository);

    // Formations
    this.récupérerFormationUseCase = new RécupérerFormationUseCase(this._formationRepository);
    this.récupérerFormationsUseCase = new RécupérerFormationsUseCase(this._formationRepository);
    this.rechercherFormationsUseCase = new RechercherFormationsUseCase(this._formationRepository);

    // Métiers
    this.récupérerAperçusMétiersUseCase = new RécupérerAperçusMétiersUseCase(this._métierRepository);
    this.rechercherMétiersUseCase = new RechercherMétiersUseCase(this._métierRepository);

    // Communes
    this.rechercherCommunesUseCase = new RechercherCommunesUseCase(this._communeRepository);
  }

  public static getInstance(): Dépendances {
    if (!Dépendances.instance) {
      Dépendances.instance = new Dépendances();
    }

    return Dépendances.instance;
  }
}

export const dépendances = Dépendances.getInstance();
