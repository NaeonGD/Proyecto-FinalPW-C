package com.Tienda.LauUp.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.expiration}")
	private String secret;
	
	@Value("${jwt.expiration}")
	private long expiration;
	
	
	private SecretKey getKey() {
		// return Keys.hmacShaKeyFor(secret.getBytes());
		// Convertir el secret a Base64 para garantizar 256 bits
	    byte[] keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
	    // Rellenar si es necesario hasta 32 bytes
	    byte[] key32 = new byte[32];
	    System.arraycopy(keyBytes, 0, key32, 0, Math.min(keyBytes.length, 32));
	    return Keys.hmacShaKeyFor(key32);
	}
	
	//Token Generator
	public String generarToken(String email, String rol) {
		return Jwts.builder().subject(email)
				.claim("rol", rol).claim("iss", "LauUp App")
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis()+expiration))
				.signWith(getKey()).compact();
	}
	
	//Obtener email del token
	public String obtenerEmail(String token) {
		return getClaims(token).getSubject();
	}
	
	// Obtener rol del token
    public String obtenerRol(String token) {
        return getClaims(token).get("rol", String.class);
    }

    // Validar token
    public boolean validarToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Obtener claims (payload)
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
