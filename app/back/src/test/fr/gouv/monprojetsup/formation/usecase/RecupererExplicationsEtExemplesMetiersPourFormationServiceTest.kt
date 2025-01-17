package fr.gouv.monprojetsup.formation.usecase

import fr.gouv.monprojetsup.authentification.domain.entity.ProfilEleve
import fr.gouv.monprojetsup.eleve.domain.entity.FormationFavorite
import fr.gouv.monprojetsup.eleve.entity.CommunesFavorites
import fr.gouv.monprojetsup.formation.domain.entity.ExplicationGeographique
import fr.gouv.monprojetsup.formation.domain.entity.ExplicationsSuggestionDetaillees
import fr.gouv.monprojetsup.formation.domain.entity.ExplicationsSuggestionEtExemplesMetiers
import fr.gouv.monprojetsup.formation.domain.entity.ExplicationsSuggestionEtExemplesMetiers.AutoEvaluationMoyenne
import fr.gouv.monprojetsup.formation.domain.entity.ExplicationsSuggestionEtExemplesMetiers.TypeBaccalaureat
import fr.gouv.monprojetsup.formation.domain.entity.FicheFormation.FicheFormationPourProfil.ExplicationAutoEvaluationMoyenne
import fr.gouv.monprojetsup.formation.domain.entity.FicheFormation.FicheFormationPourProfil.ExplicationTypeBaccalaureat
import fr.gouv.monprojetsup.formation.domain.entity.FormationCourte
import fr.gouv.monprojetsup.formation.domain.port.FormationRepository
import fr.gouv.monprojetsup.formation.domain.port.SuggestionHttpClient
import fr.gouv.monprojetsup.formation.domain.port.VoeuRepository
import fr.gouv.monprojetsup.metier.domain.entity.Metier
import fr.gouv.monprojetsup.metier.domain.entity.MetierCourt
import fr.gouv.monprojetsup.metier.domain.port.MetierRepository
import fr.gouv.monprojetsup.referentiel.domain.entity.Baccalaureat
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixAlternance
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixDureeEtudesPrevue
import fr.gouv.monprojetsup.referentiel.domain.entity.ChoixNiveau
import fr.gouv.monprojetsup.referentiel.domain.entity.Domaine
import fr.gouv.monprojetsup.referentiel.domain.entity.InteretSousCategorie
import fr.gouv.monprojetsup.referentiel.domain.entity.SituationAvanceeProjetSup
import fr.gouv.monprojetsup.referentiel.domain.entity.Specialite
import fr.gouv.monprojetsup.referentiel.domain.port.BaccalaureatRepository
import fr.gouv.monprojetsup.referentiel.domain.port.SpecialitesRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.mock
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.MockitoAnnotations

class RecupererExplicationsEtExemplesMetiersPourFormationServiceTest {
    @Mock
    lateinit var suggestionHttpClient: SuggestionHttpClient

    @Mock
    lateinit var formationRepository: FormationRepository

    @Mock
    lateinit var voeuRepository: VoeuRepository

    @Mock
    lateinit var baccalaureatRepository: BaccalaureatRepository

    @Mock
    lateinit var choixEleveService: ChoixEleveService

    @Mock
    lateinit var metierRepository: MetierRepository

    @Mock
    lateinit var specialitesRepository: SpecialitesRepository

    @InjectMocks
    lateinit var recupererExplicationsEtExemplesDeMetiersFormationService: RecupererExplicationsEtExemplesMetiersPourFormationService

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
    }

    private val bacGeneral = Baccalaureat(id = "Générale", idExterne = "Général", nom = "Série Générale", idCarteParcoursup = "1")
    private val bacPro = Baccalaureat(id = "Professionel", idExterne = "P", nom = "Série Professionnelle", idCarteParcoursup = "3")
    private val bacSTMG = Baccalaureat(id = "STMG", idExterne = "STMG", nom = "Série STMG", idCarteParcoursup = "2")

    private val profil =
        ProfilEleve.AvecProfilExistant(
            id = "adcf627c-36dd-4df5-897b-159443a6d49c",
            situation = SituationAvanceeProjetSup.PROJET_PRECIS,
            classe = ChoixNiveau.TERMINALE,
            baccalaureat = "Générale",
            dureeEtudesPrevue = ChoixDureeEtudesPrevue.INDIFFERENT,
            alternance = ChoixAlternance.PAS_INTERESSE,
            communesFavorites = listOf(CommunesFavorites.CAEN),
            specialites = listOf("1001", "1049"),
            centresInterets = listOf("ci29", "ci17", "ci8"),
            moyenneGenerale = 14f,
            metiersFavoris = listOf("MET.123", "MET.456"),
            formationsFavorites =
                listOf(
                    FormationFavorite(
                        idFormation = "fl1234",
                        niveauAmbition = 1,
                        priseDeNote = null,
                    ),
                    FormationFavorite(
                        idFormation = "fl5678",
                        niveauAmbition = 3,
                        priseDeNote = "Ma formation préférée",
                    ),
                ),
            domainesInterets = listOf("dom8", "dom6", "dom2", "dom9"),
            corbeilleFormations = listOf("fl0001"),
            compteParcoursupLie = true,
            voeuxFavoris = emptyList(),
        )

    @Nested
    inner class RecupererExplicationsPourUneFormation {
        @Test
        fun `doit retourner les explications duréeEtudesPrévue, alternance et moyenneGeneraleDesAdmis`() {
            // Given
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    dureeEtudesPrevue = ChoixDureeEtudesPrevue.LONGUE,
                    alternance = ChoixAlternance.TRES_INTERESSE,
                )
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            val attendu =
                ExplicationsSuggestionDetaillees(
                    dureeEtudesPrevue = ChoixDureeEtudesPrevue.LONGUE,
                    alternance = ChoixAlternance.TRES_INTERESSE,
                )
            assertThat(resultat.first).usingRecursiveComparison().isEqualTo(attendu)
        }

        @Test
        fun `dans le cas par défaut, doit retourner par défaut`() {
            // Given
            val explication = ExplicationsSuggestionEtExemplesMetiers()
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            assertThat(resultat.first).usingRecursiveComparison().isEqualTo(ExplicationsSuggestionDetaillees())
        }

        @Test
        fun `doit trier et filtrer les explications géographiques`() {
            // Given
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    geographique =
                        listOf(
                            ExplicationGeographique(
                                ville = "Nantes",
                                distanceKm = 10,
                            ),
                            ExplicationGeographique(
                                ville = "Nantes",
                                distanceKm = 85,
                            ),
                            ExplicationGeographique(
                                ville = "Paris",
                                distanceKm = 2,
                            ),
                            ExplicationGeographique(
                                ville = "Paris",
                                distanceKm = 1,
                            ),
                            ExplicationGeographique(
                                ville = "Melun",
                                distanceKm = 12,
                            ),
                        ),
                )
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            val attendu =
                listOf(
                    ExplicationGeographique(
                        ville = "Paris",
                        distanceKm = 1,
                    ),
                    ExplicationGeographique(
                        ville = "Nantes",
                        distanceKm = 10,
                    ),
                    ExplicationGeographique(
                        ville = "Melun",
                        distanceKm = 12,
                    ),
                )
            assertThat(resultat.first.geographique).usingRecursiveComparison().isEqualTo(attendu)
        }

        @Test
        fun `si le baccalaureatRepository réussi, doit retourner l'explication de l'auto évaluation et du type de bac`() {
            // Given
            given(baccalaureatRepository.recupererUnBaccalaureatParIdExterne(idExterneBaccalaureat = "Général")).willReturn(
                bacGeneral,
            )
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    autoEvaluationMoyenne =
                        AutoEvaluationMoyenne(
                            echellonDeLaMoyenneAutoEvalue = 29,
                            rangs =
                                ExplicationsSuggestionEtExemplesMetiers.RangsEchellons(
                                    rangEch25 = 12,
                                    rangEch50 = 14,
                                    rangEch75 = 16,
                                    rangEch10 = 10,
                                    rangEch90 = 17,
                                ),
                            baccalaureatUtilise = "Général",
                        ),
                    typeBaccalaureat =
                        TypeBaccalaureat(
                            nomBaccalaureat = "Général",
                            pourcentage = 18,
                        ),
                )
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            assertThat(resultat.first.explicationAutoEvaluationMoyenne).usingRecursiveComparison().isEqualTo(
                ExplicationAutoEvaluationMoyenne(
                    moyenneAutoEvalue = 14.5f,
                    hautIntervalleNotes = 8f,
                    basIntervalleNotes = 6f,
                    baccalaureatUtilise = bacGeneral,
                ),
            )
            assertThat(resultat.first.explicationTypeBaccalaureat).usingRecursiveComparison().isEqualTo(
                ExplicationTypeBaccalaureat(
                    baccalaureat = bacGeneral,
                    pourcentage = 18,
                ),
            )
        }

        @Test
        fun `si le baccalaureatRepository échoue, doit retourner l'explication de l'auto évaluation avec le nom renvoyer`() {
            // Given
            given(baccalaureatRepository.recupererUnBaccalaureatParIdExterne(idExterneBaccalaureat = "Général")).willReturn(
                null,
            )
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    autoEvaluationMoyenne =
                        AutoEvaluationMoyenne(
                            echellonDeLaMoyenneAutoEvalue = 29,
                            rangs =
                                ExplicationsSuggestionEtExemplesMetiers.RangsEchellons(
                                    rangEch25 = 12,
                                    rangEch50 = 14,
                                    rangEch75 = 16,
                                    rangEch10 = 10,
                                    rangEch90 = 17,
                                ),
                            baccalaureatUtilise = "Général",
                        ),
                    typeBaccalaureat =
                        TypeBaccalaureat(
                            nomBaccalaureat = "Général",
                            pourcentage = 18,
                        ),
                )
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            assertThat(resultat.first.explicationAutoEvaluationMoyenne).usingRecursiveComparison().isEqualTo(
                ExplicationAutoEvaluationMoyenne(
                    moyenneAutoEvalue = 14.5f,
                    hautIntervalleNotes = 8f,
                    basIntervalleNotes = 6f,
                    baccalaureatUtilise = Baccalaureat(id = "Général", idExterne = "Général", nom = "Général", idCarteParcoursup = "0"),
                ),
            )
            assertThat(resultat.first.explicationTypeBaccalaureat).usingRecursiveComparison().isEqualTo(
                ExplicationTypeBaccalaureat(
                    baccalaureat = Baccalaureat(id = "Général", idExterne = "Général", nom = "Général", idCarteParcoursup = "0"),
                    pourcentage = 18,
                ),
            )
        }

        @Test
        fun `doit retourner les formations similaires`() {
            // Given
            val explication = ExplicationsSuggestionEtExemplesMetiers(formationsSimilaires = listOf("fl1", "fl7"))
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)
            val formationCourtes =
                listOf(
                    FormationCourte(
                        id = "fl1",
                        nom = "Classe préparatoire aux études supérieures - Cinéma audiovisuel",
                    ),
                    FormationCourte(id = "fl7", nom = "Classe préparatoire aux études supérieures - Littéraire"),
                )
            given(formationRepository.recupererLesNomsDesFormations(listOf("fl1", "fl7"))).willReturn(formationCourtes)
            given(voeuRepository.recupererLesNomsDesVoeux(listOf("fl1", "fl7"))).willReturn(emptyList())
            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            assertThat(resultat.first.formationsSimilaires).usingRecursiveComparison().isEqualTo(formationCourtes)
        }

        @Test
        fun `doit retourner les exemples de métiers`() {
            // Given
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    exemplesDeMetiers =
                        listOf(
                            "MET.12",
                            "MET.534",
                            "MET.96",
                        ),
                )
            val explications =
                mapOf(
                    "fl0001" to explication,
                )
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)
            val metier12 = mock(Metier::class.java)
            val metier534 = mock(Metier::class.java)
            val metier96 = mock(Metier::class.java)
            val exemplesDeMetiers = listOf(metier12, metier534, metier96)
            given(metierRepository.recupererLesMetiers(listOf("MET.12", "MET.534", "MET.96"))).willReturn(
                exemplesDeMetiers,
            )

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            assertThat(resultat.second).usingRecursiveComparison().isEqualTo(exemplesDeMetiers)
        }

        @Test
        fun `doit retourner les spécialités en ignorant les inconnues`() {
            // Given
            val explication =
                ExplicationsSuggestionEtExemplesMetiers(
                    specialitesChoisies =
                        listOf(
                            ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                idSpecialite = "mat001",
                                pourcentage = 12,
                            ),
                            ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                idSpecialite = "mat002",
                                pourcentage = 1,
                            ),
                            ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                idSpecialite = "mat003",
                                pourcentage = 89,
                            ),
                            ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                idSpecialite = "matInconnue",
                                pourcentage = -100,
                            ),
                        ),
                )
            val explications = mapOf("fl0001" to explication)
            given(choixEleveService.recupererChoixEleve(explication)).willReturn(ExplicationsSuggestionDetaillees.ChoixEleve())
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = listOf("fl0001"),
                ),
            ).willReturn(explications)

            val specialites =
                listOf(
                    Specialite(id = "mat001", label = "specialiteA"),
                    Specialite(id = "mat002", label = "specialiteB"),
                    Specialite(id = "mat003", label = "specialiteC"),
                )
            given(
                specialitesRepository.recupererLesSpecialites(
                    listOf(
                        "mat001",
                        "mat002",
                        "mat003",
                        "matInconnue",
                    ),
                ),
            ).willReturn(
                specialites,
            )

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idFormation = "fl0001",
                )

            // Then
            val attendu =
                listOf(
                    ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                        idSpecialite = "mat001",
                        nomSpecialite = "specialiteA",
                        pourcentage = 12,
                    ),
                    ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                        idSpecialite = "mat002",
                        nomSpecialite = "specialiteB",
                        pourcentage = 1,
                    ),
                    ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                        idSpecialite = "mat003",
                        nomSpecialite = "specialiteC",
                        pourcentage = 89,
                    ),
                )
            assertThat(resultat.first.specialitesChoisies).usingRecursiveComparison().isEqualTo(attendu)
        }
    }

    @Nested
    inner class RecupererExplicationsPourDesFormations {
        @Test
        fun `dans le cas par défaut, doit retourner par défaut`() {
            // Given
            val explications =
                mapOf(
                    "fl0001" to ExplicationsSuggestionEtExemplesMetiers(),
                    "fl0002" to null,
                    "fl0003" to ExplicationsSuggestionEtExemplesMetiers(),
                )
            val idsFormations = listOf("fl0001", "fl0002", "fl0003")
            given(suggestionHttpClient.recupererLesExplications(profil, idsFormations)).willReturn(explications)
            val choixEleve =
                mapOf(
                    "fl0001" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                    "fl0002" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                    "fl0003" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                )
            given(choixEleveService.recupererChoixEleve(explications)).willReturn(choixEleve)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profil,
                    idsFormations,
                )

            // Then
            val attendu =
                mapOf(
                    "fl0001" to Pair(ExplicationsSuggestionDetaillees(), emptyList<Metier>()),
                    "fl0002" to Pair(ExplicationsSuggestionDetaillees(), emptyList()),
                    "fl0003" to Pair(ExplicationsSuggestionDetaillees(), emptyList()),
                )
            assertThat(resultat).usingRecursiveComparison().isEqualTo(attendu)
        }

        @Test
        fun `dans le cas complexe, doit retourner toutes les données`() {
            // Given
            val explications =
                mapOf(
                    "fl0001" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            dureeEtudesPrevue = ChoixDureeEtudesPrevue.LONGUE,
                            alternance = ChoixAlternance.TRES_INTERESSE,
                            specialitesChoisies =
                                listOf(
                                    ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                        idSpecialite = "mat001",
                                        pourcentage = 12,
                                    ),
                                    ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                        idSpecialite = "mat002",
                                        pourcentage = 1,
                                    ),
                                    ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                        idSpecialite = "mat003",
                                        pourcentage = 89,
                                    ),
                                ),
                        ),
                    "fl0002" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            specialitesChoisies =
                                listOf(
                                    ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                        idSpecialite = "mat001",
                                        pourcentage = 12,
                                    ),
                                    ExplicationsSuggestionEtExemplesMetiers.AffiniteSpecialite(
                                        idSpecialite = "matInconnue",
                                        pourcentage = 89,
                                    ),
                                ),
                            geographique =
                                listOf(
                                    ExplicationGeographique(
                                        ville = "Nantes",
                                        distanceKm = 10,
                                    ),
                                    ExplicationGeographique(
                                        ville = "Nantes",
                                        distanceKm = 85,
                                    ),
                                    ExplicationGeographique(
                                        ville = "Paris",
                                        distanceKm = 2,
                                    ),
                                    ExplicationGeographique(
                                        ville = "Paris",
                                        distanceKm = 1,
                                    ),
                                    ExplicationGeographique(
                                        ville = "Melun",
                                        distanceKm = 12,
                                    ),
                                ),
                            autoEvaluationMoyenne =
                                AutoEvaluationMoyenne(
                                    echellonDeLaMoyenneAutoEvalue = 29,
                                    rangs =
                                        ExplicationsSuggestionEtExemplesMetiers.RangsEchellons(
                                            rangEch25 = 10,
                                            rangEch50 = 14,
                                            rangEch75 = 15,
                                            rangEch10 = 9,
                                            rangEch90 = 19,
                                        ),
                                    baccalaureatUtilise = "Général",
                                ),
                            typeBaccalaureat =
                                TypeBaccalaureat(
                                    nomBaccalaureat = "P",
                                    pourcentage = 30,
                                ),
                        ),
                    "fl0003" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            autoEvaluationMoyenne =
                                AutoEvaluationMoyenne(
                                    echellonDeLaMoyenneAutoEvalue = 29,
                                    rangs =
                                        ExplicationsSuggestionEtExemplesMetiers.RangsEchellons(
                                            rangEch25 = 12,
                                            rangEch50 = 14,
                                            rangEch75 = 16,
                                            rangEch10 = 10,
                                            rangEch90 = 17,
                                        ),
                                    baccalaureatUtilise = "STMG",
                                ),
                            typeBaccalaureat =
                                TypeBaccalaureat(
                                    nomBaccalaureat = "Général",
                                    pourcentage = 18,
                                ),
                        ),
                    "fl0004" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            interetsDomainesMetiersChoisis =
                                listOf(
                                    "ci14",
                                    "MET.397",
                                    "dom8",
                                    "ci8",
                                    "ci17",
                                    "MET.103",
                                ),
                            formationsSimilaires = listOf("fl12", "fl79"),
                        ),
                    "fl0005" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            interetsDomainesMetiersChoisis = listOf("ci17", "ci8"),
                            formationsSimilaires = listOf("fl1", "fl7", "fl12"),
                        ),
                    "fl0006" to
                        ExplicationsSuggestionEtExemplesMetiers(
                            exemplesDeMetiers =
                                listOf(
                                    "MET.12",
                                    "MET.534",
                                    "MET.96",
                                ),
                        ),
                )
            given(
                baccalaureatRepository.recupererDesBaccalaureatsParIdsExternes(
                    listOf(
                        "Général",
                        "STMG",
                        "P",
                    ),
                ),
            ).willReturn(
                listOf(bacGeneral, bacPro, bacSTMG),
            )
            val domainesInteretsMetiersDistincts =
                listOf(
                    "ci14",
                    "MET.397",
                    "dom8",
                    "ci8",
                    "ci17",
                    "MET.103",
                    "T_ITM_723",
                )
            val metier397 = MetierCourt("MET.397", "analyste financier/ère")
            val metier103 = MetierCourt("MET.103", "ingénieur/e en expérimentation et production végétales")
            val centreInteret8 = InteretSousCategorie("ci8", "Créer quelque chose de mes mains", null, "\uD83E\uDE9B")
            val centreInteret14 = InteretSousCategorie("ci14", "Aider les autres", null, "\uD83E\uDEC2")
            val centreInteret17 = InteretSousCategorie("ci17", "Des sensations fortes", null, "\uD83D\uDD25")
            val domaine8 = Domaine("dom8", "Aménagement du territoire - urbanisme", null, "\uD83C\uDF04")
            given(choixEleveService.recupererChoixEleve(explications)).willReturn(
                mapOf(
                    "fl0001" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                    "fl0002" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                    "fl0003" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                    "fl0004" to
                        ExplicationsSuggestionDetaillees.ChoixEleve(
                            interetsChoisis = listOf(centreInteret14, centreInteret8, centreInteret17),
                            domainesChoisis = listOf(domaine8),
                            metiersChoisis = listOf(metier397, metier103),
                        ),
                    "fl0005" to
                        ExplicationsSuggestionDetaillees.ChoixEleve(
                            interetsChoisis = listOf(centreInteret17, centreInteret8),
                        ),
                    "fl0006" to ExplicationsSuggestionDetaillees.ChoixEleve(),
                ),
            )
            given(metierRepository.recupererLesMetiersCourts(domainesInteretsMetiersDistincts)).willReturn(listOf(metier397, metier103))
            val formationsDistinctes = listOf("fl12", "fl79", "fl1", "fl7")
            given(formationRepository.recupererLesNomsDesFormations(formationsDistinctes)).willReturn(
                listOf(
                    FormationCourte(id = "fl12", nom = "CS - Sommellerie - en apprentissage"),
                    FormationCourte(id = "fl79", nom = "L1 - Gestion - en apprentissage"),
                    FormationCourte(id = "fl1", nom = "L1 - Psychologie"),
                    FormationCourte(id = "fl7", nom = "L1 - Philosophie"),
                ),
            )
            given(voeuRepository.recupererLesNomsDesVoeux(formationsDistinctes)).willReturn(emptyList())
            val idsFormations = listOf("fl0001", "fl0002", "fl0003", "fl0004", "fl0005", "fl0006")
            val metier12 = mock(Metier::class.java)
            given(metier12.id).willReturn("MET.12")
            val metier534 = mock(Metier::class.java)
            given(metier534.id).willReturn("MET.534")
            val metier96 = mock(Metier::class.java)
            given(metier96.id).willReturn("MET.96")
            val exemplesDeMetiers = listOf(metier12, metier534, metier96)
            given(metierRepository.recupererLesMetiers(listOf("MET.12", "MET.534", "MET.96"))).willReturn(exemplesDeMetiers)
            given(
                specialitesRepository.recupererLesSpecialites(
                    listOf(
                        "mat001",
                        "mat002",
                        "mat003",
                        "matInconnue",
                    ),
                ),
            ).willReturn(
                listOf(
                    Specialite(id = "mat001", label = "specialiteA"),
                    Specialite(id = "mat002", label = "specialiteB"),
                    Specialite(id = "mat003", label = "specialiteC"),
                ),
            )
            given(
                suggestionHttpClient.recupererLesExplications(
                    profilEleve = profil,
                    idsFormations = idsFormations,
                ),
            ).willReturn(explications)

            // When
            val resultat =
                recupererExplicationsEtExemplesDeMetiersFormationService.recupererExplicationsEtExemplesDeMetiers(
                    profilEleve = profil,
                    idsFormations = idsFormations,
                )

            // Then
            val attendu =
                mapOf(
                    "fl0001" to
                        Pair(
                            ExplicationsSuggestionDetaillees(
                                dureeEtudesPrevue = ChoixDureeEtudesPrevue.LONGUE,
                                alternance = ChoixAlternance.TRES_INTERESSE,
                                specialitesChoisies =
                                    listOf(
                                        ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                                            idSpecialite = "mat001",
                                            nomSpecialite = "specialiteA",
                                            pourcentage = 12,
                                        ),
                                        ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                                            idSpecialite = "mat002",
                                            nomSpecialite = "specialiteB",
                                            pourcentage = 1,
                                        ),
                                        ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                                            idSpecialite = "mat003",
                                            nomSpecialite = "specialiteC",
                                            pourcentage = 89,
                                        ),
                                    ),
                            ),
                            emptyList(),
                        ),
                    "fl0002" to
                        Pair(
                            ExplicationsSuggestionDetaillees(
                                specialitesChoisies =
                                    listOf(
                                        ExplicationsSuggestionDetaillees.AffiniteSpecialite(
                                            idSpecialite = "mat001",
                                            nomSpecialite = "specialiteA",
                                            pourcentage = 12,
                                        ),
                                    ),
                                geographique =
                                    listOf(
                                        ExplicationGeographique(
                                            ville = "Paris",
                                            distanceKm = 1,
                                        ),
                                        ExplicationGeographique(
                                            ville = "Nantes",
                                            distanceKm = 10,
                                        ),
                                        ExplicationGeographique(
                                            ville = "Melun",
                                            distanceKm = 12,
                                        ),
                                    ),
                                explicationAutoEvaluationMoyenne =
                                    ExplicationAutoEvaluationMoyenne(
                                        moyenneAutoEvalue = 14.5f,
                                        hautIntervalleNotes = 7.5f,
                                        basIntervalleNotes = 5f,
                                        baccalaureatUtilise = bacGeneral,
                                    ),
                                explicationTypeBaccalaureat =
                                    ExplicationTypeBaccalaureat(
                                        baccalaureat = bacPro,
                                        pourcentage = 30,
                                    ),
                            ),
                            emptyList(),
                        ),
                    "fl0003" to
                        Pair(
                            ExplicationsSuggestionDetaillees(
                                explicationAutoEvaluationMoyenne =
                                    ExplicationAutoEvaluationMoyenne(
                                        moyenneAutoEvalue = 14.5f,
                                        hautIntervalleNotes = 8f,
                                        basIntervalleNotes = 6f,
                                        baccalaureatUtilise =
                                            Baccalaureat(
                                                id = "STMG",
                                                idExterne = "STMG",
                                                nom = "Série STMG",
                                                idCarteParcoursup = "2",
                                            ),
                                    ),
                                explicationTypeBaccalaureat =
                                    ExplicationTypeBaccalaureat(
                                        baccalaureat = bacGeneral,
                                        pourcentage = 18,
                                    ),
                            ),
                            emptyList(),
                        ),
                    "fl0004" to
                        Pair(
                            ExplicationsSuggestionDetaillees(
                                choixEleve =
                                    ExplicationsSuggestionDetaillees.ChoixEleve(
                                        interetsChoisis = listOf(centreInteret14, centreInteret8, centreInteret17),
                                        domainesChoisis = listOf(domaine8),
                                        metiersChoisis = listOf(metier397, metier103),
                                    ),
                                formationsSimilaires =
                                    listOf(
                                        FormationCourte(id = "fl12", nom = "CS - Sommellerie - en apprentissage"),
                                        FormationCourte(id = "fl79", nom = "L1 - Gestion - en apprentissage"),
                                    ),
                            ),
                            emptyList(),
                        ),
                    "fl0005" to
                        Pair(
                            ExplicationsSuggestionDetaillees(
                                choixEleve =
                                    ExplicationsSuggestionDetaillees.ChoixEleve(
                                        interetsChoisis = listOf(centreInteret17, centreInteret8),
                                    ),
                                formationsSimilaires =
                                    listOf(
                                        FormationCourte(id = "fl1", nom = "L1 - Psychologie"),
                                        FormationCourte(id = "fl7", nom = "L1 - Philosophie"),
                                        FormationCourte(id = "fl12", nom = "CS - Sommellerie - en apprentissage"),
                                    ),
                            ),
                            emptyList(),
                        ),
                    "fl0006" to Pair(ExplicationsSuggestionDetaillees(), exemplesDeMetiers),
                )
            assertThat(resultat).usingRecursiveComparison().isEqualTo(attendu)
        }
    }
}
