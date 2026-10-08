package com.tienda.business.domain.service.impl;

import com.tienda.business.api.dto.producto.ProductoRequestDto;
import com.tienda.business.api.dto.producto.ProductoResponseDto;
import com.tienda.business.api.exception.RecursoNoEncontradoException;
import com.tienda.business.data.entity.Categoria;
import com.tienda.business.data.entity.Producto;
import com.tienda.business.data.repository.CategoriaRepository;
import com.tienda.business.data.repository.ProductoRepository;
import com.tienda.business.domain.mapper.ProductoMapper;
import com.tienda.business.domain.service.FileStorageService;
import com.tienda.business.domain.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoMapper productoMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDto> listar() {
        return productoRepository.findByActivoTrue().stream()
                .map(productoMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponseDto> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId).stream()
                .map(productoMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponseDto buscarPorId(Long id) {
        return productoMapper.toResponseDto(obtenerEntidad(id));
    }

    @Override
    public ProductoResponseDto crear(ProductoRequestDto dto) {
        Categoria categoria = obtenerCategoria(dto.categoriaId());

        Producto producto = productoMapper.toEntity(dto);
        producto.setCategoria(categoria);
        producto.setActivo(true);

        return productoMapper.toResponseDto(productoRepository.save(producto));
    }

    @Override
    public ProductoResponseDto actualizar(Long id, ProductoRequestDto dto) {
        Producto producto = obtenerEntidad(id);

        if (!producto.getCategoria().getId().equals(dto.categoriaId())) {
            producto.setCategoria(obtenerCategoria(dto.categoriaId()));
        }

        productoMapper.actualizarEntidad(dto, producto);
        return productoMapper.toResponseDto(productoRepository.save(producto));
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = obtenerEntidad(id);
        // Baja logica: no se borra fisicamente para no romper el historial de ventas (DetalleVenta)
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    @Override
    public ProductoResponseDto actualizarImagen(Long id, MultipartFile archivo) {
        Producto producto = obtenerEntidad(id);

        String urlAnterior = producto.getImagenUrl();
        String nuevaUrl = fileStorageService.guardar(archivo);
        producto.setImagenUrl(nuevaUrl);

        Producto guardado = productoRepository.save(producto);

        if (urlAnterior != null && !urlAnterior.isBlank()) {
            fileStorageService.eliminar(urlAnterior);
        }

        return productoMapper.toResponseDto(guardado);
    }

    private Producto obtenerEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado con id: " + id));
    }

    private Categoria obtenerCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada con id: " + categoriaId));
    }
}
