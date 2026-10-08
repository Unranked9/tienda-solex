package com.tienda.business.domain.mapper;

import com.tienda.business.api.dto.categoria.CategoriaRequestDto;
import com.tienda.business.api.dto.categoria.CategoriaResponseDto;
import com.tienda.business.data.entity.Categoria;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    CategoriaResponseDto toResponseDto(Categoria categoria);

    Categoria toEntity(CategoriaRequestDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void actualizarEntidad(CategoriaRequestDto dto, @MappingTarget Categoria categoria);
}
