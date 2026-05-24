package com.Tienda.LauUp.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.Tienda.LauUp.model.Usuario;
import com.Tienda.LauUp.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuth2Service extends DefaultOAuth2UserService {
	
	private final UsuarioRepository usuarioRepository;
	
	@Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email  = oAuth2User.getAttribute("email");
        String nombre = oAuth2User.getAttribute("given_name");
        String apellido = oAuth2User.getAttribute("family_name");

        // Si el usuario no existe, lo creamos automáticamente
        usuarioRepository.findByEmail(email).orElseGet(() -> {
            Usuario nuevo = new Usuario();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre != null ? nombre : "Usuario");
            nuevo.setApellido(apellido != null ? apellido : "Google");
            nuevo.setPassword("OAUTH2_USER");
            nuevo.setRol(Usuario.Rol.CLIENTE);
            nuevo.setActivo(true);
            return usuarioRepository.save(nuevo);
        });

        return oAuth2User;
    }

}
