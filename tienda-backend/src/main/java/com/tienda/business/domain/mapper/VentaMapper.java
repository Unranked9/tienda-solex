package com.tienda.business.domain.mapper;

import com.tienda.business.api.dto.venta.DetalleVentaResponseDto;
import com.tienda.business.api.dto.venta.VentaResponseDto;
import com.tienda.business.data.entity.DetalleVenta;
import com.tienda.business.data.entity.Venta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VentaMapper {

    @Mapping(target = "clienteNombre", source = "cliente.nombreCompleto")
    @Mapping(target = "clienteCorreo", source = "cliente.correo")
    VentaResponseDto toResponseDto(Venta venta);

    @Mapping(target = "productoId", source = "producto.id")
    @Mapping(target = "productoNombre", source = "producto.nombre")
    DetalleVentaResponseDto toDetalleResponseDto(DetalleVenta detalle);
    }
