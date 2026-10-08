package com.tienda.business.api.dto.producto;

import java.math.BigDecimal;

public record ProductoResponseDto(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        String imagenUrl,
        Boolean activo,
        Long categoriaId,
        String categoriaNombre
) {
}
