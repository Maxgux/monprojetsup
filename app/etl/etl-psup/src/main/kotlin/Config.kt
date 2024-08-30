package fr.gouv.monprojetsup.data.etl

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.PropertySource
import org.springframework.context.annotation.PropertySources

@Configuration
@PropertySources(
PropertySource("classpath:application.properties"),
PropertySource("classpath:secret.properties")
)
open class Config