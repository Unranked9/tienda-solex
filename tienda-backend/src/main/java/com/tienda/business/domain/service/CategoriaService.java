package com.tienda.business.domain.service;

import com.tienda.business.api.dto.categoria.CategoriaRequestDto;
import com.tienda.business.api.dto.categoria.CategoriaResponseDto;

import java.util.List;

public interface CategoriaService {
    List<CategoriaResponseDto> listar();
    CategoriaResponseDto buscarPorId(Long id);
    CategoriaResponseDto crear(CategoriaRequestDto dto);
    CategoriaResponseDto actualizar(Long id, CategoriaRequestDto dto);
    void eliminar(Long id);
}
