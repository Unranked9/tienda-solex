package com.tienda.business.data.repository;

import com.tienda.business.data.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
    boolean existsByNombre(String nombre);
}
