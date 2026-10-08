package com.tienda.business.api.dto.cliente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequestDto(

        @NotBlank(message = "El nombre completo es obligatorio")
        @Size(max = 120, message = "El nombre no debe superar los 120 caracteres")
        String nombreCompleto,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato valido")
        String correo,

        @Size(max = 20, message = "El telefono no debe superar los 20 caracteres")
        String telefono,

        @Size(max = 255, message = "La direccion no debe superar los 255 caracteres")
        String direccion
) {
}
