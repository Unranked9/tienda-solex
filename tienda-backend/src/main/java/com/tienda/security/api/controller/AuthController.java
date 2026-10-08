package com.tienda.security.api.controller;

import com.tienda.security.api.dto.LoginRequestDto;
import com.tienda.security.api.dto.LoginResponseDto;
import com.tienda.security.api.dto.RegistroUsuarioRequestDto;
import com.tienda.security.api.dto.UsuarioResponseDto;
import com.tienda.security.domain.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDto> registrar(@Valid @RequestBody RegistroUsuarioRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(dto));
    }
}
