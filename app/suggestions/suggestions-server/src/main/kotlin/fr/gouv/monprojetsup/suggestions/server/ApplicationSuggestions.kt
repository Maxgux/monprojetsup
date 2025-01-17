package fr.gouv.monprojetsup.suggestions.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.filter.ForwardedHeaderFilter


fun main(args: Array<String>) {
    runApplication<ApplicationSuggestions>(*args)
}

@Bean
fun forwardedHeaderFilter(): ForwardedHeaderFilter {
    return ForwardedHeaderFilter()
}

@SpringBootApplication
@EnableScheduling
@Configuration
class ApplicationSuggestions

@Configuration
@ComponentScan(basePackages = [
    "fr.gouv.monprojetsup.suggestions",
    "fr.gouv.monprojetsup.suggestions.config",
    "fr.gouv.monprojetsup.data.formation.infrastructure",
    "fr.gouv.monprojetsup.data.metier.infrastructure",
    "fr.gouv.monprojetsup.data.referentiel.infrastructure",
    "fr.gouv.monprojetsup.data.suggestions.infrastructure"
])
@EntityScan(basePackages = [
    "fr.gouv.monprojetsup.data",
    "fr.gouv.monprojetsup.suggestions.entities"
]
)
@EnableJpaRepositories(basePackages = [
    "fr.gouv.monprojetsup.suggestions"]
)
class JpaConfig

/**
 * Version of the API used to implement the service,
 * used in the controllers to define the context of the endpoints
 */
const val API_VERSION = "1.2"

/**
 * Base path for the service
 */
const val BASE_PATH = "/api/$API_VERSION"

