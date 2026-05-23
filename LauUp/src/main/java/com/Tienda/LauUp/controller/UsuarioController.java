package com.Tienda.LauUp.controller;

import java.util.Map; 

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Tienda.LauUp.config.JwtUtil;
import com.Tienda.LauUp.model.Usuario;
import com.Tienda.LauUp.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UsuarioController {
	
	private final UsuarioService usuarioService;
	private final JwtUtil jwtUtil; // para el jwt
	
	@PostMapping("/registro")
	public ResponseEntity<?> registro(@RequestBody Usuario usuario){
		try {
			Usuario creado = usuarioService.registrar(usuario);
			creado.setPassword(null);
			return ResponseEntity.ok(creado);
		}catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
			
		}
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
	    return usuarioService.login(body.get("email"), body.get("password"))
	            .map(u -> {
	                String token = jwtUtil.generarToken(u.getEmail(), u.getRol().name());
	                u.setPassword(null);
	                Map<String, Object> respuesta = new java.util.HashMap<>();
	                respuesta.put("token", token);
	                respuesta.put("usuario", u);
	                return ResponseEntity.ok((Object) respuesta);
	            })
	            .orElse(ResponseEntity.status(401)
	                    .body(Map.of("error", "Credenciales incorrectas")));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Usuario> perfil(@PathVariable Long id) {
		return usuarioService.buscarPorId(id)
				.map(u -> {
					u.setPassword(null);
					return ResponseEntity.ok(u);
				})
				.orElse(ResponseEntity.notFound().build());
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos){
		return usuarioService.buscarPorId(id).map(u -> {
            u.setNombre(datos.getNombre());
            u.setApellido(datos.getApellido());
            u.setTelefono(datos.getTelefono());
            u.setDirrecion(datos.getDirrecion());
            Usuario guardado = usuarioService.actualizar(u);
            guardado.setPassword(null);
            return ResponseEntity.ok(guardado);
        }).orElse(ResponseEntity.notFound().build());
	}

}
