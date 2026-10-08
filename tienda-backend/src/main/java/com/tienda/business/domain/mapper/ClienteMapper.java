package com.tienda.business.domain.mapper;

import com.tienda.business.api.dto.cliente.ClienteRequestDto;
import com.tienda.business.api.dto.cliente.ClienteResponseDto;
import com.tienda.business.data.entity.Cliente;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteResponseDto toResponseDto(Cliente cliente);

    Cliente toEntity(ClienteRequestDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void actualizarEntidad(ClienteRequestDto dto, @MappingTarget Cliente cliente);
}
