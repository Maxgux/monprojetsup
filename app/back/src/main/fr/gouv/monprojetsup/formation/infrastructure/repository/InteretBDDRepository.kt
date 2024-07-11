package fr.gouv.monprojetsup.formation.infrastructure.repository

import fr.gouv.monprojetsup.formation.domain.entity.InteretSousCategorie
import fr.gouv.monprojetsup.formation.domain.port.InteretRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class InteretBDDRepository(
    val interetJPARepository: InteretJPARepository,
) : InteretRepository {
    @Transactional(readOnly = true)
    override fun recupererLesSousCategoriesDInterets(idsInterets: List<String>): Map<String, InteretSousCategorie> {
        return interetJPARepository.findAllByIdIn(idsInterets).associate { it.id to it.sousCategorie.toInteretSousCategorie() }
    }
}