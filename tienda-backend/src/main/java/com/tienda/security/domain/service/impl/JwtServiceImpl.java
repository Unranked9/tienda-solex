package com.tienda.security.domain.service.impl;

import com.tienda.security.domain.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    private final SecretKey clave;
    private final long expiracionMs;

    public JwtServiceImpl(@Value("${jwt.secret}") String secretoBase64,
                           @Value("${jwt.expiration}") long expiracionMs) {
        this.clave = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secretoBase64));
        this.expiracionMs = expiracionMs;
    }

    @Override
    public String generarToken(UserDetails userDetails) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expiracionMs);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(clave)
                .compact();
    }

    @Override
    public String extraerCorreo(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    @Override
    public boolean esTokenValido(String token, UserDetails userDetails) {
        String correo = extraerCorreo(token);
        return correo.equals(userDetails.getUsername()) && !estaExpirado(token);
    }

    private boolean estaExpirado(String token) {
        return extraerClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extraerClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
