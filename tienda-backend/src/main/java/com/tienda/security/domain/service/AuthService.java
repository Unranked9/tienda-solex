package com.tienda.security.domain.service;

import com.tienda.security.api.dto.LoginRequestDto;
import com.tienda.security.api.dto.LoginResponseDto;
import com.tienda.security.api.dto.RegistroUsuarioRequestDto;
import com.tienda.security.api.dto.UsuarioResponseDto;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto dto);
    UsuarioResponseDto registrar(RegistroUsuarioRequestDto dto);
}
