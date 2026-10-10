package com.tienda.business.domain.service.impl;

import com.tienda.business.api.dto.cliente.ClienteRequestDto;
import com.tienda.business.api.dto.cliente.ClienteResponseDto;
import com.tienda.business.api.exception.RecursoDuplicadoException;
import com.tienda.business.api.exception.RecursoNoEncontradoException;
import com.tienda.business.data.entity.Cliente;
import com.tienda.business.data.repository.ClienteRepository;
import com.tienda.business.data.repository.VentaRepository;
import com.tienda.business.domain.mapper.ClienteMapper;
import com.tienda.business.domain.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;
    private final ClienteMapper clienteMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDto> listar() {
        return clienteRepository.findAll().stream()
                .map(clienteMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDto buscarPorId(Long id) {
        return clienteMapper.toResponseDto(obtenerEntidad(id));
    }

    @Override
    public ClienteResponseDto crear(ClienteRequestDto dto) {
        if (clienteRepository.existsByCorreo(dto.correo())) {
            throw new RecursoDuplicadoException("Ya existe un cliente con el correo '" + dto.correo() + "'");
        }
        Cliente cliente = clienteMapper.toEntity(dto);
        return clienteMapper.toResponseDto(clienteRepository.save(cliente));
    }

    @Override
    public ClienteResponseDto actualizar(Long id, ClienteRequestDto dto) {
        Cliente cliente = obtenerEntidad(id);
        clienteMapper.actualizarEntidad(dto, cliente);
        return clienteMapper.toResponseDto(clienteRepository.save(cliente));
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = obtenerEntidad(id);
        if (ventaRepository.existsByClienteId(id)) {
            throw new RecursoDuplicadoException(
                    "No se puede eliminar al cliente '" + cliente.getNombreCompleto() + "' porque tiene ventas registradas");
        }
        clienteRepository.delete(cliente);
    }

    @Override
    @Transactional(readOnly = true)
    public Cliente obtenerEntidadPorCorreo(String correo) {
        return clienteRepository.findByCorreo(correo)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontro un cliente asociado al correo: " + correo));
    }

    private Cliente obtenerEntidad(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cliente no encontrado con id: " + id));
    }
}
