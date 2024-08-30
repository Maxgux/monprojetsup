import { type RécupérerFormationsRéponseHTTP } from "./formationHttpRepository.interface";
import { type Formation } from "@/features/formation/domain/formation.interface";
import { type FormationRepository } from "@/features/formation/infrastructure/formationRepository.interface";
import { type IMpsApiHttpClient } from "@/services/mpsApiHttpClient/mpsApiHttpClient.interface";

export class formationHttpRepository implements FormationRepository {
  private _ENDPOINT = "/api/v1/formations" as const;

  public constructor(private _mpsApiHttpClient: IMpsApiHttpClient) {}

  public async récupérer(formationId: string): Promise<Formation | undefined> {
    const formations = await this.récupérerPlusieurs([formationId]);

    return formations?.[0];
  }

  public async récupérerPlusieurs(formationIds: string[]): Promise<Formation[] | undefined> {
    const paramètresDeRequête = new URLSearchParams();

    for (const formationId of formationIds) {
      paramètresDeRequête.append("ids", formationId);
    }

    const réponse = await this._mpsApiHttpClient.get<RécupérerFormationsRéponseHTTP>(
      this._ENDPOINT,
      paramètresDeRequête,
    );

    if (!réponse) return undefined;

    return réponse.formations.map((formation) => this._mapperVersLeDomaine(formation));
  }

  public async rechercher(recherche: string): Promise<Formation[] | undefined> {
    const paramètresDeRequête = new URLSearchParams();
    paramètresDeRequête.set("recherche", recherche);

    const réponse = await this._mpsApiHttpClient.get<RécupérerFormationsRéponseHTTP>(
      `${this._ENDPOINT}/recherche/detaillee`,
      paramètresDeRequête,
    );

    if (!réponse) return undefined;

    return réponse.formations.map((formation) => this._mapperVersLeDomaine(formation));
  }

  private _mapperVersLeDomaine(formationHttp: RécupérerFormationsRéponseHTTP["formations"][number]): Formation {
    return {
      id: formationHttp.formation.id,
      nom: formationHttp.formation.nom,
      descriptifs: {
        formation: formationHttp.formation.descriptifFormation ?? null,
        détails: formationHttp.formation.descriptifDiplome ?? null,
        attendus: formationHttp.formation.descriptifAttendus ?? null,
        conseils: formationHttp.formation.descriptifConseils ?? null,
      },
      liens: formationHttp.formation.liens.map((lien) => ({
        intitulé: lien.nom,
        url: lien.url,
      })),
      admis: {
        moyenneGénérale: {
          idBac: formationHttp.formation.moyenneGeneraleDesAdmis?.baccalaureat?.id ?? null,
          nomBac: formationHttp.formation.moyenneGeneraleDesAdmis?.baccalaureat?.nom ?? null,
          centiles:
            formationHttp.formation.moyenneGeneraleDesAdmis?.centiles.map((centile) => ({
              centile: centile.centile,
              note: centile.note,
            })) ?? [],
        },
        répartition: {
          parBac:
            formationHttp.formation.repartitionAdmisAnneePrecedente?.parBaccalaureat.map((répartition) => ({
              idBac: répartition.baccalaureat.id,
              nomBac: répartition.baccalaureat.nom,
              nombre: répartition.nombreAdmis,
              pourcentage: Math.round(
                (répartition.nombreAdmis / (formationHttp.formation.repartitionAdmisAnneePrecedente?.total ?? 100)) *
                  100,
              ),
            })) ?? [],
        },
        total: formationHttp.formation.repartitionAdmisAnneePrecedente?.total ?? null,
      },
      formationsAssociées: formationHttp.formation.idsFormationsAssociees,
      critèresAnalyse: formationHttp.formation.criteresAnalyseCandidature.map((critère) => ({
        nom: critère.nom,
        pourcentage: critère.pourcentage,
      })),
      communes: formationHttp.formation.villes,
      métiersAccessibles: formationHttp.formation.metiers.map((métier) => ({
        id: métier.id,
        nom: métier.nom,
        descriptif: métier.descriptif ?? null,
        liens: métier.liens.map((lien) => ({ intitulé: lien.nom, url: lien.url })),
      })),
      affinité: formationHttp.formation.tauxAffinite ?? null,
      explications: formationHttp.explications
        ? {
            communes:
              formationHttp.explications.geographique.map((commune) => ({
                nom: commune.nomVille,
                distanceKm: commune.distanceKm,
              })) ?? [],
            formationsSimilaires:
              formationHttp.explications.formationsSimilaires.map((formation) => ({
                id: formation.id,
                nom: formation.nom,
              })) ?? [],
            duréeÉtudesPrévue: formationHttp.explications.dureeEtudesPrevue ?? null,
            alternance: formationHttp.explications.alternance ?? null,
            intêretsEtDomainesChoisis: {
              intêrets:
                formationHttp.explications.interetsEtDomainesChoisis?.interets.map((intêret) => ({
                  id: intêret.id,
                  nom: intêret.nom,
                })) ?? [],
              domaines:
                formationHttp.explications.interetsEtDomainesChoisis?.domaines.map((domaine) => ({
                  id: domaine.id,
                  nom: domaine.nom,
                })) ?? [],
            },
            spécialitésChoisies: formationHttp.explications.specialitesChoisies.map((spécialité) => ({
              nom: spécialité.nomSpecialite,
              pourcentageAdmisAnnéePrécédente: spécialité.pourcentage,
            })),
            typeBaccalaureat: formationHttp.explications.typeBaccalaureat
              ? {
                  id: formationHttp.explications.typeBaccalaureat.baccalaureat.id,
                  nom: formationHttp.explications.typeBaccalaureat.baccalaureat.nom,
                  pourcentageAdmisAnnéePrécédente: formationHttp.explications.typeBaccalaureat?.pourcentage,
                }
              : null,
            autoEvaluationMoyenne: formationHttp.explications.autoEvaluationMoyenne
              ? {
                  moyenne: formationHttp.explications.autoEvaluationMoyenne.moyenne,
                  intervalBas: formationHttp.explications.autoEvaluationMoyenne.basIntervalleNotes,
                  intervalHaut: formationHttp.explications.autoEvaluationMoyenne.hautIntervalleNotes,
                  idBacUtilisé: formationHttp.explications.autoEvaluationMoyenne.baccalaureatUtilise.id,
                  nomBacUtilisé: formationHttp.explications.autoEvaluationMoyenne.baccalaureatUtilise.nom,
                }
              : null,
          }
        : null,
    };
  }
}
