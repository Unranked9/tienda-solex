package com.tienda.business.api.controller;

import com.tienda.business.api.dto.producto.ProductoRequestDto;
import com.tienda.business.api.dto.producto.ProductoResponseDto;
import com.tienda.business.domain.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponseDto>> listar(
            @RequestParam(required = false) Long categoriaId) {
        if (categoriaId != null) {
            return ResponseEntity.ok(productoService.listarPorCategoria(categoriaId));
        }
        return ResponseEntity.ok(productoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDto> crear(@Valid @RequestBody ProductoRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDto> actualizar(@PathVariable Long id,
                                                            @Valid @RequestBody ProductoRequestDto dto) {
        return ResponseEntity.ok(productoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Subir o reemplazar la imagen de un producto ya creado.
    // En Angular se envia como FormData con la clave "imagen" (multipart/form-data).
    @PostMapping(value = "/{id}/imagen", consumes = "multipart/form-data")
    public ResponseEntity<ProductoResponseDto> actualizarImagen(@PathVariable Long id,
                                                                  @RequestParam("imagen") MultipartFile imagen) {
        return ResponseEntity.ok(productoService.actualizarImagen(id, imagen));
    }
}
