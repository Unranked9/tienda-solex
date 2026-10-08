package com.tienda.security.domain.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String generarToken(UserDetails userDetails);
    String extraerCorreo(String token);
    boolean esTokenValido(String token, UserDetails userDetails);
}
