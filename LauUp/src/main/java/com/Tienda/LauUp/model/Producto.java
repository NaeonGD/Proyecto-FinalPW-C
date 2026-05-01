package com.Tienda.LauUp.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="cproductos")
@Data
@NoArgsConstructor
public class Producto {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 200)
	private String nombre;
	
	@Column(columnDefinition = "TEXT")
	private String descripcion;
	
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal precio;
	
	@Column(nullable = false)
	private Integer stock = 0;
	
	@Column(name = "imagen_url")
	private String imagenUrl;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "categoria_id")
	private Categoria categoria;
	
	@Column(nullable = false)
	private Boolean activo = true;
	
	@Column(name = "creado_en")
	private LocalDateTime creadoEn = LocalDateTime.now();

}
