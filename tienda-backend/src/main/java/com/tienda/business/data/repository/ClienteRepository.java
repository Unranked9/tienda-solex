package com.tienda.business.data.repository;

import com.tienda.business.data.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
