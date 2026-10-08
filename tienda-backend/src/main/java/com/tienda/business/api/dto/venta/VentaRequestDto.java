package com.tienda.business.api.dto.venta;

import com.tienda.business.data.entity.enums.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record VentaRequestDto(

        @NotEmpty(message = "Debe incluir al menos un producto en la venta")
        @Valid
        List<DetalleVentaRequestDto> detalles,

        @NotNull(message = "El metodo de pago es obligatorio")
        MetodoPago metodoPago
) {
}
