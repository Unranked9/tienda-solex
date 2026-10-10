package com.tienda.business.api.controller;

import com.tienda.business.api.dto.venta.VentaRequestDto;
import com.tienda.business.api.dto.venta.VentaResponseDto;
import com.tienda.business.domain.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;


    @PostMapping
    public ResponseEntity<VentaResponseDto> crear(Authentication authentication,
                                                    @Valid @RequestBody VentaRequestDto request) {
        String correoCliente = authentication.getName();
        VentaResponseDto response = ventaService.crear(correoCliente, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.buscarPorId(id));
    }


    @GetMapping("/mis-compras")
    public ResponseEntity<List<VentaResponseDto>> misCompras(Authentication authentication) {
        return ResponseEntity.ok(ventaService.listarPorCliente(authentication.getName()));
    }


    @GetMapping
    public ResponseEntity<List<VentaResponseDto>> listar() {
        return ResponseEntity.ok(ventaService.listar());
    }

    @PatchMapping("/{id}/anular")
    public ResponseEntity<VentaResponseDto> anular(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.anular(id));
    }
}
