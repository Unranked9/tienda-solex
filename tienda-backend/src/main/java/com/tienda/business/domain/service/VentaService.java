package com.tienda.business.domain.service;

import com.tienda.business.api.dto.venta.VentaRequestDto;
import com.tienda.business.api.dto.venta.VentaResponseDto;

import java.util.List;

public interface VentaService {
    VentaResponseDto crear(String correoCliente, VentaRequestDto dto);
    VentaResponseDto buscarPorId(Long id);
    List<VentaResponseDto> listar();
    List<VentaResponseDto> listarPorCliente(String correoCliente);
    VentaResponseDto anular(Long id);
}
