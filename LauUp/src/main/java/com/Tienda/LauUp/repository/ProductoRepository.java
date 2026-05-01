package com.Tienda.LauUp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Tienda.LauUp.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
	
	List<Producto> findByActivoTrue();
	List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);
	List<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);
}
