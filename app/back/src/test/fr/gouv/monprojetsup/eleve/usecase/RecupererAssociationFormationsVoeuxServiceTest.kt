package fr.gouv.monprojetsup.eleve.usecase

import fr.gouv.monprojetsup.authentification.domain.entity.ProfilEleve
import fr.gouv.monprojetsup.commun.erreur.domain.MonProjetSupInternalErrorException
import fr.gouv.monprojetsup.eleve.domain.entity.FormationFavorite
import fr.gouv.monprojetsup.eleve.domain.entity.VoeuFavori
import fr.gouv.monprojetsup.eleve.domain.port.CompteParcoursupRepository
import fr.gouv.monprojetsup.eleve.entity.CommunesFavorites
import fr.gouv.monprojetsup.formation.domain.entity.Voeu
import fr.gouv.monprojetsup.formation.domain.port.VoeuRepository
import fr.gouv.monprojetsup.formation.entity.CommunesCourtes
import fr.gouv.monprojetsup.logging.MonProjetSupLogger
import fr.gouv.monprojetsup.parcoursup.domain.entity.FavorisParcoursup
import fr.gouv.monprojetsup.parcoursup.infrastructure.client.ParcoursupFavorisApiFavorisClient
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixAlternance
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixDureeEtudesPrevue
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixNiveau
import fr.gouv.monprojetsup.referentiel.domain.entity.SituationAvanceeProjetSup
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.then
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.MockitoAnnotations

class RecupererAssociationFormationsVoeuxServiceTest {
    @Mock
    lateinit var compteParcoursupRepository: CompteParcoursupRepository

    @Mock
    lateinit var parcoursupApiHttpClient: ParcoursupFavorisApiFavorisClient

    @Mock
    lateinit var voeuRepository: VoeuRepository

    @Mock
    lateinit var logger: MonProjetSupLogger

    @InjectMocks
    lateinit var recupererAssociationFormationsVoeuxService:
        RecupererAssociationFormationsVoeuxService

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun `quand l'élève n'a pas connecté son compte parcoursup, ne pas appeler le repo de voeux ni l'api parcoursup`() {
        // Given
        val profil =
            creerProfilAvecProfilExistant(
                formationsFavorites =
                    listOf(
                        FormationFavorite(
                            idFormation = "fl0010",
                            niveauAmbition = 1,
                            priseDeNote = null,
                        ),
                        FormationFavorite(
                            idFormation = "fl0012",
                            niveauAmbition = 3,
                            priseDeNote = "Ma formation préférée",
                        ),
                    ),
                voeuxFavoris =
                    listOf(
                        VoeuFavori(
                            idVoeu = "ta1",
                            estFavoriParcoursup = true,
                        ),
                        VoeuFavori(
                            idVoeu = "ta2",
                            estFavoriParcoursup = false,
                        ),
                    ),
            )
        given(compteParcoursupRepository.recupererIdCompteParcoursup(ID_ELEVE)).willReturn(null)

        // When
        val resultat = recupererAssociationFormationsVoeuxService.recupererVoeuxFavoris(profil)

        // Then
        assertThat(resultat).isEqualTo(profil.voeuxFavoris)
        then(parcoursupApiHttpClient).shouldHaveNoInteractions()
        then(voeuRepository).shouldHaveNoInteractions()
    }

    @Test
    fun `quand l'api parcoursup fail, doit renvoyer le profil et ne pas appeler le repo de voeux`() {
        // Given
        val profil =
            creerProfilAvecProfilExistant(
                formationsFavorites =
                    listOf(
                        FormationFavorite(
                            idFormation = "fl0010",
                            niveauAmbition = 1,
                            priseDeNote = null,
                        ),
                        FormationFavorite(
                            idFormation = "fl0012",
                            niveauAmbition = 3,
                            priseDeNote = "Ma formation préférée",
                        ),
                    ),
                voeuxFavoris =
                    listOf(
                        VoeuFavori(
                            idVoeu = "ta2",
                            estFavoriParcoursup = false,
                        ),
                    ),
            )
        given(compteParcoursupRepository.recupererIdCompteParcoursup(ID_ELEVE)).willReturn(510)
        val exception =
            MonProjetSupInternalErrorException(
                "ERREUR_APPEL_API",
                "Erreur lors de la connexion à l'API à l'url https://monauthentification.fr/Authentification/oauth2/token, " +
                    "un code 500 a été retourné avec le body null",
            )
        given(parcoursupApiHttpClient.recupererLesVoeuxSelectionnesSurParcoursup(510)).willThrow(exception)

        // When
        val resultat = recupererAssociationFormationsVoeuxService.recupererVoeuxFavoris(profil)

        // Then
        then(voeuRepository).shouldHaveNoInteractions()
        assertThat(resultat).isEqualTo(profil.voeuxFavoris)
    }

    @Test
    fun `quand pas de formations favorites sur parcoursup, doit renvoyer le profil et ne pas appeler le repo de voeux`() {
        // Given
        val profil =
            creerProfilAvecProfilExistant(
                formationsFavorites =
                    listOf(
                        FormationFavorite(
                            idFormation = "fl0010",
                            niveauAmbition = 1,
                            priseDeNote = null,
                        ),
                        FormationFavorite(
                            idFormation = "fl0012",
                            niveauAmbition = 3,
                            priseDeNote = "Ma formation préférée",
                        ),
                    ),
                voeuxFavoris =
                    listOf(
                        VoeuFavori(
                            idVoeu = "ta2",
                            estFavoriParcoursup = false,
                        ),
                    ),
            )
        given(compteParcoursupRepository.recupererIdCompteParcoursup(ID_ELEVE)).willReturn(510)
        given(parcoursupApiHttpClient.recupererLesVoeuxSelectionnesSurParcoursup(510)).willReturn(emptyList())

        // When
        val resultat = recupererAssociationFormationsVoeuxService.recupererVoeuxFavoris(profil)

        // Then
        then(voeuRepository).shouldHaveNoInteractions()
        assertThat(resultat).isEqualTo(profil.voeuxFavoris)
    }

    @Test
    fun `quand déjà à jour, alors doit renvoyer le profil d'entrée et ne pas appeler le repo de voeux`() {
        // Given
        val profil =
            creerProfilAvecProfilExistant(
                formationsFavorites =
                    listOf(
                        FormationFavorite(
                            idFormation = "fl0010",
                            niveauAmbition = 1,
                            priseDeNote = null,
                        ),
                        FormationFavorite(
                            idFormation = "fl0012",
                            niveauAmbition = 3,
                            priseDeNote = "Ma formation préférée",
                        ),
                    ),
                voeuxFavoris =
                    listOf(
                        VoeuFavori(
                            idVoeu = "ta2",
                            estFavoriParcoursup = true,
                        ),
                    ),
            )
        given(compteParcoursupRepository.recupererIdCompteParcoursup(ID_ELEVE)).willReturn(510)
        val voeuxParcoursup = listOf(FavorisParcoursup("ta2", null, 0))
        given(parcoursupApiHttpClient.recupererLesVoeuxSelectionnesSurParcoursup(510)).willReturn(voeuxParcoursup)
        given(voeuRepository.recupererVoeux(listOf("ta2"))).willReturn(
            mapOf(
                "fl0012" to
                    listOf(
                        Voeu(
                            id = "ta2",
                            nom = "Mon voeu 2",
                            commune = CommunesCourtes.PARIS15EME,
                            longitude = 2.2885659,
                            latitude = 48.851227,
                        ),
                    ),
            ),
        )

        // When
        val resultat = recupererAssociationFormationsVoeuxService.recupererVoeuxFavoris(profil)

        // Then
        assertThat(resultat).isEqualTo(profil.voeuxFavoris)
        then(voeuRepository).shouldHaveNoInteractions()
    }

    @Test
    fun `alors doit mettre à jour les voeux des formations non présentes et supprimer les voeux Parcoursup qui ont disparus`() {
        // Given
        val profil =
            creerProfilAvecProfilExistant(
                formationsFavorites =
                    listOf(
                        FormationFavorite(
                            idFormation = "fl0010",
                            niveauAmbition = 1,
                            priseDeNote = null,
                        ),
                        FormationFavorite(
                            idFormation = "fl0012",
                            niveauAmbition = 3,
                            priseDeNote = "Ma formation préférée",
                        ),
                    ),
                voeuxFavoris =
                    listOf(
                        VoeuFavori(
                            idVoeu = "ta1",
                            estFavoriParcoursup = false,
                        ),
                        VoeuFavori(
                            idVoeu = "ta7",
                            estFavoriParcoursup = true,
                        ),
                    ),
            )
        given(compteParcoursupRepository.recupererIdCompteParcoursup(ID_ELEVE)).willReturn(510)
        val voeuxParcoursup =
            listOf(
                FavorisParcoursup(idVoeu = "ta18", commentaire = null, notation = 0),
                FavorisParcoursup(idVoeu = "ta19", commentaire = null, notation = 0),
            )
        given(parcoursupApiHttpClient.recupererLesVoeuxSelectionnesSurParcoursup(510)).willReturn(voeuxParcoursup)
        given(voeuRepository.recupererVoeux(listOf("ta1", "ta7", "ta18", "ta19"))).willReturn(
            mapOf(
                "fl0012" to
                    listOf(
                        Voeu(
                            id = "ta1",
                            nom = "Mon voeu 1",
                            commune = CommunesCourtes.MARSEILLE,
                            latitude = 43.300000,
                            longitude = 5.400000,
                        ),
                        Voeu(
                            id = "ta18",
                            nom = "Mon voeu 18",
                            commune = CommunesCourtes.SAINT_MALO,
                            latitude = 48.6571,
                            longitude = -1.96914,
                        ),
                    ),
                "fl0011" to
                    listOf(
                        Voeu(
                            id = "ta7",
                            nom = "Mon voeu 7",
                            commune = CommunesCourtes.PARIS15EME,
                            longitude = 2.2885659,
                            latitude = 48.851227,
                        ),
                    ),
                "fl0753" to
                    listOf(
                        Voeu(
                            id = "ta19",
                            nom = "Mon voeu 19",
                            commune = CommunesCourtes.PARIS5EME,
                            longitude = 2.344,
                            latitude = 48.846,
                        ),
                    ),
            ),
        )

        // When
        val resultat = recupererAssociationFormationsVoeuxService.recupererVoeuxFavoris(profil)

        // Then
        val attendu =
            listOf(
                VoeuFavori(
                    idVoeu = "ta1",
                    estFavoriParcoursup = false,
                ),
                VoeuFavori(
                    idVoeu = "ta18",
                    estFavoriParcoursup = true,
                ),
                VoeuFavori(
                    idVoeu = "ta19",
                    estFavoriParcoursup = true,
                ),
            )
        assertThat(resultat).isEqualTo(attendu)
    }

    private fun creerProfilAvecProfilExistant(
        formationsFavorites: List<FormationFavorite>,
        voeuxFavoris: List<VoeuFavori>,
    ) = ProfilEleve.AvecProfilExistant(
        id = ID_ELEVE,
        situation = SituationAvanceeProjetSup.AUCUNE_IDEE,
        classe = ChoixNiveau.SECONDE,
        baccalaureat = "Général",
        specialites = listOf("4", "1006"),
        domainesInterets = listOf("animaux", "agroequipement"),
        centresInterets = listOf("linguistique", "voyage"),
        metiersFavoris = listOf("MET001"),
        dureeEtudesPrevue = ChoixDureeEtudesPrevue.COURTE,
        alternance = ChoixAlternance.INDIFFERENT,
        communesFavorites = listOf(CommunesFavorites.PARIS15EME, CommunesFavorites.MARSEILLE),
        formationsFavorites = formationsFavorites,
        moyenneGenerale = -1.0f,
        corbeilleFormations = listOf("fl1234", "fl5678"),
        compteParcoursupLie = true,
        voeuxFavoris = voeuxFavoris,
    )

    companion object {
        private const val ID_ELEVE = "0f88ddd1-62ef-436e-ad3f-cf56d5d14c15"
    }
}
