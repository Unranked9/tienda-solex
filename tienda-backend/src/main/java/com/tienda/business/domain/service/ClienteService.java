package com.tienda.business.domain.service;

import com.tienda.business.api.dto.cliente.ClienteRequestDto;
import com.tienda.business.api.dto.cliente.ClienteResponseDto;
import com.tienda.business.data.entity.Cliente;

import java.util.List;

public interface ClienteService {
    List<ClienteResponseDto> listar();
    ClienteResponseDto buscarPorId(Long id);
    ClienteResponseDto crear(ClienteRequestDto dto);
    ClienteResponseDto actualizar(Long id, ClienteRequestDto dto);
    void eliminar(Long id);

    // Usado internamente (ej. por VentaService) para obtener la entidad a partir del correo del JWT
    Cliente obtenerEntidadPorCorreo(String correo);
}
