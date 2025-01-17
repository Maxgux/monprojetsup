package fr.gouv.monprojetsup.formation.usecase

import fr.gouv.monprojetsup.authentification.domain.entity.ProfilEleve
import fr.gouv.monprojetsup.commun.erreur.domain.MonProjetSupIllegalStateErrorException
import fr.gouv.monprojetsup.commun.erreur.domain.MonProjetSupNotFoundException
import fr.gouv.monprojetsup.formation.domain.entity.FicheFormation
import fr.gouv.monprojetsup.formation.domain.port.FormationRepository
import fr.gouv.monprojetsup.formation.domain.port.SuggestionHttpClient
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RecupererFicheFormationService(
    val suggestionHttpClient: SuggestionHttpClient,
    val formationRepository: FormationRepository,
    val recupererInformationsSurLesVoeuxEtLeursCommunesService: RecupererInformationsSurLesVoeuxEtLeursCommunesService,
    val critereAnalyseCandidatureService: CritereAnalyseCandidatureService,
    val recupererExplicationsEtExemplesMetiersPourFormationService: RecupererExplicationsEtExemplesMetiersPourFormationService,
    val statistiquesDesAdmisPourFormationsService: StatistiquesDesAdmisPourFormationsService,
    val metiersTriesParProfilBuilder: MetiersTriesParProfilBuilder,
    val calculDuTauxDAffiniteBuilder: CalculDuTauxDAffiniteBuilder,
) {
    @Transactional(readOnly = true)
    @Throws(MonProjetSupIllegalStateErrorException::class, MonProjetSupNotFoundException::class)
    fun recupererFormation(
        profilEleve: ProfilEleve.AvecProfilExistant?,
        idFormation: String,
    ): FicheFormation {
        val formation = formationRepository.recupererUneFormation(idFormation)
        val criteresAnalyseCandidature = critereAnalyseCandidatureService.recupererCriteresAnalyseCandidature(formation)
        val statistiquesDesAdmis =
            statistiquesDesAdmisPourFormationsService.recupererStatistiquesAdmisDUneFormation(
                idBaccalaureat = profilEleve?.baccalaureat,
                idFormation = formation.id,
                classe = profilEleve?.classe,
            )
        return if (profilEleve != null) {
            val affinitesFormationEtMetier = suggestionHttpClient.recupererLesSuggestions(profilEleve)
            val (explications, exemplesDeMetiers) =
                recupererExplicationsEtExemplesMetiersPourFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve,
                    formation.id,
                )
            val voeuxDeLaFormation =
                recupererInformationsSurLesVoeuxEtLeursCommunesService.recupererInformationsSurLesVoeuxEtLeursCommunes(
                    idFormation = formation.id,
                    profilEleve = profilEleve,
                    obsoletesInclus = true,
                )
            FicheFormation.FicheFormationPourProfil(
                id = formation.id,
                nom = formation.nom,
                descriptifGeneral = formation.descriptifGeneral,
                descriptifAttendus = formation.descriptifAttendus,
                descriptifDiplome = formation.descriptifDiplome,
                descriptifConseils = formation.descriptifConseils,
                formationsAssociees = formation.formationsAssociees,
                liens = formation.liens,
                tauxAffinite =
                    calculDuTauxDAffiniteBuilder.calculDuTauxDAffinite(
                        formationAvecLeurAffinite = affinitesFormationEtMetier.formations,
                        idFormation = formation.id,
                    ),
                metiersTriesParAffinites =
                    metiersTriesParProfilBuilder.trierMetiersParAffinites(
                        metiers = exemplesDeMetiers,
                        idsMetierTriesParAffinite = affinitesFormationEtMetier.metiersTriesParAffinites,
                    ),
                informationsSurLesVoeuxEtLeursCommunes = voeuxDeLaFormation,
                criteresAnalyseCandidature = criteresAnalyseCandidature,
                explications = explications,
                statistiquesDesAdmis = statistiquesDesAdmis,
                apprentissage = formation.apprentissage,
            )
        } else {
            val voeux =
                recupererInformationsSurLesVoeuxEtLeursCommunesService.recupererVoeux(
                    formation.id,
                    obsoletesInclus = true,
                )
            FicheFormation.FicheFormationSansProfil(
                id = formation.id,
                nom = formation.nom,
                descriptifGeneral = formation.descriptifGeneral,
                descriptifAttendus = formation.descriptifAttendus,
                descriptifDiplome = formation.descriptifDiplome,
                descriptifConseils = formation.descriptifConseils,
                formationsAssociees = formation.formationsAssociees,
                liens = formation.liens,
                voeux = voeux,
                metiers = emptyList(), // Voir avec Hugo
                criteresAnalyseCandidature = criteresAnalyseCandidature,
                statistiquesDesAdmis = statistiquesDesAdmis,
                apprentissage = formation.apprentissage,
            )
        }
    }
}
