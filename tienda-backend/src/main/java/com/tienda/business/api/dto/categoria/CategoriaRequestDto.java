package com.tienda.business.api.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDto(

        @NotBlank(message = "El nombre de la categoria es obligatorio")
        @Size(max = 80, message = "El nombre no debe superar los 80 caracteres")
        String nombre,

        @Size(max = 255, message = "La descripcion no debe superar los 255 caracteres")
        String descripcion
) {
}
