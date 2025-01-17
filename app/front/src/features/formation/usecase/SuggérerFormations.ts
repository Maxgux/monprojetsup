import { type FicheFormation } from "@/features/formation/domain/formation.interface";
import { type FormationRepository } from "@/features/formation/infrastructure/formationRepository.interface";

export class SuggérerFormationsUseCase {
  public constructor(private readonly _formationRepository: FormationRepository) {}

  public async run(): Promise<FicheFormation[] | Error> {
    return await this._formationRepository.suggérer();
  }
}
