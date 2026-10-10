package com.tienda.business.api.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ApiErrorResponse> manejarNoEncontrado(RecursoNoEncontradoException ex, HttpServletRequest request) {
        return construir(HttpStatus.NOT_FOUND, ex.getMessage(), request, List.of());
    }

    @ExceptionHandler(RecursoDuplicadoException.class)
    public ResponseEntity<ApiErrorResponse> manejarDuplicado(RecursoDuplicadoException ex, HttpServletRequest request) {
        return construir(HttpStatus.CONFLICT, ex.getMessage(), request, List.of());
    }

    @ExceptionHandler(SolicitudInvalidaException.class)
    public ResponseEntity<ApiErrorResponse> manejarSolicitudInvalida(SolicitudInvalidaException ex, HttpServletRequest request) {
        return construir(HttpStatus.BAD_REQUEST, ex.getMessage(), request, List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> manejarValidacion(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> detalles = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .toList();
        return construir(HttpStatus.BAD_REQUEST, "Los datos enviados no son validos", request, detalles);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> manejarTipoInvalido(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String mensaje = "El valor enviado para '" + ex.getName() + "' no tiene un formato valido";
        return construir(HttpStatus.BAD_REQUEST, mensaje, request, List.of());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> manejarArchivoGrande(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        return construir(HttpStatus.PAYLOAD_TOO_LARGE, "El archivo supera el tamaño maximo permitido (5MB)", request, List.of());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> manejarCredenciales(BadCredentialsException ex, HttpServletRequest request) {
        return construir(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos", request, List.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> manejarAccesoDenegado(AccessDeniedException ex, HttpServletRequest request) {
        return construir(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta accion", request, List.of());
    }

    // Respaldo para violaciones de integridad referencial no validadas explicitamente
    // en el service (ej: FK sin el existsBy... correspondiente). No se expone el
    // detalle de la BD al cliente.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> manejarIntegridadDatos(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Violacion de integridad de datos en {}", request.getRequestURI(), ex);
        return construir(HttpStatus.CONFLICT, "No se puede completar la operacion porque el registro tiene datos relacionados", request, List.of());
    }

    // Handler "catch-all": no debe filtrar el mensaje interno de la excepcion
    // (puede contener detalles de la BD, rutas de archivos, stacktrace, etc.).
    // El detalle completo se registra en el log del servidor; al cliente solo
    // se le devuelve un mensaje generico. Este es el mismo criterio que aplica
    // el profesor en su GlobalExceptionHandler.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> manejarGenerico(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {}", request.getRequestURI(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrio un error interno en el servidor", request, List.of());
    }

    private ResponseEntity<ApiErrorResponse> construir(HttpStatus status, String mensaje, HttpServletRequest request, List<String> detalles) {
        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                mensaje,
                request.getRequestURI(),
                detalles
        );
        return ResponseEntity.status(status).body(body);
    }
}
