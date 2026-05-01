package com.Tienda.LauUp.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Tienda.LauUp.model.Producto;
import com.Tienda.LauUp.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductoController {

	
	private final ProductoService productoService;
	
	@GetMapping
	public List<Producto> listar(
			@RequestParam(required = false) Long categoriaId,
			@RequestParam(required = false) String buscar){
		
		if (categoriaId != null) return productoService.listarPorCategoria(categoriaId);
		if (buscar != null && !buscar.isBlank()) return productoService.buscarPorNombre(buscar);
		return productoService.listarActivos();
		
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Producto> detalle(@PathVariable Long id){
		return productoService.buscarPorId(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	
	@PostMapping
	public ResponseEntity<Producto> crear(@RequestBody Producto producto){
		return ResponseEntity.ok(productoService.guardar(producto));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Producto> actualizar(
			@PathVariable Long id, 
			@RequestBody Producto datos) {
		return productoService.buscarPorId(id).map(p -> {
			
            p.setNombre(datos.getNombre());
            p.setDescripcion(datos.getDescripcion());
            p.setPrecio(datos.getPrecio());
            p.setStock(datos.getStock());
            p.setImagenUrl(datos.getImagenUrl());
            p.setCategoria(datos.getCategoria());
            
            return ResponseEntity.ok(productoService.guardar(p));
            
        }).orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id){
		productoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
