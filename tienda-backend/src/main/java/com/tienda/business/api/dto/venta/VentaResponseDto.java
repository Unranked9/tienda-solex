package com.tienda.business.api.dto.venta;

import com.tienda.business.data.entity.enums.EstadoVenta;
import com.tienda.business.data.entity.enums.MetodoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record VentaResponseDto(
        Long id,
        String numeroVenta,
        String clienteNombre,
        String clienteCorreo,
        List<DetalleVentaResponseDto> detalles,
        BigDecimal total,
        MetodoPago metodoPago,
        EstadoVenta estado,
        LocalDateTime fecha
) {
}
