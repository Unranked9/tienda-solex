package com.tienda.business.domain.service.impl;

import com.tienda.business.api.dto.venta.DetalleVentaRequestDto;
import com.tienda.business.api.dto.venta.VentaRequestDto;
import com.tienda.business.api.dto.venta.VentaResponseDto;
import com.tienda.business.api.exception.RecursoNoEncontradoException;
import com.tienda.business.api.exception.SolicitudInvalidaException;
import com.tienda.business.data.entity.Cliente;
import com.tienda.business.data.entity.DetalleVenta;
import com.tienda.business.data.entity.Producto;
import com.tienda.business.data.entity.Venta;
import com.tienda.business.data.entity.enums.EstadoVenta;
import com.tienda.business.data.repository.ProductoRepository;
import com.tienda.business.data.repository.VentaRepository;
import com.tienda.business.domain.mapper.VentaMapper;
import com.tienda.business.domain.service.ClienteService;
import com.tienda.business.domain.service.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteService clienteService;
    private final VentaMapper ventaMapper;

    @Override
    public VentaResponseDto crear(String correoCliente, VentaRequestDto dto) {
        // 1. El cliente se obtiene del correo que viene del JWT, nunca del request
        Cliente cliente = clienteService.obtenerEntidadPorCorreo(correoCliente);

        // 2. Se construye la venta
        Venta venta = Venta.builder()
                .numeroVenta(generarNumeroVenta())
                .cliente(cliente)
                .metodoPago(dto.metodoPago())
                .estado(EstadoVenta.PAGADA)
                .fecha(LocalDateTime.now())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        // 3. Por cada detalle: se valida stock y se toma el precio REAL de la BD (nunca del frontend)
        for (DetalleVentaRequestDto detalleDto : dto.detalles()) {
            Producto producto = productoRepository.findById(detalleDto.productoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Producto no encontrado con id: " + detalleDto.productoId()));

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new SolicitudInvalidaException("El producto '" + producto.getNombre() + "' ya no esta disponible");
            }

            if (producto.getStock() < detalleDto.cantidad()) {
                throw new SolicitudInvalidaException(
                        "Stock insuficiente para '" + producto.getNombre() + "'. Disponible: " + producto.getStock());
            }

            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(detalleDto.cantidad()));

            DetalleVenta detalle = DetalleVenta.builder()
                    .producto(producto)
                    .cantidad(detalleDto.cantidad())
                    .precioUnitario(producto.getPrecio())
                    .subtotal(subtotal)
                    .build();

            venta.agregarDetalle(detalle);
            total = total.add(subtotal);

            // 4. Se descuenta el stock
            producto.setStock(producto.getStock() - detalleDto.cantidad());
            productoRepository.save(producto);
        }

        venta.setTotal(total);

        Venta guardada = ventaRepository.save(venta);
        return ventaMapper.toResponseDto(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public VentaResponseDto buscarPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Venta no encontrada con id: " + id));
        return ventaMapper.toResponseDto(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponseDto> listar() {
        return ventaRepository.findAll().stream()
                .map(ventaMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VentaResponseDto> listarPorCliente(String correoCliente) {
        return ventaRepository.findByClienteCorreoOrderByFechaDesc(correoCliente).stream()
                .map(ventaMapper::toResponseDto)
                .toList();
    }

    private String generarNumeroVenta() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int aleatorio = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "V-" + fecha + "-" + aleatorio;
    }
}
