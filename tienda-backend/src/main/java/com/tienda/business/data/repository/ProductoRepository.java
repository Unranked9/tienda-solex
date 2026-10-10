package com.tienda.business.data.repository;

import com.tienda.business.data.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();
    List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);
}
