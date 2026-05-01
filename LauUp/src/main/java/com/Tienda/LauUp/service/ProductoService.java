package com.Tienda.LauUp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.Tienda.LauUp.model.Producto;
import com.Tienda.LauUp.repository.ProductoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {
	
	private final ProductoRepository productoRepository;
	
	public List<Producto> listarActivos() {
		return productoRepository.findByActivoTrue();
	}
	
	public List<Producto> listarPorCategoria(Long categoriaId){
		return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId);
		
	}
	
	public List<Producto> buscarPorNombre(String nombre) {
		return productoRepository.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
	}
	
	public Optional<Producto> buscarPorId(Long id){
		return productoRepository.findById(id);
	}
	
	public Producto guardar(Producto producto) {
		return productoRepository.save(producto);
	}
	
	public void eliminar(Long id) {
		productoRepository.findById(id).ifPresent(p -> {
			p.setActivo(false);
			productoRepository.save(p);
		});
	}

}
