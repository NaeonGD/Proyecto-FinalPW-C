package com.Tienda.LauUp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http
		.csrf(AbstractHttpConfigurer::disable)
		.authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/", "/index.html", "/*.html",
                        "/css/**", "/js/**", "/img/**",
                        "/favicon.ico", 
                        "/api/productos/**", "/api/categorias/**",
                        "/api/usuarios/**"
                    ).permitAll()
                .anyRequest().authenticated()
                )
		.formLogin(AbstractHttpConfigurer::disable)
		.httpBasic(AbstractHttpConfigurer::disable);
		
		return http.build();
	}
}
