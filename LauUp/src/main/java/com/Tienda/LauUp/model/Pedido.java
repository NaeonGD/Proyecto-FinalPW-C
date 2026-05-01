package com.Tienda.LauUp.model;



import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="pedidos")
@Data
@NoArgsConstructor
public class Pedido {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id", nullable = false)
	private Usuario usuario;
	
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal total;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Estado estado = Estado.PENDIENTE;
	
	@Column(name = "direccion_envio", columnDefinition = "TEXT")
	private String dirrecionEnvio;
	
	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetallePedido> detalles = new ArrayList<>();
	
	@Column(name = "creado_en")
	private LocalDateTime creadoEn = LocalDateTime.now();
	
	public enum Estado {PENDIENTE, PAGADO, ENVIADO, ENTREGADO, CANCELADO}
	

}
