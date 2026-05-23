package com.Tienda.LauUp.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.Tienda.LauUp.model.DetallePedido;
import com.Tienda.LauUp.model.Pedido;
import com.Tienda.LauUp.model.Producto;
import com.Tienda.LauUp.model.Usuario;
import com.Tienda.LauUp.repository.PedidoRepository;
import com.Tienda.LauUp.repository.ProductoRepository;
import com.Tienda.LauUp.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {
	
	private final PedidoRepository pedidoRepository;
	private final ProductoRepository productoRepository;
	private final UsuarioRepository usuarioRepository;
	private final MessageSource messageSource;
	
	@Transactional
	public Pedido crearPedido(Long usuarioId, Map<Long, Integer> carrito, String direccionEnvio) {
		
		
	Usuario usuario = usuarioRepository.findById(usuarioId)
				.orElseThrow(() -> new RuntimeException(messageSource.
						getMessage("error.usuario.noEncontrado", null, LocaleContextHolder.getLocale())
			            ));
		
		
	Pedido pedido = new Pedido();
		pedido.setUsuario(usuario);
		pedido.setDireccionEnvio(direccionEnvio);
		
		BigDecimal total = BigDecimal.ZERO;
		
		for(Map.Entry<Long, Integer> entry : carrito.entrySet()) {
			Long productoId = entry.getKey();
			Integer cantidad = entry.getValue();
			
			Producto producto = productoRepository.findById(productoId)
					.orElseThrow(() -> new RuntimeException(messageSource.
							getMessage("error.producto.noEncontrado", null, LocaleContextHolder.getLocale())
			                ));
			
			if (producto.getStock()< cantidad) {
				throw new RuntimeException(messageSource.
						getMessage("error.stock.insuficiente", new Object[]{producto.getNombre()}, 
								LocaleContextHolder.getLocale())
		                 );
			}
			
			
	DetallePedido detalle = new DetallePedido();
			detalle.setPedido(pedido);
			detalle.setProducto(producto);
			detalle.setCantidad(cantidad);
			detalle.setPrecioUnit(producto.getPrecio());
			
			pedido.getDetalles().add(detalle);
			total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
			
			producto.setStock(producto.getStock() - cantidad);
			productoRepository.save(producto);
		}
		
		pedido.setTotal(total);
		return pedidoRepository.save(pedido);
	}

	public List<Pedido> pedidosDeUsuario(Long usuarioId){
		return pedidoRepository.findByUsuarioIdOrderByCreadoEnDesc(usuarioId);
	}
	
	public Optional<Pedido> buscarPorId(Long id){
		return pedidoRepository.findById(id);
	}
	
	public List<Pedido> listarTodos() {
		return pedidoRepository.findAll();
	}
	
	public Pedido cambiarEstado(Long pedidoId, Pedido.Estado nuevoEstado) {
		Pedido pedido = pedidoRepository.findById(pedidoId)
				.orElseThrow(() -> new RuntimeException(messageSource.
						getMessage("error.pedido.noEncontrado", null, LocaleContextHolder.getLocale())
			            ));
		pedido.setEstado(nuevoEstado);
		return pedidoRepository.save(pedido);
	}
}
