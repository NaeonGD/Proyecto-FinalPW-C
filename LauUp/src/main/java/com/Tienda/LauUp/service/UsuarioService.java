package com.Tienda.LauUp.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Tienda.LauUp.model.Usuario;
import com.Tienda.LauUp.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {
	
	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	
	public Usuario registrar(Usuario usuario) {
		if (usuarioRepository.existsByEmail(usuario.getEmail())) {
			throw new RuntimeException("El correo ya esta registrado");
		}
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
		usuario.setRol(Usuario.Rol.CLIENTE);
		usuario.setActivo(true);
		return usuarioRepository.save(usuario);
	}
	
	public Optional<Usuario> login(String email, String rawPassword){
		return usuarioRepository.findByEmail(email).filter(u -> u.getActivo() 
				&& passwordEncoder.matches(rawPassword, u.getPassword()));
	}
	
	public Optional<Usuario> buscarPorId(Long id){
		return usuarioRepository.findById(id);
	}
	
	public Usuario actualizar(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

}
