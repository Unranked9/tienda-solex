package com.tienda.security.api.dto;

public record UsuarioResponseDto(
        Long id,
        String correo,
        String rol
) {
}
