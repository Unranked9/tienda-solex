package com.tienda.business.domain.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * Guarda un archivo de imagen y devuelve la URL relativa para consumir
     * desde el frontend (ej: /uploads/productos/uuid.jpg).
     */
    String guardar(MultipartFile archivo);

    /**
     * Elimina un archivo previamente guardado a partir de su URL relativa.
     */
    void eliminar(String urlRelativa);
}
