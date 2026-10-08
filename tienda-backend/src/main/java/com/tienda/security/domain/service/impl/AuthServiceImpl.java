package com.tienda.security.domain.service.impl;

import com.tienda.business.api.exception.RecursoDuplicadoException;
import com.tienda.business.data.entity.Cliente;
import com.tienda.business.data.repository.ClienteRepository;
import com.tienda.security.api.dto.LoginRequestDto;
import com.tienda.security.api.dto.LoginResponseDto;
import com.tienda.security.api.dto.RegistroUsuarioRequestDto;
import com.tienda.security.api.dto.UsuarioResponseDto;
import com.tienda.security.data.entity.NombreRol;
import com.tienda.security.data.entity.Rol;
import com.tienda.security.data.entity.Usuario;
import com.tienda.security.data.repository.RolRepository;
import com.tienda.security.data.repository.UsuarioRepository;
import com.tienda.security.domain.service.AuthService;
import com.tienda.security.domain.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        // Si las credenciales son invalidas, lanza BadCredentialsException
        // (capturada globalmente por GlobalExceptionHandler -> 401)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.correo(), dto.contrasena())
        );

        Usuario usuario = usuarioRepository.findByCorreo(dto.correo())
                .orElseThrow();

        String token = jwtService.generarToken(usuario);
        return new LoginResponseDto(token, usuario.getCorreo(), usuario.getRol().getNombre().name());
    }

    @Override
    public UsuarioResponseDto registrar(RegistroUsuarioRequestDto dto) {
        if (usuarioRepository.existsByCorreo(dto.correo())) {
            throw new RecursoDuplicadoException("Ya existe una cuenta con el correo '" + dto.correo() + "'");
        }

        // Todo registro publico se crea como CLIENTE.
        // Los roles ADMIN/EMPLEADO se asignan manualmente en base de datos.
        Rol rolCliente = rolRepository.findByNombre(NombreRol.CLIENTE)
                .orElseThrow(() -> new IllegalStateException("El rol CLIENTE no esta configurado en la base de datos"));

        Usuario usuario = Usuario.builder()
                .correo(dto.correo())
                .contrasena(passwordEncoder.encode(dto.contrasena()))
                .habilitado(true)
                .rol(rolCliente)
                .build();
        usuarioRepository.save(usuario);

        // Se crea tambien el registro de Cliente (mismo correo) para poder generar ventas
        Cliente cliente = Cliente.builder()
                .nombreCompleto(dto.nombreCompleto())
                .correo(dto.correo())
                .build();
        clienteRepository.save(cliente);

        return new UsuarioResponseDto(usuario.getId(), usuario.getCorreo(), usuario.getRol().getNombre().name());
    }
}
