package com.tienda.business.api.dto.categoria;

public record CategoriaResponseDto(
        Long id,
        String nombre,
        String descripcion
) {
}
