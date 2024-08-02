package fr.gouv.monprojetsup.data.app.entity

import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.io.Serializable

@Entity
@Table(name = "moyenne_generale_admis")
class MoyenneGeneraleAdmisEntity {
    @EmbeddedId
    lateinit var id: MoyenneGeneraleAdmisId

    @Type(ListArrayType::class)
    @Column(name = "frequences_cumulees")
    lateinit var frequencesCumulees: List<Int>

    @Column(name = "annee", insertable = false, updatable = false)
    lateinit var annee: String

    @Column(name = "id_formation", insertable = false, updatable = false)
    lateinit var idFormation: String

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_bac", insertable = false, updatable = false)
    lateinit var baccalaureat: BaccalaureatEntity
}

@Embeddable
class MoyenneGeneraleAdmisId : Serializable {
    @Column(name = "annee")
    lateinit var annee: String

    @Column(name = "id_formation")
    lateinit var idFormation: String

    @Column(name = "id_bac")
    lateinit var idBaccalaureat: String
}
