package com.tienda.security.api.dto;

public record LoginResponseDto(
        String token,
        String tipo,
        String correo,
        String rol
) {
    public LoginResponseDto(String token, String correo, String rol) {
        this(token, "Bearer", correo, rol);
    }
}
