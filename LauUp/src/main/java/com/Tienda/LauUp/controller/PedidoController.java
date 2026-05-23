package com.Tienda.LauUp.controller;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	@Autowired
	private MessageSource messageSource; //Internacionalizacion
	
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
	                                       @RequestParam String estado){
	    try {
	        Pedido.Estado nuevoEstado = Pedido.Estado.valueOf(estado.toUpperCase());
	        pedidoService.cambiarEstado(id, nuevoEstado);
	        return ResponseEntity.ok(Map.of("mensaje",
	        		messageSource.getMessage("pedido.estado.actualizado", null, LocaleContextHolder.getLocale())));
	        
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
	    }
	}
	
	
	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<?> cancelar(@PathVariable Long id) {
	    try {
	        return pedidoService.buscarPorId(id).map(pedido -> {
	            // Verificar que no haya pasado más de 1 hora
	            long minutos = Duration.between(
	                pedido.getCreadoEn(), 
	                LocalDateTime.now()
	            ).toMinutes();

	            if (minutos > 60) {
	                return ResponseEntity.badRequest()
	                    .body(Map.of("error",
	                    		messageSource.getMessage("error.cancelar.tiempo",null, LocaleContextHolder.getLocale())));
	            }
	            if (pedido.getEstado() != Pedido.Estado.PENDIENTE) {
	                return ResponseEntity.badRequest()
	                    .body(Map.of("error",
	                    		messageSource.getMessage("error.cancelar.estado", null, LocaleContextHolder.getLocale())));
	            }

	            // Devolver stock
	            pedido.getDetalles().forEach(d -> {
	                d.getProducto().setStock(
	                    d.getProducto().getStock() + d.getCantidad()
	                );
	            });

	            return ResponseEntity.ok(
	                pedidoService.cambiarEstado(id, Pedido.Estado.CANCELADO)
	            );
	        }).orElse(ResponseEntity.notFound().build());
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
	    }
	}
}
