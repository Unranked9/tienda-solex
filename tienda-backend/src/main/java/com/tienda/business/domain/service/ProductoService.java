package com.tienda.business.domain.service;

import com.tienda.business.api.dto.producto.ProductoRequestDto;
import com.tienda.business.api.dto.producto.ProductoResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductoService {
    List<ProductoResponseDto> listar();
    List<ProductoResponseDto> listarPorCategoria(Long categoriaId);
    ProductoResponseDto buscarPorId(Long id);
    ProductoResponseDto crear(ProductoRequestDto dto);
    ProductoResponseDto actualizar(Long id, ProductoRequestDto dto);
    void eliminar(Long id);
    ProductoResponseDto actualizarImagen(Long id, MultipartFile archivo);
}
