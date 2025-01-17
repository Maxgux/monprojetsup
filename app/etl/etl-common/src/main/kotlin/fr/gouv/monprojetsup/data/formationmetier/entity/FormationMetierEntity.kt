package fr.gouv.monprojetsup.data.formationmetier.entity

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "ref_join_formation_metier")
class FormationMetierEntity {

    @EmbeddedId
    lateinit var id: FormationMetierEntityId

    @Column(name = "id_formation", insertable = false, updatable = false)
    lateinit var idFormation: String

    @Column(name = "id_metier", insertable = false, updatable = false)
    lateinit var idMetier: String

}

@Embeddable
data class FormationMetierEntityId(
    @Column(name = "id_formation", nullable = false)
    val idFormation: String,

    @Column(name = "id_metier", nullable = false)
    val idMetier: String
) {
    @Suppress("unused")
    constructor() : this("", "")
}
