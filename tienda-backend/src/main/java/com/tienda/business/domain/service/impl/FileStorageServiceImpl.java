package com.tienda.business.domain.service.impl;

import com.tienda.business.api.exception.SolicitudInvalidaException;
import com.tienda.business.domain.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final List<String> TIPOS_PERMITIDOS = List.of(
            "image/jpeg", "image/png", "image/webp", "image/jpg"
    );

    private final Path directorioBase;

    public FileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.directorioBase = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.directorioBase);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de imagenes: " + uploadDir, e);
        }
    }

    @Override
    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new SolicitudInvalidaException("Debe adjuntar un archivo de imagen");
        }
        if (!TIPOS_PERMITIDOS.contains(archivo.getContentType())) {
            throw new SolicitudInvalidaException("Solo se permiten imagenes JPG, PNG o WEBP");
        }

        String extension = obtenerExtension(archivo.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID() + extension;

        try (InputStream is = archivo.getInputStream()) {
            Path destino = this.directorioBase.resolve(nombreArchivo);
            Files.copy(is, destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }

        // Coincide con el resource handler configurado en WebConfig: /uploads/**
        return "/uploads/productos/" + nombreArchivo;
    }

    @Override
    public void eliminar(String urlRelativa) {
        if (urlRelativa == null || urlRelativa.isBlank()) {
            return;
        }
        String nombreArchivo = urlRelativa.substring(urlRelativa.lastIndexOf('/') + 1);
        try {
            Files.deleteIfExists(this.directorioBase.resolve(nombreArchivo));
        } catch (IOException ignored) {
            // Si no se puede borrar el archivo fisico, no se interrumpe el flujo principal
        }
    }

    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return "";
        }
        return nombreOriginal.substring(nombreOriginal.lastIndexOf('.'));
    }
}
