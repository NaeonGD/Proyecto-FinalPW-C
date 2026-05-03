package com.Tienda.LauUp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Tienda.LauUp.model.Pedido;
import com.Tienda.LauUp.service.PedidoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PedidoController {

	private final PedidoService pedidoService;
	
	@PostMapping
	public ResponseEntity<?> crear(@RequestBody Map<String, Object> body){
		try {
			Long usuarioId = Long.valueOf(body.get("usuarioId").toString());
			Object direccionObj = body.get("direccionEnvio");
			String direccion = direccionObj != null ? direccionObj.toString() : "";
			
			@SuppressWarnings("unchecked")
			Map<String, Integer> raw = (Map<String, Integer>) body.get("carrito");
			Map<Long, Integer> carrito = new HashMap<>();
			raw.forEach((t, u) -> carrito.put(Long.valueOf(t), u));
			
			Pedido pedido = pedidoService.crearPedido(usuarioId, carrito, direccion);
			return ResponseEntity.ok(pedido);
		}catch(RuntimeException e){
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
			
		}
	}
	
	@GetMapping("/usuario/{usuarioId}")
	public List<Pedido> pedidosDeUsuario (@PathVariable Long usuarioId){
		return pedidoService.pedidosDeUsuario(usuarioId);
	}
	
	@GetMapping
	public List<Pedido> listarTodos() {
		return pedidoService.listarTodos();
	}
	
	@PatchMapping("/{id}/estado")
	public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
			@RequestBody String estado){
		try {
			Pedido.Estado nuevoEstado = Pedido.Estado.valueOf(estado.toUpperCase());
			return ResponseEntity.ok(pedidoService.cambiarEstado(id, nuevoEstado));
			
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
			
		
	}
}
