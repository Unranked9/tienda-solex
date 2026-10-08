package com.tienda.business.api.dto.venta;

import java.math.BigDecimal;

public record DetalleVentaResponseDto(
        Long productoId,
        String productoNombre,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {
}
