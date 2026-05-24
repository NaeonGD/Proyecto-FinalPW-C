package com.Tienda.LauUp.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.Tienda.LauUp.model.Usuario;
import com.Tienda.LauUp.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(email, usuario.getRol().name());

        // Redirigir al frontend con el token en la URL
        String redirectUrl = "https://localhost:8443/oauth2-callback.html" +
                "?token=" + token +
                "&id=" + usuario.getId() +
                "&nombre=" + usuario.getNombre() +
                "&apellido=" + usuario.getApellido() +
                "&email=" + email +
                "&rol=" + usuario.getRol().name();

        response.sendRedirect(redirectUrl);
    }
}
