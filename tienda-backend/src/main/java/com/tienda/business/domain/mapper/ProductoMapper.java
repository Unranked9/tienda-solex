package com.tienda.business.domain.mapper;

import com.tienda.business.api.dto.producto.ProductoRequestDto;
import com.tienda.business.api.dto.producto.ProductoResponseDto;
import com.tienda.business.data.entity.Producto;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "categoriaNombre", source = "categoria.nombre")
    ProductoResponseDto toResponseDto(Producto producto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imagenUrl", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    Producto toEntity(ProductoRequestDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imagenUrl", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    void actualizarEntidad(ProductoRequestDto dto, @MappingTarget Producto producto);
}
