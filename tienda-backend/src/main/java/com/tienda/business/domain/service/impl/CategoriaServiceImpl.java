package com.tienda.business.domain.service.impl;

import com.tienda.business.api.dto.categoria.CategoriaRequestDto;
import com.tienda.business.api.dto.categoria.CategoriaResponseDto;
import com.tienda.business.api.exception.RecursoDuplicadoException;
import com.tienda.business.api.exception.RecursoNoEncontradoException;
import com.tienda.business.data.entity.Categoria;
import com.tienda.business.data.repository.CategoriaRepository;
import com.tienda.business.domain.mapper.CategoriaMapper;
import com.tienda.business.domain.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponseDto> listar() {
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponseDto buscarPorId(Long id) {
        return categoriaMapper.toResponseDto(obtenerEntidad(id));
    }

    @Override
    public CategoriaResponseDto crear(CategoriaRequestDto dto) {
        if (categoriaRepository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new RecursoDuplicadoException("Ya existe una categoria con el nombre '" + dto.nombre() + "'");
        }
        Categoria categoria = categoriaMapper.toEntity(dto);
        return categoriaMapper.toResponseDto(categoriaRepository.save(categoria));
    }

    @Override
    public CategoriaResponseDto actualizar(Long id, CategoriaRequestDto dto) {
        Categoria categoria = obtenerEntidad(id);

        categoriaRepository.findByNombreIgnoreCase(dto.nombre()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new RecursoDuplicadoException("Ya existe una categoria con el nombre '" + dto.nombre() + "'");
            }
        });

        categoriaMapper.actualizarEntidad(dto, categoria);
        return categoriaMapper.toResponseDto(categoriaRepository.save(categoria));
    }

    @Override
    public void eliminar(Long id) {
        Categoria categoria = obtenerEntidad(id);
        categoriaRepository.delete(categoria);
    }

    private Categoria obtenerEntidad(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Categoria no encontrada con id: " + id));
    }
}
