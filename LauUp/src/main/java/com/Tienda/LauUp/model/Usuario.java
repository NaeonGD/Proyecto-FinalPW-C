package com.Tienda.LauUp.model;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="usuarios")
@Data
@NoArgsConstructor
public class Usuario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 100)
	private String nombre;
	
	@Column(nullable = false, length = 100)
	private String apellido;
	
	@Column(nullable = false, unique =true, length = 100)
	private String email;
	
	@Column(nullable = false)
	private String password;
	
	@Column(length = 20)
	private String telefono;
	
	@Column(columnDefinition = "TEXT")
	private String dirrecion;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol = Rol.CLIENTE;

	@Column(nullable = false)
	private Boolean activo = true;
	
	@Column(name = "creado_en")
	private LocalDateTime creadoEn = LocalDateTime.now();
	
	
	
	public enum Rol {CLIENTE, ADMIN}
}
