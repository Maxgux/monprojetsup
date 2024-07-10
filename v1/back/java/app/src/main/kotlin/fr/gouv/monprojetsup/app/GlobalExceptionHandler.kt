package fr.gouv.monprojetsup.app

import fr.gouv.monprojetsup.app.server.MyAppService.handleAnException
import fr.gouv.monprojetsup.app.server.MyServiceException
import fr.gouv.monprojetsup.app.server.ServerStartingException
import org.springframework.context.annotation.Primary
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest


@ControllerAdvice
@Primary
class AppGlobalExceptionHandler {

    // Generic exception handler
    @ExceptionHandler(Exception::class)
    fun handleGlobalException(ex: Exception, request: WebRequest?): ResponseEntity<*> {
        return ResponseEntity<Any>(ex, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    // MyService exception handler
    @ExceptionHandler(MyServiceException::class)
    fun handleRMyServiceException(ex: MyServiceException, request: WebRequest?): ResponseEntity<*> {
        val inner = ex.cause
        val response = handleAnException(inner, ex.request, if (request != null) request.toString() else null)

        return ResponseEntity<Any>(response, HttpStatus.OK)
    }

    @ExceptionHandler(ServerStartingException::class)
    fun handleRMyServiceException(ex: ServerStartingException, request: WebRequest?): ResponseEntity<*> {
        val inner = ex.cause
        val response = handleAnException(inner, ex.message, null)
        return ResponseEntity<Any>(response, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}