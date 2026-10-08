package com.tienda.business.api.dto.cliente;

public record ClienteResponseDto(
        Long id,
        String nombreCompleto,
        String correo,
        String telefono,
        String direccion
) {
}
